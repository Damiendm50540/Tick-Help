import React, { useState } from 'react';
import { userService } from '../services/api';

interface ChangePasswordProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Composant pour changer le mot de passe utilisateur
 */
const ChangePassword: React.FC<ChangePasswordProps> = ({ onSuccess, onCancel }) => {
  // État du formulaire
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // État pour les messages et le chargement
  const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ 
    type: '', 
    text: '' 
  });
  const [loading, setLoading] = useState(false);

  // Destructurer les valeurs du formulaire
  const { currentPassword, newPassword, confirmPassword } = formData;

  // Gérer les changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Effacer les messages d'erreur quand l'utilisateur tape
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  // Valider le formulaire
  const validateForm = () => {
    // Vérifier que tous les champs sont remplis
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ 
        type: 'error', 
        text: 'Tous les champs sont requis' 
      });
      return false;
    }

    // Vérifier que les mots de passe correspondent
    if (newPassword !== confirmPassword) {
      setMessage({ 
        type: 'error', 
        text: 'Les mots de passe ne correspondent pas' 
      });
      return false;
    }

    // Vérifier la longueur minimale du mot de passe
    if (newPassword.length < 8) {
      setMessage({ 
        type: 'error', 
        text: 'Le nouveau mot de passe doit contenir au moins 8 caractères' 
      });
      return false;
    }

    return true;
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valider le formulaire
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Appel API pour changer le mot de passe
      await userService.changePassword(currentPassword, newPassword);
      
      // Afficher message de succès
      setMessage({
        type: 'success',
        text: 'Mot de passe modifié avec succès',
      });
      
      // Réinitialiser le formulaire
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      // Appeler le callback si fourni
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (error: any) {
      // Gérer les erreurs API
      const errorMessage = 
        error.response?.data?.message || 
        'Une erreur est survenue lors du changement de mot de passe';
      
      setMessage({
        type: 'error',
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-container">
      <h2>Changer votre mot de passe</h2>
      
      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="currentPassword">Mot de passe actuel</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            className="form-control"
            value={currentPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="newPassword">Nouveau mot de passe</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            className="form-control"
            value={newPassword}
            onChange={handleChange}
            required
            minLength={8}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="form-control"
            value={confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Chargement...' : 'Changer le mot de passe'}
          </button>
          {onCancel && (
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;