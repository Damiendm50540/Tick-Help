import { Request, Response } from 'express';
import { User, Ticket } from '../models';

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
