import express from 'express';
import { sendMessage } from '../controllers/chatController';
import { validateChatMessage } from '../middleware/validation';

const router = express.Router();

router.post('/message', validateChatMessage, sendMessage);

export default router;