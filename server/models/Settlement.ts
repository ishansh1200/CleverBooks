import mongoose from 'mongoose';

const settlementSchema = new mongoose.Schema({
  awbNumber: { type: String, required: true, index: true },
  settledCodAmount: { type: Number, required: true },
  chargedWeight: { type: Number, required: true },
  forwardCharge: { type: Number, required: true },
  rtoCharge: { type: Number, required: true },
  codHandlingFee: { type: Number, required: true },
  settlementDate: { type: Date, required: true },
  batchId: { type: String, required: true, index: true }, // Crucial for Idempotency
  
  // Appended by our reconciliation engine:
  status: { type: String, enum: ['PENDING_REVIEW', 'MATCHED', 'DISCREPANCY'], default: 'PENDING_REVIEW' },
  discrepancyTypes: [{ type: String }], // e.g., 'Weight Dispute', 'Phantom RTO'
}, { timestamps: true });

export const Settlement = mongoose.model('Settlement', settlementSchema);