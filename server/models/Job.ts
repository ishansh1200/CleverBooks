import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  jobId: { type: String, required: true, unique: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  recordsProcessed: { type: Number, default: 0 },
  discrepanciesFound: { type: Number, default: 0 },
  status: { type: String, enum: ['RUNNING', 'COMPLETED', 'FAILED'], default: 'RUNNING' },
  errorLog: { type: String }
}, { timestamps: true });

export const Job = mongoose.model('Job', jobSchema);