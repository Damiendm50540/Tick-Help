import { Router } from 'express';
import * as ticketController from '../controllers/ticket.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/tickets - Get all tickets with filtering options
router.get('/', ticketController.getAllTickets);

// GET /api/tickets/:id - Get ticket by ID
router.get('/:id', ticketController.getTicketById);

// POST /api/tickets - Create a new ticket
router.post('/', ticketController.createTicket);

// PUT /api/tickets/:id - Update a ticket
router.put('/:id', ticketController.updateTicket);

// DELETE /api/tickets/:id - Delete a ticket
router.delete('/:id', ticketController.deleteTicket);

// GET /api/tickets/:id/history - Get ticket history
router.get('/:id/history', ticketController.getTicketHistory);

export default router;
