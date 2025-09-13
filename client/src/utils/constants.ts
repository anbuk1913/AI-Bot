export const APP_CONFIG = {
  name: 'HealthCare Assistant',
  version: '1.0.0',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  supportPhone: '(555) 987-6543',
  emergencyPhone: '911',
  billingPhone: '(555) 123-4567',
} as const;

export const COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
  },
  secondary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    500: '#6b7280',
    600: '#4b5563',
    800: '#1f2937',
  },
} as const;

export const QUICK_ACTIONS = [
  { label: "My Appointments", query: "When is my next appointment?" },
  { label: "Test Results", query: "Can I see my latest test results?" },
  { label: "Medications", query: "What medications am I currently taking?" },
  { label: "Billing Information", query: "What is my current account balance?" },
] as const;
