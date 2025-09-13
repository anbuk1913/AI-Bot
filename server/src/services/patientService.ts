import { Patient, IPatient } from '../models/Patient';
import { logger } from '../utils/logger';

class PatientService {
  async getPatientById(patientId: string): Promise<IPatient | null> {
    try {
      return await Patient.findOne({ patientId });
    } catch (error) {
      logger.error('Error fetching patient:', error);
      throw new Error('Failed to fetch patient information');
    }
  }

  async getPatientAppointments(patientId: string) {
    try {
      const patient = await Patient.findOne({ patientId });
      return patient?.appointments || [];
    } catch (error) {
      logger.error('Error fetching appointments:', error);
      throw new Error('Failed to fetch appointments');
    }
  }

  async getPatientMedications(patientId: string) {
    try {
      const patient = await Patient.findOne({ patientId });
      return patient?.medicalHistory.medications || [];
    } catch (error) {
      logger.error('Error fetching medications:', error);
      throw new Error('Failed to fetch medications');
    }
  }

  async getPatientTestResults(patientId: string) {
    try {
      const patient = await Patient.findOne({ patientId });
      return patient?.testResults || [];
    } catch (error) {
      logger.error('Error fetching test results:', error);
      throw new Error('Failed to fetch test results');
    }
  }

  async getPatientBilling(patientId: string) {
    try {
      const patient = await Patient.findOne({ patientId });
      return patient?.billing || null;
    } catch (error) {
      logger.error('Error fetching billing information:', error);
      throw new Error('Failed to fetch billing information');
    }
  }
}

export const patientService = new PatientService();