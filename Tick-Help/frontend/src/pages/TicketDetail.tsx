import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ticketService, userService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface TicketHistory {
  id: string;
  ticketId: string;
  userId: string;
  field: string;
  oldValue: string | null;
  newValue: string | null;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigneeId: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  assignee?: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  creator?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [ticketHistory, setTicketHistory] = useState<TicketHistory[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    status: '',
    priority: '',
    assigneeId: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!id) return;
        
        // Charger les détails du ticket
        const ticketData = await ticketService.getTicketById(id);
        setTicket(ticketData);
        
        // Préremplir le formulaire de modification
        setEditForm({
          title: ticketData.title,
          description: ticketData.description,
          status: ticketData.status,
          priority: ticketData.priority,
          assigneeId: ticketData.assigneeId || '',
        });
        
        // Charger l'historique du ticket
        const historyData = await ticketService.getTicketHistory(id);
        setTicketHistory(historyData);
        
        // Charger les utilisateurs pour l'assignation
        const usersData = await userService.getAllUsers();
        setUsers(usersData);
        
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Impossible de charger les détails du ticket. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmitEdit = async () => {
    try {
      setError(null);
      if (!id) return;
      
      await ticketService.updateTicket(id, {
        title: editForm.title,
        description: editForm.description,
        status: editForm.status,
        priority: editForm.priority,
        assigneeId: editForm.assigneeId || null,
      });
      
      // Recharger le ticket avec les modifications
      const updatedTicket = await ticketService.getTicketById(id);
      setTicket(updatedTicket);
      
      // Recharger l'historique
      const updatedHistory = await ticketService.getTicketHistory(id);
      setTicketHistory(updatedHistory);
      
      setOpenEdit(false);
    } catch (err) {
      console.error("Erreur lors de la mise à jour du ticket:", err);
      setError("Impossible de mettre à jour le ticket. Veuillez réessayer.");
    }
  };

  const handleDelete = async () => {
    try {
      setError(null);
      if (!id) return;
      
      await ticketService.deleteTicket(id);
      navigate('/tickets');
    } catch (err) {
      console.error("Erreur lors de la suppression du ticket:", err);
      setError("Impossible de supprimer le ticket. Veuillez réessayer.");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'low': return 'info';
      case 'medium': return 'success';
      case 'high': return 'warning';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'todo': return 'default';
      case 'in_progress': return 'warning';
      case 'resolved': return 'success';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'todo': return 'À faire';
      case 'in_progress': return 'En cours';
      case 'resolved': return 'Résolu';
      default: return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch(priority) {
      case 'low': return 'Faible';
      case 'medium': return 'Moyenne';
      case 'high': return 'Élevée';
      case 'critical': return 'Critique';
      default: return priority;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getFieldDisplayName = (field: string) => {
    switch(field) {
      case 'title': return 'Titre';
      case 'description': return 'Description';
      case 'status': return 'Statut';
      case 'priority': return 'Priorité';
      case 'assigneeId': return 'Assignation';
      default: return field;
    }
  };

  const formatHistoryValue = (field: string, value: string | null) => {
    if (value === null) return 'Non défini';
    
    switch(field) {
      case 'status':
        return getStatusLabel(value);
      case 'priority':
        return getPriorityLabel(value);
      case 'assigneeId':
        if (value === null || value === '') return 'Non assigné';
        const assignee = users.find(user => user.id === value);
        return assignee ? `${assignee.firstName} ${assignee.lastName}` : value;
      default:
        return value;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!ticket && !loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Ticket introuvable. Soit il n'existe pas, soit vous n'avez pas les permissions nécessaires.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate('/tickets')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Détails du ticket
        </Typography>
      </Box>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5" gutterBottom>
                {ticket?.title}
              </Typography>
              <Typography variant="body1">
                {ticket?.description}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Informations
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Statut
                </Typography>
                <Chip 
                  label={getStatusLabel(ticket?.status || 'todo')} 
                  color={getStatusColor(ticket?.status || 'todo') as any}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Priorité
                </Typography>
                <Chip 
                  label={getPriorityLabel(ticket?.priority || 'medium')} 
                  color={getPriorityColor(ticket?.priority || 'medium') as any}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Assigné à
                </Typography>
                <Typography>
                  {ticket?.assignee 
                    ? `${ticket.assignee.firstName} ${ticket.assignee.lastName}` 
                    : "Non assigné"}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Créé par
                </Typography>
                <Typography>
                  {ticket?.creator
                    ? `${ticket.creator.firstName} ${ticket.creator.lastName}`
                    : "Inconnu"}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Date de création
                </Typography>
                <Typography>
                  {ticket?.createdAt ? formatDate(ticket.createdAt) : ""}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Dernière mise à jour
                </Typography>
                <Typography>
                  {ticket?.updatedAt ? formatDate(ticket.updatedAt) : ""}
                </Typography>
              </Box>
              
            </Paper>
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            startIcon={<EditIcon />}
            variant="outlined"
            onClick={() => setOpenEdit(true)}
            sx={{ mr: 1 }}
          >
            Modifier
          </Button>
          <Button
            startIcon={<DeleteIcon />}
            variant="outlined"
            color="error"
            onClick={() => setOpenDelete(true)}
          >
            Supprimer
          </Button>
        </Box>
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Historique des modifications
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {ticketHistory.length === 0 ? (
          <Typography>Aucune modification enregistrée pour ce ticket.</Typography>
        ) : (
          <List>
            {ticketHistory.map((entry) => (
              <ListItem key={entry.id} divider sx={{ py: 2 }}>
                <ListItemText
                  primary={
                    <Typography variant="body1">
                      <strong>{entry.user.firstName} {entry.user.lastName}</strong> a modifié {getFieldDisplayName(entry.field)}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" component="span">
                        De: {formatHistoryValue(entry.field, entry.oldValue)}
                      </Typography>
                      <br />
                      <Typography variant="body2" component="span">
                        À: {formatHistoryValue(entry.field, entry.newValue)}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(entry.createdAt)}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
      
      {/* Modal de modification */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
        <DialogTitle>Modifier le ticket</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              required
              margin="normal"
              label="Titre"
              name="title"
              value={editForm.title}
              onChange={handleEditChange}
            />
            
            <TextField
              fullWidth
              required
              margin="normal"
              label="Description"
              name="description"
              multiline
              rows={4}
              value={editForm.description}
              onChange={handleEditChange}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Statut</InputLabel>
              <Select
                name="status"
                value={editForm.status}
                label="Statut"
                onChange={handleEditChange}
              >
                <MenuItem value="todo">À faire</MenuItem>
                <MenuItem value="in_progress">En cours</MenuItem>
                <MenuItem value="resolved">Résolu</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Priorité</InputLabel>
              <Select
                name="priority"
                value={editForm.priority}
                label="Priorité"
                onChange={handleEditChange}
              >
                <MenuItem value="low">Faible</MenuItem>
                <MenuItem value="medium">Moyenne</MenuItem>
                <MenuItem value="high">Élevée</MenuItem>
                <MenuItem value="critical">Critique</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Assigné à</InputLabel>
              <Select
                name="assigneeId"
                value={editForm.assigneeId}
                label="Assigné à"
                onChange={handleEditChange}
              >
                <MenuItem value="">Non assigné</MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.firstName} {user.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Annuler</Button>
          <Button onClick={handleSubmitEdit} variant="contained">Enregistrer</Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal de confirmation de suppression */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer ce ticket ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Annuler</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TicketDetail;