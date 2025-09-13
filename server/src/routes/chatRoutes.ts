import express from 'express';
import { sendMessage, getChatHistory } from '../controllers/chatController';
import { validateChatMessage } from '../middleware/validation';

const router = express.Router();

router.post('/message', validateChatMessage, sendMessage);
router.get('/history/:patientId/:sessionId', getChatHistory);

export default router;