import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

// Charger explicitement le fichier .env depuis le répertoire racine du backend
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Vérifier la disponibilité des variables d'environnement
const dbName = process.env.DB_NAME || 'tickhelp';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbHost = process.env.DB_HOST || 'localhost';

console.log('Connexion à la base de données avec les paramètres suivants :');
console.log(`- DB_HOST: ${dbHost}`);
console.log(`- DB_NAME: ${dbName}`);
console.log(`- DB_USER: ${dbUser}`);
console.log('- DB_PASSWORD: [MASQUÉ]');

export const sequelize = new Sequelize(
  dbName,
  dbUser,
  dbPassword,
  {
    host: dbHost,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export default sequelize;
