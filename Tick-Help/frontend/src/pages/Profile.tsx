import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Divider,
  Avatar,
  Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/api';
import ChangePassword from '../components/ChangePassword';

/**
 * Page de profil utilisateur permettant de consulter et modifier 
 * les informations personnelles
 */
const Profile: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  if (!currentUser) {
    return (
      <Container maxWidth="md">
        <Alert severity="error">Utilisateur non connecté</Alert>
      </Container>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Simulation - Dans une vraie application, appel à l'API
      // await userService.updateProfile({
      //   firstName: formData.firstName,
      //   lastName: formData.lastName,
      // });

      setSuccess("Informations mises à jour avec succès");
      setTimeout(() => {
        setSuccess(null);
        setIsEditing(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la mise à jour des informations");
    }
  };

  const handlePasswordSuccess = () => {
    setSuccess("Mot de passe mis à jour avec succès");
    setShowPasswordForm(false);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) return;
    setError(null);
    setSuccess(null);
    try {
      await userService.deleteProfile();
      logout();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression du compte');
    }
  };

  const userInitials = `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`;
  const fullName = `${currentUser.firstName} ${currentUser.lastName}`;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: 'primary.main',
              fontSize: '2rem',
              mr: 3
            }}
          >
            {userInitials}
          </Avatar>
          <Box>
            <Typography variant="h4">{fullName}</Typography>
            <Typography variant="body1" color="text.secondary">
              {currentUser.email}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Rôle: {currentUser.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
            </Typography>
          </Box>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Informations personnelles</Typography>
            <Button 
              variant="outlined" 
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Annuler' : 'Modifier'}
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />

          {isEditing ? (
            <form onSubmit={handleSubmitInfo}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Prénom"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nom"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email}
                    disabled
                    helperText="L'email ne peut pas être modifié"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    sx={{ mt: 1 }}
                  >
                    Enregistrer les modifications
                  </Button>
                </Grid>
              </Grid>
            </form>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" fontWeight="bold">Prénom</Typography>
                <Typography variant="body1">{currentUser.firstName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" fontWeight="bold">Nom</Typography>
                <Typography variant="body1">{currentUser.lastName}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" fontWeight="bold">Email</Typography>
                <Typography variant="body1">{currentUser.email}</Typography>
              </Grid>
            </Grid>
          )}
        </Box>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Sécurité du compte</Typography>
            <Button 
              variant="outlined" 
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              {showPasswordForm ? 'Annuler' : 'Changer le mot de passe'}
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          {showPasswordForm ? (
            <Box sx={{ mt: 2 }}>
              <ChangePassword 
                onSuccess={handlePasswordSuccess} 
                onCancel={() => setShowPasswordForm(false)} 
              />
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Pour des raisons de sécurité, utilisez un mot de passe fort et unique que vous n'utilisez pas ailleurs.
            </Typography>
          )}
        </Box>
      </Paper>

      <Box sx={{ textAlign: 'center', mt: 2, mb: 4 }}>
        <Button 
          variant="outlined" 
          color="error" 
          onClick={logout}
          sx={{ mr: 2 }}
        >
          Se déconnecter
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteProfile}
        >
          Supprimer le profil
        </Button>
      </Box>
    </Container>
  );
};

export default Profile;