import { Request, Response } from 'express';
import { Settlement } from '../models/Settlement';
import { parseCsvBuffer } from '../utils/csvParser'; // We will build this utility next

export const uploadSettlements = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const batchId = req.body.batchId; // Sent from frontend

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!batchId) {
      return res.status(400).json({ error: 'Batch ID is required for idempotency' });
    }

    // 1. Idempotency Check: Have we processed this batch before?
    const existingBatch = await Settlement.findOne({ batchId });
    if (existingBatch) {
      return res.status(409).json({ 
        error: 'Idempotency failure: This batch ID has already been uploaded.' 
      });
    }

    // 2. Parse File (CSV or JSON)
    let records: any[] = [];
    if (file.originalname.endsWith('.csv')) {
      records = await parseCsvBuffer(file.buffer);
    } else if (file.originalname.endsWith('.json')) {
      records = JSON.parse(file.buffer.toString());
    } else {
      return res.status(400).json({ error: 'Unsupported file format. Use CSV or JSON.' });
    }

    // 3. Validate Row Count
    if (records.length > 1000) {
      return res.status(400).json({ error: 'Max 1,000 rows allowed per batch.' });
    }

    // 4. Map records to add batchId and default status
    const settlementsToInsert = records.map(record => ({
      ...record,
      batchId,
      status: 'PENDING_REVIEW'
    }));

    // 5. Bulk Insert into MongoDB
    await Settlement.insertMany(settlementsToInsert);

    return res.status(201).json({
      message: 'Batch uploaded successfully',
      recordsProcessed: records.length,
      batchId
    });

  } catch (error) {
    console.error('Upload Error:', error);
    return res.status(500).json({ error: 'Internal server error during upload' });
  }
};

export const getSettlements = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const filter = status && status !== 'ALL' ? { status } : {};
    
    const settlements = await Settlement.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(settlements);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch settlements' });
  }
};