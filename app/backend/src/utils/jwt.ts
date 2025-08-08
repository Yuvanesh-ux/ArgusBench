import jwt, { SignOptions, Secret, VerifyOptions } from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'default-secret-change-in-production';
const JWT_EXPIRES_IN: number = process.env.JWT_EXPIRES_IN
  ? Number(process.env.JWT_EXPIRES_IN)
  : 7 * 24 * 60 * 60; // seconds
const REFRESH_SECRET: Secret = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-change-in-production';

export const generateAccessToken = (payload: JwtPayload): string => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'taskflow-api',
    audience: 'taskflow-client',
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const generateRefreshToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: '30d',
    issuer: 'taskflow-api',
  };
  return jwt.sign({ userId }, REFRESH_SECRET, options);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    const options: VerifyOptions = {
      issuer: 'taskflow-api',
      audience: 'taskflow-client',
    };
    const decoded = jwt.verify(token, JWT_SECRET, options) as unknown as JwtPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  try {
    const options: VerifyOptions = {
      issuer: 'taskflow-api',
    };
    const decoded = jwt.verify(token, REFRESH_SECRET, options) as unknown as { userId: string };
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

export const decodeToken = (token: string): any => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};