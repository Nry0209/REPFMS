import express from 'express';
import { 
  getResearches, 
  getResearchById, 
  listCollections, 
  assignSupervisor,
  getAvailableSupervisors,
  updateSupervisorStatus,
  deleteResearch,
  getResearchTitles
} from '../controllers/researchController.js';

const router = express.Router();

// Public routes
router.get('/', getResearches);
router.get('/titles', getResearchTitles);
router.get('/:id', getResearchById);

// Supervisor assignment
router.put('/:id/supervisor', assignSupervisor);
router.put('/:id/status', updateSupervisorStatus);
router.get('/supervisors/available', getAvailableSupervisors);

// Delete research
router.delete('/:id', deleteResearch);

// Debug routes
router.get('/debug/collections', listCollections);

export default router;
