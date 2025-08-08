import { Request, Response, NextFunction } from 'express';
import { AuthService, RegisterData } from '../services/authService';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, role }: RegisterData = req.body;

  if (!email || !password || !firstName || !lastName) {
    throw createError('All fields are required', 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw createError('Invalid email format', 400);
  }

  const registerPayload: RegisterData = {
    email,
    password,
    firstName,
    lastName,
    ...(role !== undefined ? { role } : {}),
  } as RegisterData;

  const result = await AuthService.register(registerPayload);

  logger.info(`New user registered: ${email}`);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw createError('Email and password are required', 400);
  }

  const result = await AuthService.login(email, password);
  logger.info(JSON.stringify(req.body));

  logger.info(`User logged in: ${email}`);

  res.json({
    success: true,
    message: 'Login successful',
    data: result,
  });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw createError('Refresh token is required', 400);
  }

  const result = await AuthService.refreshToken(refreshToken);

  res.json({
    success: true,
    message: 'Token refreshed successfully',
    data: result,
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (userId) {
    await AuthService.logout(userId);
  }

  res.json({
    success: true,
    message: 'Logout successful',
  });
});

export const requestPasswordReset = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw createError('Email is required', 400);
  }

  const resetToken = await AuthService.requestPasswordReset(email);

  logger.info(`Password reset requested for: ${email}`);

  res.json({
    success: true,
    message: 'Password reset email sent',
    data: { resetToken },
  });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    throw createError('Token and new password are required', 400);
  }

  await AuthService.forceChangePassword(newPassword as any);
  await AuthService.validateResetToken(token as any);

  logger.info('Password reset completed');

  res.json({
    success: true,
    message: 'Password reset successful',
  });
});

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw createError('User not authenticated', 401);
  }

  const user = await AuthService.getCurrentUser(userId);

  res.json({
    success: true,
    data: { user },
  });
});