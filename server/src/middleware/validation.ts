import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validateChatMessage = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    message: Joi.string().required().min(1).max(1000).optional(),
    patientId: Joi.string().optional(),
    selectedApi: Joi.string().optional(),
    userId: Joi.string(),
    history: Joi.array().items(Joi.string().min(1).max(200)).optional(),
    contexts: Joi.array()
      .items(Joi.string().min(1).max(200))
      .optional()
      .max(20)
      .unique(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }

  if (req.body.contexts) {
    const hasEmptyContexts = req.body.contexts.some((context: string) => !context.trim());
    if (hasEmptyContexts) {
      return res.status(400).json({
        success: false,
        error: 'Context items cannot be empty or contain only whitespace'
      });
    }
    req.body.contexts = req.body.contexts.map((context: string) => context.trim());
  }

  next();
};