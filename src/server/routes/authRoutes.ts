
import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import UserModel from '../models/User';
import { supabase } from '../../integrations/supabase/client';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-jwt-secret';

let userModel: UserModel;
let pool: Pool;

// Initialize model with pool
export const initAuthRoutes = (dbPool: Pool) => {
  pool = dbPool;
  userModel = new UserModel(pool);
  return router;
};

// Authentication middleware
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.body.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// User registration
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Supabase auth signup
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: role || 'staff'
        }
      }
    });

    if (signUpError) {
      throw signUpError;
    }
    
    const user = await userModel.create({
      name,
      email,
      password,
      role: role || 'staff'
    });
    
    // Create token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    return res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server Error', error });
  }
});

// User login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Supabase auth signin
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      return res.status(400).json({ message: 'Invalid email or password', error: authError });
    }
    
    // Check if user exists in our database
    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'User not found in database' });
    }
    
    // Update last login time
    await userModel.update(user.id!, { last_login: new Date() });
    
    // Create token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server Error', error });
  }
});

// Get all users (protected by auth)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const users = await userModel.find();
    // Remove password field from response
    const safeUsers = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    res.json(safeUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

export default router;
