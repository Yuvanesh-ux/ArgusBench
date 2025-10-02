import jwt, { SignOptions, Secret, VerifyOptions } from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

const JWT_SECRET: Secret | undefined = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable must be set');
}
const JWT_EXPIRES_IN: number = process.env.JWT_EXPIRES_IN
  ? Number(process.env.JWT_EXPIRES_IN)
  : 7 * 24 * 60 * 60; // seconds
const REFRESH_SECRET: Secret | undefined = process.env.REFRESH_TOKEN_SECRET;
if (!REFRESH_SECRET) {
  throw new Error('REFRESH_TOKEN_SECRET environment variable must be set');
}

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

export const verifyAccessToken = (t: string) => {
  try {
    const options: VerifyOptions = {
      issuer: 'taskflow-api',
      audience: 'taskflow-client',
    };
    return jwt.verify(t, JWT_SECRET, options) as any;
  } catch (error) {
    throw new Error('Invalid or expired access token');
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