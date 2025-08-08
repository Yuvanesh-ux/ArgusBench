import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '@/pages/Login';
import { AuthProvider } from '@/components/auth/AuthProvider';

jest.mock('@/services/auth', () => ({
  login: jest.fn().mockResolvedValue({ accessToken: 'a', refreshToken: 'b', user: { id: '1', email: 'x@y.com' } }),
  getMe: jest.fn().mockResolvedValue({ user: { id: '1', email: 'x@y.com' } }),
}));

const renderWithProviders = (ui: React.ReactNode) =>
  render(<BrowserRouter><AuthProvider>{ui}</AuthProvider></BrowserRouter>);

describe('Login page', () => {
  it('renders and submits login form', async () => {
    renderWithProviders(<Login />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'x@y.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pw' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(await screen.findAllByText(/login/i)).toHaveLength(2);
  });
});


