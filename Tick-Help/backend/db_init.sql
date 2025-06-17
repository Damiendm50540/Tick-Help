-- Script d'initialisation de la base de données pour Tick'Help

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS tickhelp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Utilisez la base de données
USE tickhelp;

-- Création de l'utilisateur et attribution des privilèges (à adapter selon votre configuration)
-- CRÉEZ VOTRE UTILISATEUR UNIQUEMENT SI VOUS NE SOUHAITEZ PAS UTILISER ROOT
-- CREATE USER IF NOT EXISTS 'tickhelp_user'@'localhost' IDENTIFIED BY 'votre_mot_de_passe';
-- GRANT ALL PRIVILEGES ON tickhelp.* TO 'tickhelp_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Les tables seront créées automatiquement par Sequelize lors du démarrage de l'application
-- avec la propriété "sync" qui est généralement définie dans le fichier server.ts