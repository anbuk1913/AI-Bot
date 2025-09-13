import express from 'express';
import {
  getPatientInfo,
  getAppointments,
  getMedications,
  getTestResults,
  getBillingInfo
} from '../controllers/patientController';
import { validatePatientId } from '../middleware/validation';

const router = express.Router();

router.get('/:patientId', validatePatientId, getPatientInfo);
router.get('/:patientId/appointments', validatePatientId, getAppointments);
router.get('/:patientId/medications', validatePatientId, getMedications);
router.get('/:patientId/test-results', validatePatientId, getTestResults);
router.get('/:patientId/billing', validatePatientId, getBillingInfo);

export default router;