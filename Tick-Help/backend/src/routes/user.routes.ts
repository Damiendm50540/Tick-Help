import { Router } from 'express';
import { deleteUser } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// DELETE /api/auth/profile - Supprimer le compte utilisateur connecté
router.delete('/profile', authenticate, deleteUser);

export default router;
