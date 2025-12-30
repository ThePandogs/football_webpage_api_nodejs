import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js'; 
import teamController from '../controllers/teamController.js';

const router = Router();

router.get('/', teamController.selectTeams);

router.post('/', teamController.insertTeam);

router.put('/', authMiddleware, teamController.updateTeam);

router.delete('/', authMiddleware, teamController.removeTeam);

export default router;
