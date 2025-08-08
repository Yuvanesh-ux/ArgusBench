import { UserModel } from '../models/User';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { generateSecureToken, createHash } from '../utils/crypto';
import { redisClient } from '../database/connection';
import { createError } from '../middleware/errorHandler';
import { User } from '../types/database';

export interface LoginResult {
  user: Omit<User, 'password_hash'>;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'admin' | 'manager' | 'member';
}

export class AuthService {
  static async register(data: RegisterData): Promise<LoginResult> {
    const existingUser = await UserModel.findByEmail(data.email);
    if (existingUser) {
      throw createError('User with this email already exists', 409);
    }

    if (data.password.length < 8) {
      throw createError('Password must be at least 8 characters long', 400);
    }

    const user = await UserModel.create(data);
    const sanitizedUser = UserModel.sanitizeUser(user);

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken(user.id);
    
    await this.storeRefreshToken(user.id, refreshToken);

    return {
      user: sanitizedUser,
      accessToken,
      refreshToken,
    };
  }

  static async login(email: string, password: string): Promise<LoginResult> {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw createError('Invalid email or password', 401);
    }

    if (!user.is_active) {
      throw createError('Account is deactivated', 401);
    }

    const isValidPassword = await UserModel.verifyPassword(user, password);
    if (!isValidPassword) {
      throw createError('Invalid email or password', 401);
    }

    await UserModel.updateLastLogin(user.id);
    const sanitizedUser = UserModel.sanitizeUser(user);

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken(user.id);
    
    await this.storeRefreshToken(user.id, refreshToken);

    return {
      user: sanitizedUser,
      accessToken,
      refreshToken,
    };
  }

  static async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const { userId } = verifyRefreshToken(refreshToken);
      
      const storedToken = await redisClient.get(`refresh_token:${userId}`);
      if (!storedToken || storedToken !== refreshToken) {
        throw createError('Invalid refresh token', 401);
      }

      const user = await UserModel.findById(userId);
      if (!user || !user.is_active) {
        throw createError('User not found or inactive', 401);
      }

      const newAccessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      const newRefreshToken = generateRefreshToken(user.id);
      await this.storeRefreshToken(user.id, newRefreshToken);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw createError('Invalid refresh token', 401);
    }
  }

  static async logout(userId: string): Promise<void> {
    await redisClient.del(`refresh_token:${userId}`);
  }

  static async requestPasswordReset(email: string): Promise<string> {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw createError('User not found', 404);
    }

    const resetToken = generateSecureToken();
    const tokenHash = createHash(resetToken);
    
    await redisClient.setEx(`password_reset:${user.id}`, 3600, tokenHash);

    return resetToken;
  }

  static async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokenHash = createHash(token);
    
    const keys = await redisClient.keys('password_reset:*');
    let userId = null;

    for (const key of keys) {
      const storedHash = await redisClient.get(key);
      if (storedHash === tokenHash) {
        userId = key.split(':')[1];
        break;
      }
    }

    if (!userId) {
      throw createError('Invalid or expired reset token', 400);
    }

    if (newPassword.length < 8) {
      throw createError('Password must be at least 8 characters long', 400);
    }

    await UserModel.changePassword(userId, newPassword);
    await redisClient.del(`password_reset:${userId}`);
  }

  static async getCurrentUser(userId: string): Promise<Omit<User, 'password_hash'>> {
    const user = await UserModel.findById(userId);
    if (!user || !user.is_active) {
      throw createError('User not found or inactive', 404);
    }
    
    return UserModel.sanitizeUser(user);
  }

  private static async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await redisClient.setEx(`refresh_token:${userId}`, 30 * 24 * 60 * 60, refreshToken);
  }
}