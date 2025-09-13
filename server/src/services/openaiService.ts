import OpenAI from 'openai';
import { config } from '../utils/config';
import { logger } from '../utils/logger';
import { ChatMessage } from '../types/openai';

class OpenAIService {
  private openai: OpenAI;

  constructor() {
    if (!config.openaiApiKey) {
      logger.error('OpenAI API key not provided');
      throw new Error('OpenAI API key is required');
    }

    this.openai = new OpenAI({
      apiKey: config.openaiApiKey,
    });
  }

  async generateResponse(messages: ChatMessage[]): Promise<string> {
    try {
      const systemPrompt = `You are a helpful healthcare assistant for a patient information system. 
      You can help patients with:
      - Appointment scheduling and information
      - Medication information and reminders
      - Test results interpretation (general information only)
      - Billing and insurance questions
      - General health information

      Important guidelines:
      - Always be empathetic and patient-friendly
      - Never provide specific medical diagnosis or treatment advice
      - Always recommend consulting healthcare providers for medical concerns
      - For urgent symptoms, direct patients to emergency services
      - Keep responses clear, concise, and easy to understand
      - If you don't have specific patient information, explain that you need to access their records`;

      const chatMessages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...messages
      ];

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: chatMessages,
        max_tokens: 500,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response generated from OpenAI');
      }

      return response.trim();
    } catch (error) {
      logger.error('OpenAI API error:', error);
      throw new Error('Failed to generate AI response');
    }
  }
}

export const openaiService = new OpenAIService();
