import dotenv from 'dotenv';
// Charger les variables d'environnement immédiatement avant tout autre import
dotenv.config();

import express, { Express } from 'express';
import cors from 'cors';
import { sequelize } from './config/database';
import authRoutes from './routes/auth.routes';
import ticketRoutes from './routes/ticket.routes';

// Importer les modèles pour s'assurer qu'ils sont chargés avant la synchronisation
import './models/user.model';
import './models/ticket.model';
import './models/ticket-history.model';

const app: Express = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Tick\'Help API is running!');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Synchroniser les modèles avec la base de données (créer les tables)
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');
    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    console.warn('Starting server without database connection...');
  } finally {
    // Start the server even if database connection fails
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
};

startServer();

export default app;
