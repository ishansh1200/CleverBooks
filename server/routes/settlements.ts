import { Router } from 'express';
import multer from 'multer';
import { uploadSettlements, getSettlements } from '../controllers/settlementController';
import { runReconciliation } from '../services/reconciliationService';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Standard Ingestion & Listing
router.post('/upload', upload.single('file'), uploadSettlements);
router.get('/', getSettlements);

// MANUAL TRIGGER: For demo purposes to fire the reconciliation engine
router.post('/trigger-reconciliation', async (req, res) => {
  try {
    // Fire and forget the reconciliation process
    runReconciliation(); 
    res.status(202).json({ 
      message: 'Reconciliation process has been manually initiated.' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to trigger reconciliation engine.' });
  }
});

export const settlementRoutes = router;