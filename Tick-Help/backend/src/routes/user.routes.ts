import { Router } from 'express';
import { deleteUser, changePassword } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// PUT /api/auth/change-password - Changer le mot de passe de l'utilisateur connecté
router.put('/change-password', authenticate, changePassword);

// DELETE /api/auth/profile - Supprimer le compte utilisateur connecté
router.delete('/profile', authenticate, deleteUser);

export default router;
