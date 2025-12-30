import { Router } from 'express';
import jwt from 'jsonwebtoken';
import authController from '../controllers/authController.js';

const router = Router();

const isAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(403).send('Token required');

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).send('Invalid token');

        if (decoded.role !== 'administrator') {
            return res.status(403).send('Insufficient permissions');
        }
        req.user = decoded;
        next();
    });
};

// Rutas
router.post('/login', authController.login);
router.post('/create', isAdmin, authController.createUser);

export default router;
