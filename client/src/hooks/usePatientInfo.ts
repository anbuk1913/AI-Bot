import { useState, useEffect } from 'react';
import { Patient } from '../types/patient';
import { patientService } from '../services/patientService';
import toast from 'react-hot-toast';

export const usePatientInfo = (patientId?: string) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (patientId) {
      fetchPatientInfo(patientId);
    }
  }, [patientId]);

  const fetchPatientInfo = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const patientData = await patientService.getPatientInfo(id);
      setPatient(patientData);
    } catch (err) {
      console.log(err);
      const errorMessage =  'Failed to fetch patient information';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { patient, loading, error, refetch: () => patientId && fetchPatientInfo(patientId) };
};