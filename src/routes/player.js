import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js'; 
import playerController from '../controllers/playerController.js';

const router = Router();

router.get('/', playerController.selectPlayers);

router.post('/', playerController.insertPlayer);

router.put('/:id', playerController.updatePlayer);


router.delete('/:id', playerController.removePlayerById);

router.delete('/', playerController.removePlayersByFilters);

// router.delete('/:id', authMiddleware, playerController.removePlayer);


export default router;

