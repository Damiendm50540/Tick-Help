import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models';

interface JwtPayload {
  id: string;
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: 'user',
    });

    const jwtSecret = process.env.JWT_SECRET || 'default_secret';
    const jwtOptions: SignOptions = { 
      // Use a numeric value for expiresIn (in seconds) to avoid type issues
      expiresIn: 86400 // 24 hours
    };

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id } as JwtPayload,
      jwtSecret,
      jwtOptions
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET || 'default_secret';
    const jwtOptions: SignOptions = { 
      // Use a numeric value for expiresIn (in seconds) to avoid type issues
      expiresIn: 86400 // 24 hours
    };

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id } as JwtPayload,
      jwtSecret,
      jwtOptions
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.user is set by auth middleware
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Récupérer tous les utilisateurs sans inclure le mot de passe
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};
