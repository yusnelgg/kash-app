import express from 'express';
import { sql } from '../config/db.js';
import { createTransaction, getTransactions, deleteTransaction } from '../controllers/transactionsController.js';

const router = express.Router();

router.post('/', createTransaction);
router.get('/:userId', getTransactions);
router.delete('/:id', deleteTransaction);

export default router;
