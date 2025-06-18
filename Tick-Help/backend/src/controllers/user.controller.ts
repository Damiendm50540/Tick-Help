import { Request, Response } from 'express';
import { User, Ticket } from '../models';

/**
 * Change le mot de passe de l'utilisateur connecté
 * @route PUT /api/auth/change-password
 * @access Private
 */
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé' });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Mot de passe actuel et nouveau mot de passe requis' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier que le mot de passe actuel est correct
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
    }

    // Mettre à jour le mot de passe (le hachage est géré par le hook beforeUpdate)
    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: 'Mot de passe modifié avec succès' });
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    return res.status(500).json({ message: 'Erreur lors du changement de mot de passe', error });
  }
};

/**
 * Supprime le compte utilisateur connecté
 * @route DELETE /api/auth/profile
 * @access Private
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    // L'ID utilisateur doit être extrait du token (middleware authenticate)
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé' });
    }
    // Mettre à jour les tickets créés ou assignés pour ne plus référencer l'utilisateur supprimé
    await Ticket.update({ createdById: null }, { where: { createdById: userId } });
    await Ticket.update({ assigneeId: null }, { where: { assigneeId: userId } });
    // Supprimer l'utilisateur
    await User.destroy({ where: { id: userId } });
    return res.status(200).json({ message: 'Compte supprimé avec succès' });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la suppression du compte', error });
  }
};
