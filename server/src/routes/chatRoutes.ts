import express from 'express';
import { sendMessage } from '../controllers/chatController';
import { getHistory, addContext, removeContext, getContext } from '../controllers/history'
import { validateChatMessage } from '../middleware/validation';

const router = express.Router();

router.post('/message', validateChatMessage, sendMessage);
router.get('/history/:userid', getHistory)
router.get('/contexts/:userId', getContext)
router.post('/add/:userId', addContext)
router.post('/remove/:userid', removeContext)

export default router;