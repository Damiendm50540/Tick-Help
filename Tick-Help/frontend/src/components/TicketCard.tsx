import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  CardActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface TicketCardProps {
  ticket: {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'in_progress' | 'resolved';
    priority: 'low' | 'medium' | 'high' | 'critical';
    assignee?: {
      id: string;
      firstName: string;
      lastName: string;
    } | null;
  };
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const navigate = useNavigate();

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

  return (
    <Card variant="outlined" sx={{ mb: 2, borderLeft: 5, borderColor: `${getPriorityColor(ticket.priority)}.main` }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {ticket.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {ticket.description.length > 100 
            ? ticket.description.substring(0, 100) + '...' 
            : ticket.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Box>
            <Chip 
              label={getStatusLabel(ticket.status)} 
              color={getStatusColor(ticket.status) as any} 
              size="small" 
              sx={{ mr: 1 }} 
            />
            <Chip 
              label={`Priorité: ${getPriorityLabel(ticket.priority)}`} 
              color={getPriorityColor(ticket.priority) as any} 
              size="small" 
              sx={{ mr: 1 }} 
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {ticket.assignee 
              ? `Assigné à: ${ticket.assignee.firstName} ${ticket.assignee.lastName}` 
              : "Non assigné"}
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => navigate(`/tickets/${ticket.id}`)}>
          Voir les détails
        </Button>
      </CardActions>
    </Card>
  );
};

export default TicketCard;