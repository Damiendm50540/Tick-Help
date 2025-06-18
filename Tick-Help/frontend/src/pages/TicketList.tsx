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
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import { ticketService, userService } from '../services/api';
import TicketCard from '../components/TicketCard';
import { useAuth } from '../contexts/AuthContext';

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

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const TicketList: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openNewTicket, setOpenNewTicket] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const { currentUser } = useAuth();

  // Filtres
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assigneeId: '',
    search: '',
  });

  // Nouveau ticket
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assigneeId: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        setLoading(true);
        
        // Charger les tickets
        const ticketsData = await ticketService.getAllTickets();
        setTickets(ticketsData);
        setFilteredTickets(ticketsData);
        
        // Charger les utilisateurs pour l'assignation
        const usersData = await userService.getAllUsers();
        setUsers(usersData);
        
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Impossible de charger les tickets. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fonction pour appliquer les filtres
  useEffect(() => {
    let result = [...tickets];
    
    if (filters.status) {
      result = result.filter(ticket => ticket.status === filters.status);
    }
    
    if (filters.priority) {
      result = result.filter(ticket => ticket.priority === filters.priority);
    }
    
    if (filters.assigneeId) {
      result = result.filter(ticket => ticket.assigneeId === filters.assigneeId);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        ticket =>
          ticket.title.toLowerCase().includes(searchLower) ||
          ticket.description.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredTickets(result);
  }, [tickets, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      priority: '',
      assigneeId: '',
      search: '',
    });
    setOpenFilters(false);
  };

  const handleNewTicketChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setNewTicket(prev => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmitNewTicket = async () => {
    try {
      if (!newTicket.title || !newTicket.description) {
        return; // Validation simple
      }

      await ticketService.createTicket(newTicket);
      
      // Recharger les tickets après la création
      const ticketsData = await ticketService.getAllTickets();
      setTickets(ticketsData);
      
      // Réinitialiser le formulaire et fermer la modal
      setNewTicket({
        title: '',
        description: '',
        priority: 'medium',
        assigneeId: '',
      });
      setOpenNewTicket(false);
      
    } catch (err) {
      console.error("Erreur lors de la création du ticket:", err);
      setError("Impossible de créer le ticket. Veuillez réessayer.");
    }
  };

  // Fonction utilitaire pour grouper les tickets par statut
  const groupTicketsByStatus = (tickets: Ticket[]) => {
    return {
      todo: tickets.filter(t => t.status === 'todo'),
      in_progress: tickets.filter(t => t.status === 'in_progress'),
      resolved: tickets.filter(t => t.status === 'resolved'),
    };
  };

  const groupedTickets = groupTicketsByStatus(filteredTickets);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Tickets
        </Typography>
        <Box>
          <Button
            startIcon={<FilterListIcon />}
            onClick={() => setOpenFilters(true)}
            sx={{ mr: 1 }}
          >
            Filtres
          </Button>
        </Box>
      </Box>

      {error && (
        <Box sx={{ mb: 2 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {/* Affichage Kanban par statut */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, overflowX: 'auto' }}>
        {[
          { key: 'todo', label: 'À faire' },
          { key: 'in_progress', label: 'En cours' },
          { key: 'resolved', label: 'Résolu' },
        ].map((col) => (
          <Paper key={col.key} sx={{ minWidth: 320, flex: 1, p: 2, bgcolor: '#f7f7f7' }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>{col.label}</Typography>
            {groupedTickets[col.key as keyof typeof groupedTickets].length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center">
                Aucun ticket
              </Typography>
            ) : (
              groupedTickets[col.key as keyof typeof groupedTickets].map((ticket) => (
                <Box key={ticket.id} sx={{ mb: 2 }}>
                  <TicketCard ticket={ticket} />
                </Box>
              ))
            )}
          </Paper>
        ))}
      </Box>

      {/* FAB pour ajouter un nouveau ticket */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setOpenNewTicket(true)}
      >
        <AddIcon />
      </Fab>

      {/* Modal pour les filtres */}
      <Dialog open={openFilters} onClose={() => setOpenFilters(false)} fullWidth maxWidth="sm">
        <DialogTitle>Filtrer les tickets</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Rechercher"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Statut</InputLabel>
              <Select
                name="status"
                value={filters.status}
                label="Statut"
                onChange={handleFilterChange}
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="todo">À faire</MenuItem>
                <MenuItem value="in_progress">En cours</MenuItem>
                <MenuItem value="resolved">Résolu</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Priorité</InputLabel>
              <Select
                name="priority"
                value={filters.priority}
                label="Priorité"
                onChange={handleFilterChange}
              >
                <MenuItem value="">Toutes</MenuItem>
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
                value={filters.assigneeId}
                label="Assigné à"
                onChange={handleFilterChange}
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="null">Non assigné</MenuItem>
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
          <Button onClick={resetFilters}>Réinitialiser</Button>
          <Button onClick={() => setOpenFilters(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Modal pour nouveau ticket */}
      <Dialog open={openNewTicket} onClose={() => setOpenNewTicket(false)} fullWidth maxWidth="sm">
        <DialogTitle>Créer un nouveau ticket</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              required
              margin="normal"
              label="Titre"
              name="title"
              value={newTicket.title}
              onChange={handleNewTicketChange}
            />
            
            <TextField
              fullWidth
              required
              margin="normal"
              label="Description"
              name="description"
              multiline
              rows={4}
              value={newTicket.description}
              onChange={handleNewTicketChange}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Priorité</InputLabel>
              <Select
                name="priority"
                value={newTicket.priority}
                label="Priorité"
                onChange={handleNewTicketChange}
              >
                <MenuItem value="low">Faible</MenuItem>
                <MenuItem value="medium">Moyenne</MenuItem>
                <MenuItem value="high">Élevée</MenuItem>
                <MenuItem value="critical">Critique</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Assigné à (optionnel)</InputLabel>
              <Select
                name="assigneeId"
                value={newTicket.assigneeId}
                label="Assigné à (optionnel)"
                onChange={handleNewTicketChange}
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
          <Button onClick={() => setOpenNewTicket(false)}>Annuler</Button>
          <Button onClick={handleSubmitNewTicket} variant="contained">Créer</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TicketList;