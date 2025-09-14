export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateMessage = (message: string): ValidationResult => {
  if (!message.trim()) {
    return { isValid: false, error: 'Message cannot be empty' };
  }
  
  if (message.length > 1000) {
    return { isValid: false, error: 'Message is too long (max 1000 characters)' };
  }
  
  return { isValid: true };
};

export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  if (!value.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  return { isValid: true };
};