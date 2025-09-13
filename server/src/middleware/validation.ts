import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validateChatMessage = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    message: Joi.string().required().min(1).max(1000),
    patientId: Joi.string().optional(),
    sessionId: Joi.string().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }

  next();
};

export const validatePatientId = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    patientId: Joi.string().required()
  });

  const { error } = schema.validate(req.params);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }

  next();
};