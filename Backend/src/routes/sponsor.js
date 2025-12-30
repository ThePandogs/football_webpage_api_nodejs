import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import SponsorController from '../controllers/sponsorController.js';

const router = Router();

router.get('/', SponsorController.getAllSponsors);
router.get('/id/:id', SponsorController.getSponsorById);
router.get('/importance/:importance', SponsorController.getSponsorByImportance);
router.post('/', authMiddleware, SponsorController.createSponsor);
router.put('/id/:id', authMiddleware, SponsorController.updateSponsor);
router.delete('/id/:id', authMiddleware, SponsorController.removeSponsor);

export default router;
