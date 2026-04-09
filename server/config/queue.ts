import { Queue } from 'bullmq';

// We default to the standard Redis port which matches our docker-compose
const redisOptions = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
};

// Create a new BullMQ Queue instance
export const notificationQueue = new Queue('discrepancy-notifications', {
  connection: redisOptions,
});

console.log('BullMQ Queue initialized: discrepancy-notifications');