import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true },
  awbNumber: { type: String, required: true },
  merchantId: { type: String, required: true },
  discrepancyType: { type: String, required: true },
  status: { type: String, enum: ['QUEUED', 'SENT', 'FAILED', 'RETRIED'], default: 'QUEUED' },
  attempts: { type: Number, default: 0 },
  webhookResponse: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema);