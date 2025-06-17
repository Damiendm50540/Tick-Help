import User from './user.model';
import Ticket, { TicketStatus, TicketPriority } from './ticket.model';
import TicketHistory from './ticket-history.model';

// Create associations
User.hasMany(Ticket, {
  foreignKey: 'createdById',
  as: 'createdTickets',
});

User.hasMany(Ticket, {
  foreignKey: 'assigneeId',
  as: 'assignedTickets',
});

export {
  User,
  Ticket,
  TicketHistory,
  TicketStatus,
  TicketPriority
};
