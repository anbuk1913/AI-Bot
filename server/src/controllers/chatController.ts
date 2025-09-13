import { Request, Response, NextFunction } from 'express';
import { openaiService } from '../services/openaiService';
import { patientService } from '../services/patientService';
import { ChatHistory } from '../models/ChatHistory';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message, patientId, sessionId } = req.body;
    const currentSessionId = sessionId || uuidv4();

    // Get patient context if patientId provided
    let patientContext = '';
    if (patientId) {
      const patient = await patientService.getPatientById(patientId);
      if (patient) {
        patientContext = `Patient Information:
        Name: ${patient.name}
        Age: ${patient.age}
        Current Medications: ${patient.medicalHistory.medications.map(med => `${med.name} ${med.dosage}`).join(', ')}
        Upcoming Appointments: ${patient.appointments.filter(apt => apt.status === 'scheduled').length}
        Account Balance: ${patient.billing?.balance || 0}`;
      }
    }

    // Prepare messages for OpenAI
    const messages = [
      {
        role: 'user' as const,
        content: patientContext ? `${patientContext}\n\nPatient Question: ${message}` : message
      }
    ];

    // Generate AI response
    const aiResponse = await openaiService.generateResponse(messages);

    // Save chat history
    if (patientId) {
      await ChatHistory.findOneAndUpdate(
        { patientId, sessionId: currentSessionId },
        {
          $push: {
            messages: [
              { role: 'user', content: message, timestamp: new Date() },
              { role: 'assistant', content: aiResponse, timestamp: new Date() }
            ]
          }
        },
        { upsert: true, new: true }
      );
    }

    res.json({
      success: true,
      data: {
        response: aiResponse,
        sessionId: currentSessionId
      }
    });

  } catch (error) {
    logger.error('Chat controller error:', error);
    next(error);
  }
};

export const getChatHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { patientId, sessionId } = req.params;

    const chatHistory = await ChatHistory.findOne({ patientId, sessionId });

    res.json({
      success: true,
      data: chatHistory?.messages || []
    });

  } catch (error) {
    logger.error('Get chat history error:', error);
    next(error);
  }
};