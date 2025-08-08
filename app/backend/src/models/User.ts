import { User } from '../types/database';
import { query, insertOne, updateById, findById } from '../database/query';
import { hashPassword, comparePassword } from '../utils/crypto';

export class UserModel {
  static async create(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: 'admin' | 'manager' | 'member';
  }): Promise<User> {
    const hashedPassword = await hashPassword(userData.password);
    
    const user = await insertOne<User>('users', {
      email: userData.email.toLowerCase(),
      password_hash: hashedPassword,
      first_name: userData.firstName,
      last_name: userData.lastName,
      role: userData.role || 'member',
      email_verified: false,
      is_active: true,
    });
    
    return user;
  }

  static async findById(id: string): Promise<User | null> {
    return findById<User>('users', id);
  }

  static async findByEmail(email: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    return result.rows[0] || null;
  }

  static async updateById(id: string, updates: Partial<User>): Promise<User | null> {
    return updateById<User>('users', id, updates);
  }

  static async verifyPassword(user: User, password: string): Promise<boolean> {
    return comparePassword(password, user.password_hash);
  }

  static async updateLastLogin(id: string): Promise<void> {
    await query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [id]);
  }

  static async verifyEmail(id: string): Promise<User | null> {
    return updateById<User>('users', id, { email_verified: true });
  }

  static async changePassword(id: string, newPassword: string): Promise<User | null> {
    const hashedPassword = await hashPassword(newPassword);
    return updateById<User>('users', id, { password_hash: hashedPassword });
  }

  static async deactivate(id: string): Promise<User | null> {
    return updateById<User>('users', id, { is_active: false });
  }

  static async findAll(limit = 50, offset = 0): Promise<User[]> {
    const result = await query(
      'SELECT id, email, first_name, last_name, role, is_active, email_verified, last_login, created_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  }

  static sanitizeUser(user: User): Omit<User, 'password_hash'> {
    const { password_hash, ...sanitized } = user;
    return sanitized;
  }
}