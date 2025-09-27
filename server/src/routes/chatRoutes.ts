import express from 'express';
import { sendMessage } from '../controllers/chatController';
import { getHistory } from '../controllers/history'
import { validateChatMessage } from '../middleware/validation';

const router = express.Router();

router.post('/message', validateChatMessage, sendMessage);
router.get('/history/:userid', getHistory)

export default router;