import { Request, Response } from 'express';
import { Ticket, TicketHistory, User, TicketStatus, TicketPriority } from '../models';
import { Op } from 'sequelize';

// Get all tickets with filtering options
export const getAllTickets = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      status, 
      priority, 
      assigneeId, 
      search, 
      sortBy = 'createdAt', 
      sortOrder = 'DESC' 
    } = req.query;
    
    // Build filter conditions
    const whereClause: any = {};
    
    if (status) {
      whereClause.status = status;
    }
    
    if (priority) {
      whereClause.priority = priority;
    }
    
    if (assigneeId) {
      whereClause.assigneeId = assigneeId;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Validate sort parameters
    const validSortFields = ['createdAt', 'updatedAt', 'title', 'status', 'priority'];
    const validSortOrders = ['ASC', 'DESC'];
    
    const orderField = validSortFields.includes(sortBy as string) ? sortBy : 'createdAt';
    const orderDirection = validSortOrders.includes(sortOrder as string) ? sortOrder : 'DESC';

    const tickets = await Ticket.findAll({
      where: whereClause,
      order: [[orderField as string, orderDirection as string]],
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });

    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ message: 'Server error while fetching tickets' });
  }
};

// Get ticket by ID
export const getTicketById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const ticket = await Ticket.findByPk(id, {
      include: [
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });

    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ message: 'Server error while fetching ticket' });
  }
};

// Create new ticket
export const createTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, priority, assigneeId } = req.body;
    
    // Validate required fields
    if (!title) {
      res.status(400).json({ message: 'Title is required' });
      return;
    }

    // Validate priority if provided
    if (priority && !Object.values(TicketPriority).includes(priority as TicketPriority)) {
      res.status(400).json({ message: 'Invalid priority value' });
      return;
    }

    // Create ticket
    const ticket = await Ticket.create({
      title,
      description,
      priority: priority || TicketPriority.MEDIUM,
      status: TicketStatus.TODO,
      assigneeId: assigneeId || null,
      createdById: req.user.id,
    });

    // Add ticket creation to history
    await TicketHistory.create({
      ticketId: ticket.id,
      userId: req.user.id,
      field: 'status',
      oldValue: null,
      newValue: TicketStatus.TODO,
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ message: 'Server error while creating ticket' });
  }
};

// Update ticket
export const updateTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, assigneeId } = req.body;
    
    // Find ticket by ID
    const ticket = await Ticket.findByPk(id);
    
    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }

    // Track changes for history
    const changes: { field: string; oldValue: string | null; newValue: string | null }[] = [];
    
    // Check for changes
    if (title !== undefined && title !== ticket.title) {
      changes.push({ field: 'title', oldValue: ticket.title, newValue: title });
      ticket.title = title;
    }
    
    if (description !== undefined && description !== ticket.description) {
      changes.push({ field: 'description', oldValue: ticket.description, newValue: description });
      ticket.description = description;
    }
    
    if (status !== undefined && status !== ticket.status) {
      if (!Object.values(TicketStatus).includes(status as TicketStatus)) {
        res.status(400).json({ message: 'Invalid status value' });
        return;
      }
      changes.push({ field: 'status', oldValue: ticket.status, newValue: status });
      ticket.status = status as TicketStatus;
    }
    
    if (priority !== undefined && priority !== ticket.priority) {
      if (!Object.values(TicketPriority).includes(priority as TicketPriority)) {
        res.status(400).json({ message: 'Invalid priority value' });
        return;
      }
      changes.push({ field: 'priority', oldValue: ticket.priority, newValue: priority });
      ticket.priority = priority as TicketPriority;
    }
    
    if (assigneeId !== undefined && assigneeId !== ticket.assigneeId) {
      changes.push({ field: 'assigneeId', oldValue: ticket.assigneeId, newValue: assigneeId });
      ticket.assigneeId = assigneeId;
    }

    // Save ticket if there are changes
    if (changes.length > 0) {
      await ticket.save();
      
      // Add changes to history
      for (const change of changes) {
        await TicketHistory.create({
          ticketId: ticket.id,
          userId: req.user.id,
          field: change.field,
          oldValue: change.oldValue,
          newValue: change.newValue,
        });
      }
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ message: 'Server error while updating ticket' });
  }
};

// Delete ticket
export const deleteTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const ticket = await Ticket.findByPk(id);
    
    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }

    // Supprimer aussi l'historique lié au ticket lors de la suppression
    await TicketHistory.destroy({ where: { ticketId: id } });
    await ticket.destroy();
    
    res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({ message: 'Server error while deleting ticket' });
  }
};

// Get ticket history
export const getTicketHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const ticket = await Ticket.findByPk(id);
    
    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }

    const history = await TicketHistory.findAll({
      where: { ticketId: id },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });

    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching ticket history:', error);
    res.status(500).json({ message: 'Server error while fetching ticket history' });
  }
};
