import { Request, Response, NextFunction } from 'express';
import { patientService } from '../services/patientService';
import { logger } from '../utils/logger';

export const getPatientInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { patientId } = req.params;
    
    const patient = await patientService.getPatientById(patientId);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    // Remove sensitive information
    const patientInfo = {
      patientId: patient.patientId,
      name: patient.name,
      age: patient.age,
      upcomingAppointments: patient.appointments.filter(apt => 
        apt.status === 'scheduled' && apt.date > new Date()
      ).length,
      currentMedications: patient.medicalHistory.medications.length,
      accountBalance: patient.billing?.balance || 0
    };

    res.json({
      success: true,
      data: patientInfo
    });

  } catch (error) {
    logger.error('Get patient info error:', error);
    next(error);
  }
};

export const getAppointments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { patientId } = req.params;
    
    const appointments = await patientService.getPatientAppointments(patientId);
    
    res.json({
      success: true,
      data: appointments
    });

  } catch (error) {
    logger.error('Get appointments error:', error);
    next(error);
  }
};

export const getMedications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { patientId } = req.params;
    
    const medications = await patientService.getPatientMedications(patientId);
    
    res.json({
      success: true,
      data: medications
    });

  } catch (error) {
    logger.error('Get medications error:', error);
    next(error);
  }
};

export const getTestResults = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { patientId } = req.params;
    
    const testResults = await patientService.getPatientTestResults(patientId);
    
    res.json({
      success: true,
      data: testResults
    });

  } catch (error) {
    logger.error('Get test results error:', error);
    next(error);
  }
};

export const getBillingInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { patientId } = req.params;
    
    const billing = await patientService.getPatientBilling(patientId);
    
    res.json({
      success: true,
      data: billing
    });

  } catch (error) {
    logger.error('Get billing info error:', error);
    next(error);
  }
};
