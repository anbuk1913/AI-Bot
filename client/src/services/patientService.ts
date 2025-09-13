import { apiService } from './api';
// import { Patient, Appointment, Medication, TestResult, BillingInfo } from '../types';
import { Patient } from '../types/patient';
import { Appointment } from '../types/patient';
import { Medication } from '../types/patient';
import { TestResult } from '../types/patient';
import { BillingInfo } from '../types/patient';

class PatientService {
  async getPatientInfo(patientId: string): Promise<Patient> {
    try {
      return await apiService.get<Patient>(`/patient/${patientId}`);
    } catch (error) {
      throw new Error(`Failed to fetch patient information: ${error}`);
    }
  }

  async getAppointments(patientId: string): Promise<Appointment[]> {
    try {
      return await apiService.get<Appointment[]>(`/patient/${patientId}/appointments`);
    } catch (error) {
      throw new Error(`Failed to fetch appointments: ${error}`);
    }
  }

  async getMedications(patientId: string): Promise<Medication[]> {
    try {
      return await apiService.get<Medication[]>(`/patient/${patientId}/medications`);
    } catch (error) {
      throw new Error(`Failed to fetch medications: ${error}`);
    }
  }

  async getTestResults(patientId: string): Promise<TestResult[]> {
    try {
      return await apiService.get<TestResult[]>(`/patient/${patientId}/test-results`);
    } catch (error) {
      throw new Error(`Failed to fetch test results: ${error}`);
    }
  }

  async getBillingInfo(patientId: string): Promise<BillingInfo> {
    try {
      return await apiService.get<BillingInfo>(`/patient/${patientId}/billing`);
    } catch (error) {
      throw new Error(`Failed to fetch billing information: ${error}`);
    }
  }
}

export const patientService = new PatientService();
