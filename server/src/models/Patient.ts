import mongoose, { Document, Schema } from 'mongoose';

export interface IPatient extends Document {
  patientId: string;
  name: string;
  email: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  medicalHistory: {
    conditions: string[];
    medications: {
      name: string;
      dosage: string;
      frequency: string;
      startDate: Date;
      endDate?: Date;
    }[];
    allergies: string[];
  };
  appointments: {
    date: Date;
    doctor: string;
    department: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    notes?: string;
  }[];
  testResults: {
    testName: string;
    date: Date;
    results: object;
    normalRange: string;
    status: 'normal' | 'abnormal' | 'pending';
  }[];
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
  billing: {
    balance: number;
    lastPayment: Date;
    paymentHistory: {
      date: Date;
      amount: number;
      method: string;
    }[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema = new Schema<IPatient>({
  patientId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  phoneNumber: { type: String, required: true },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  medicalHistory: {
    conditions: [String],
    medications: [{
      name: String,
      dosage: String,
      frequency: String,
      startDate: Date,
      endDate: Date
    }],
    allergies: [String]
  },
  appointments: [{
    date: Date,
    doctor: String,
    department: String,
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled'] },
    notes: String
  }],
  testResults: [{
    testName: String,
    date: Date,
    results: Object,
    normalRange: String,
    status: { type: String, enum: ['normal', 'abnormal', 'pending'] }
  }],
  insurance: {
    provider: String,
    policyNumber: String,
    groupNumber: String
  },
  billing: {
    balance: Number,
    lastPayment: Date,
    paymentHistory: [{
      date: Date,
      amount: Number,
      method: String
    }]
  }
}, {
  timestamps: true
});

export const Patient = mongoose.model<IPatient>('Patient', PatientSchema);
