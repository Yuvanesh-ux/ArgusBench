import { UserModel } from '../models/User';
import { createError } from '../middleware/errorHandler';
import { User } from '../types/database';

export class UserService {
  static async getAllUsers(limit = 50, offset = 0): Promise<Omit<User, 'password_hash'>[]> {
    const users = await UserModel.findAll(limit, offset);
    return users.map(user => UserModel.sanitizeUser(user));
  }

  static async getUserById(id: string): Promise<Omit<User, 'password_hash'>> {
    const user = await UserModel.findById(id);
    if (!user) {
      throw createError('User not found', 404);
    }
    
    return UserModel.sanitizeUser(user);
  }

  static async updateUser(id: string, updates: {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  }): Promise<Omit<User, 'password_hash'>> {
    const user = await UserModel.findById(id);
    if (!user) {
      throw createError('User not found', 404);
    }

    const updateData: Partial<User> = {};
    
    if (updates.firstName) updateData.first_name = updates.firstName;
    if (updates.lastName) updateData.last_name = updates.lastName;
    if (updates.avatarUrl !== undefined) updateData.avatar_url = updates.avatarUrl;

    const updatedUser = await UserModel.updateById(id, updateData);
    if (!updatedUser) {
      throw createError('Failed to update user', 500);
    }

    return UserModel.sanitizeUser(updatedUser);
  }

  static async updateUserRole(id: string, role: 'admin' | 'manager' | 'member'): Promise<Omit<User, 'password_hash'>> {
    const user = await UserModel.findById(id);
    if (!user) {
      throw createError('User not found', 404);
    }

    const updatedUser = await UserModel.updateById(id, { role });
    if (!updatedUser) {
      throw createError('Failed to update user role', 500);
    }

    return UserModel.sanitizeUser(updatedUser);
  }

  static async deactivateUser(id: string): Promise<void> {
    const user = await UserModel.findById(id);
    if (!user) {
      throw createError('User not found', 404);
    }

    await UserModel.deactivate(id);
  }

  static async activateUser(id: string): Promise<Omit<User, 'password_hash'>> {
    const user = await UserModel.findById(id);
    if (!user) {
      throw createError('User not found', 404);
    }

    const updatedUser = await UserModel.updateById(id, { is_active: true });
    if (!updatedUser) {
      throw createError('Failed to activate user', 500);
    }

    return UserModel.sanitizeUser(updatedUser);
  }

  static async searchUsers(query: string, limit = 20): Promise<Omit<User, 'password_hash'>[]> {
    const searchQuery = `
      SELECT id, email, first_name, last_name, role, is_active, email_verified, last_login, created_at 
      FROM users 
      WHERE (first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1) 
      AND is_active = true 
      ORDER BY first_name, last_name 
      LIMIT $2
    `;
    
    const { query: dbQuery } = await import('../database/connection');
    const result = await dbQuery(searchQuery, [`%${query}%`, limit]);
    
    return result.rows;
  }
}