import express from 'express';
import { getSummary } from '../controllers/summaryController.js';

const router = express.Router();

router.get('/:userId', getSummary);

export default router;
