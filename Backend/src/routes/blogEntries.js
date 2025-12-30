import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js'; 
import blogEntriesController from '../controllers/blogEntriesController.js';

const router = Router();

router.get('/', blogEntriesController.getAllBlogEntries);

router.get('/:id', blogEntriesController.getBlogEntryById);

router.post('/', authMiddleware, blogEntriesController.createBlogEntry);

router.put('/:id', authMiddleware, blogEntriesController.updateBlogEntry);

router.delete('/:id', authMiddleware, blogEntriesController.removeBlogEntry);

export default router;
