export interface Patient {
  patientId: string;
  name: string;
  age: number;
  upcomingAppointments: number;
  currentMedications: number;
  accountBalance: number;
}

export interface Appointment {
  date: Date;
  doctor: string;
  department: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
}

export interface TestResult {
  testName: string;
  date: Date;
  results: object;
  normalRange: string;
  status: 'normal' | 'abnormal' | 'pending';
}

export interface BillingInfo {
  balance: number;
  lastPayment: Date;
  paymentHistory: {
    date: Date;
    amount: number;
    method: string;
  }[];
}