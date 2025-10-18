import express from 'express';
import { 
  loginAdmin, 
  getAllSupervisors, 
  getSupervisorById,
  updateSupervisor,
  deleteSupervisor,
  approveSupervisor, 
  rejectSupervisor 
} from '../controllers/adminController.js';

const router = express.Router();

// Admin authentication
router.post('/login', loginAdmin);

// Supervisor management
router.get('/supervisors', getAllSupervisors);
router.get('/supervisors/:id', getSupervisorById);
router.put('/supervisors/:id', updateSupervisor);
router.delete('/supervisors/:id', deleteSupervisor);
router.patch('/supervisors/:id/approve', approveSupervisor);
router.patch('/supervisors/:id/reject', rejectSupervisor);

export default router;
