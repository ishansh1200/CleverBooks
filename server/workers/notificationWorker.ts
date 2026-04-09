import { Worker } from 'bullmq';
import { Notification } from '../models/Notification';

const redisOptions = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
};

// Replace this with a unique URL generated from https://webhook.site
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://webhook.site/YOUR-UNIQUE-ID';

export const initWorker = () => {
  const worker = new Worker('discrepancy-notifications', async job => {
    const { merchantId, awbNumber, discrepancyTypes, expectedValues, actualValues } = job.data;
    
    // We use the BullMQ job ID to create a unique event ID for idempotency
    const eventId = `evt_${job.id}`; 

    console.log(`[Worker] Processing notification for AWB: ${awbNumber}`);

    // 1. Log the notification attempt in MongoDB
    let notificationLog = await Notification.findOne({ eventId });
    if (!notificationLog) {
      notificationLog = new Notification({
        eventId,
        merchantId,
        awbNumber,
        discrepancyType: discrepancyTypes.join(', '),
        status: 'QUEUED',
        attempts: 0
      });
    }

    notificationLog.attempts += 1;
    await notificationLog.save();

    // 2. Prepare the payload formatted for the merchant
    const payload = {
      merchantId,
      awbNumber,
      discrepancyType: discrepancyTypes.join(', '),
      expectedValue: expectedValues,
      actualValue: actualValues,
      suggestedAction: 'Please review this discrepancy and file a dispute with the courier within 48 hours.',
      timestamp: new Date().toISOString()
    };

    try {
      // 3. Make the External API Call (Simulating merchant notification)
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // BONUS: Idempotency Key ensures if the webhook provider gets this twice, 
          // they don't process it twice.
          'Idempotency-Key': eventId 
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Webhook failed with status: ${response.status}`);
      }

      // 4. Update MongoDB Log on Success
      notificationLog.status = 'SENT';
      notificationLog.webhookResponse = await response.text();
      await notificationLog.save();

      console.log(`[Worker] Notification SENT for AWB: ${awbNumber}`);

    } catch (error: any) {
      console.error(`[Worker] Failed to send notification for AWB: ${awbNumber} - ${error.message}`);
      
      // If this is the last attempt before BullMQ gives up (we will configure 3 attempts)
      if (job.attemptsMade >= 2) {
        notificationLog.status = 'FAILED';
      } else {
        notificationLog.status = 'RETRIED';
      }
      
      notificationLog.webhookResponse = { error: error.message };
      await notificationLog.save();

      // Rethrowing the error tells BullMQ the job failed, triggering the exponential backoff retry
      throw error;
    }

  }, { connection: redisOptions });

  // Optional: Global Event Listeners for debugging
  worker.on('completed', job => console.log(`[Worker] Job ${job.id} has completed!`));
  worker.on('failed', (job, err) => console.log(`[Worker] Job ${job?.id} has failed with ${err.message}`));

  console.log('Worker initialized and listening to queue: discrepancy-notifications');
};