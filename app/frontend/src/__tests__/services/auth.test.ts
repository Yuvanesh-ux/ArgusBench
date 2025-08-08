import { login, getMe } from '@/services/auth';
import { api } from '@/services/api';

jest.mock('@/services/api', () => ({
  api: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

describe('auth service', () => {
  it('login returns tokens and user', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({ data: { data: { accessToken: 'a', refreshToken: 'b', user: { id: '1', email: 'x@y.com' } } } });
    const res = await login('x@y.com', 'pw');
    expect(res.accessToken).toBe('a');
    expect(res.refreshToken).toBe('b');
    expect(res.user.email).toBe('x@y.com');
  });

  it('getMe returns user', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: { data: { user: { id: '1', email: 'x@y.com' } } } });
    const res = await getMe();
    expect(res.user.id).toBe('1');
  });
});


