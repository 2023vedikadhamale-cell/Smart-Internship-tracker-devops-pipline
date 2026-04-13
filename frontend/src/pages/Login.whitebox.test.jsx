import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Login from './Login';

const mockNavigate = vi.fn();
const mockLogin = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: false,
  }),
}));

describe('Login.jsx white-box tests', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockReset();
    mockLogin.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it('shows error when email or password is missing', () => {
    const { container } = render(<Login />);

    const form = container.querySelector('form');
    fireEvent.submit(form);

    expect(
      screen.getByText('Please enter both email and password.')
    ).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('rejects login when existing user password is incorrect', () => {
    localStorage.setItem(
      'users',
      JSON.stringify([
        {
          id: 'u1',
          name: 'Test User',
          email: '123@gmail.com',
          password: '123',
          role: 'intern',
        },
      ])
    );

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { name: 'email', value: '123@gmail.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { name: 'password', value: 'wrong-password' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(
      screen.getByText('Incorrect password for this email. Please try again.')
    ).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('accepts login when existing user password is correct', () => {
    localStorage.setItem(
      'users',
      JSON.stringify([
        {
          id: 'u1',
          name: 'Test User',
          email: '123@gmail.com',
          password: '123',
          role: 'intern',
        },
      ])
    );

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { name: 'email', value: '123@gmail.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { name: 'password', value: '123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('creates a new user for first-time email+role and logs in', () => {
    localStorage.setItem('users', JSON.stringify([]));

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { name: 'email', value: 'new.user@gmail.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { name: 'password', value: 'newpass123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');

    expect(savedUsers).toHaveLength(1);
    expect(savedUsers[0].email).toBe('new.user@gmail.com');
    expect(savedUsers[0].password).toBe('newpass123');
    expect(savedUsers[0].role).toBe('intern');
    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('normalizes email case and spaces before matching', () => {
    localStorage.setItem(
      'users',
      JSON.stringify([
        {
          id: 'u1',
          name: 'Case User',
          email: 'case@test.com',
          password: 'abc123',
          role: 'intern',
        },
      ])
    );

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { name: 'email', value: '  CASE@TEST.COM  ' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { name: 'password', value: 'abc123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
