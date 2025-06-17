import axios from 'axios';

// Création de l'instance axios avec l'URL de base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

// Intercepteur pour ajouter le token JWT aux en-têtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Services d'authentification
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },
  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  },
};

// Services de gestion des tickets
export const ticketService = {
  // Récupérer tous les tickets
  getAllTickets: async () => {
    const response = await api.get('/tickets');
    return response.data;
  },
  
  // Récupérer un ticket par son ID
  getTicketById: async (id: string) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },
  
  // Créer un nouveau ticket
  createTicket: async (ticket: {
    title: string;
    description: string;
    priority: string;
    assigneeId?: string | null;
  }) => {
    const response = await api.post('/tickets', ticket);
    return response.data;
  },
  
  // Mettre à jour un ticket existant
  updateTicket: async (
    id: string,
    ticketData: {
      title?: string;
      description?: string;
      status?: string;
      priority?: string;
      assigneeId?: string | null;
    }
  ) => {
    const response = await api.put(`/tickets/${id}`, ticketData);
    return response.data;
  },
  
  // Supprimer un ticket
  deleteTicket: async (id: string) => {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
  },
  
  // Récupérer l'historique d'un ticket
  getTicketHistory: async (id: string) => {
    const response = await api.get(`/tickets/${id}/history`);
    return response.data;
  },
};

// Services de gestion des utilisateurs
export const userService = {
  // Récupérer tous les utilisateurs (pour l'assignation des tickets)
  getAllUsers: async () => {
    const response = await api.get('/auth/users');
    return response.data;
  },
};

export default api;