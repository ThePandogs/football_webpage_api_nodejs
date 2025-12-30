import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import directionController from '../controllers/directonController.js';

const router = Router();

router.get('/', directionController.selectDirectors);

router.post('/', directionController.insertDirector);

router.put('/:id', directionController.updateDirector);


router.delete('/:id', directionController.removeDirectorById);

router.delete('/', directionController.removeDirectorsByFilters);

// router.delete('/:id', authMiddleware, playerController.removePlayer);


export default router;