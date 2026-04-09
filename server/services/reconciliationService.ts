import cron from 'node-cron';
import { Settlement } from '../models/Settlement';
import { Order } from '../models/Order';
import { Job } from '../models/Job';
import { notificationQueue } from '../config/queue';

/**
 * Core Reconciliation Logic
 * Compares courier claims vs merchant expectations.
 */
export const runReconciliation = async () => {
  console.log(`[${new Date().toISOString()}] Starting Reconciliation Job...`);
  
  // 1. Create a Job log entry
  const jobLog = new Job({
    jobId: `RECON-${Date.now()}`,
    startTime: new Date(),
    status: 'RUNNING'
  });
  await jobLog.save();

  try {
    // 2. Fetch all settlements that haven't been processed yet
    const pendingSettlements = await Settlement.find({ status: 'PENDING_REVIEW' });
    let discrepanciesFound = 0;

    for (const settlement of pendingSettlements) {
      // Find corresponding order
      const order = await Order.findOne({ awbNumber: settlement.awbNumber });
      
      if (!order) {
        // Edge case: Courier sent settlement for an AWB the merchant doesn't have
        continue; 
      }

      const flags: string[] = [];

      // --- RULE 1: COD Short-remittance ---
      // Tolerance is 2% of expected COD or ₹10, whichever is lower
      const tolerance = Math.min(order.codAmount * 0.02, 10);
      if (settlement.settledCodAmount < (order.codAmount - tolerance)) {
        flags.push('COD Short-remittance');
      }

      // --- RULE 2: Weight Dispute ---
      // Charged weight is more than 10% over declared weight
      if (settlement.chargedWeight > (order.declaredWeight * 1.10)) {
        flags.push('Weight Dispute');
      }

      // --- RULE 3: Phantom RTO Charge ---
      // RTO charge applied but order was successfully delivered
      if (settlement.rtoCharge > 0 && order.orderStatus === 'DELIVERED') {
        flags.push('Phantom RTO Charge');
      }

      // --- Determine Final Status & Publish to Queue ---
      if (flags.length > 0) {
        settlement.status = 'DISCREPANCY';
        settlement.discrepancyTypes = flags;
        discrepanciesFound++;

        // HARD REQUIREMENT: Decouple notification. 
        // Push event to Redis queue, DO NOT send API call from here.
        await notificationQueue.add('notify-merchant', {
          merchantId: order.merchantId,
          awbNumber: settlement.awbNumber,
          discrepancyTypes: flags,
          expectedValues: {
            cod: order.codAmount,
            weight: order.declaredWeight,
            status: order.orderStatus
          },
          actualValues: {
            cod: settlement.settledCodAmount,
            weight: settlement.chargedWeight,
            rtoCharge: settlement.rtoCharge
          }
        }, {
          // BONUS: Retry with exponential back-off
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000
          }
        });
      } else {
        settlement.status = 'MATCHED';
      }

      await settlement.save();
    }

    // 3. Update Job Log
    jobLog.endTime = new Date();
    jobLog.recordsProcessed = pendingSettlements.length;
    jobLog.discrepanciesFound = discrepanciesFound;
    jobLog.status = 'COMPLETED';
    await jobLog.save();

    console.log(`[${new Date().toISOString()}] Reconciliation complete. Processed: ${pendingSettlements.length}, Discrepancies: ${discrepanciesFound}`);

  } catch (error: any) {
    console.error('Reconciliation Job Failed:', error);
    jobLog.endTime = new Date();
    jobLog.status = 'FAILED';
    jobLog.errorLog = error.message;
    await jobLog.save();
  }
};

/**
 * Initialize the Cron Job
 * Runs at 2:00 AM IST every day.
 */
export const initCronJobs = () => {
  // '0 2 * * *' = 2:00 AM every day
  // Set timezone explicitly to Asia/Kolkata (IST) as required by the assignment
  cron.schedule('0 2 * * *', async () => {
    await runReconciliation();
  }, {
    scheduled: true,
    timezone: "Asia/Kolkata"
  });
  
  console.log('IST Cron Scheduler Initialized.');
};