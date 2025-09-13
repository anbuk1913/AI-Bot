import { Request } from 'express';

export interface CustomRequest extends Request {
  patient?: {
    id: string;
    name: string;
    email: string;
  };
}