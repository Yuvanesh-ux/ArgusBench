import request from 'supertest';
import app from '../../app';
import * as AuthService from '../../services/authService';
import { generateAccessToken } from '../../utils/jwt';

jest.mock('../../services/authService');

describe('Auth integration', () => {
  const mockUser = {
    id: 'u1', email: 'test@example.com', first_name: 'Test', last_name: 'User',
    role: 'member', is_active: true, email_verified: true, created_at: new Date(), updated_at: new Date(),
  } as any;

  it('POST /api/auth/register returns 201', async () => {
    (AuthService.AuthService.register as jest.Mock).mockResolvedValueOnce({
      user: mockUser,
      accessToken: 'token-a',
      refreshToken: 'token-b',
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'Password123!', firstName: 'Test', lastName: 'User' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/auth/me returns current user with valid token', async () => {
    const token = generateAccessToken({ userId: 'u1', email: 'test@example.com', role: 'member' });
    (AuthService.AuthService.getCurrentUser as jest.Mock).mockResolvedValueOnce(mockUser);

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.id).toBe('u1');
  });
});


