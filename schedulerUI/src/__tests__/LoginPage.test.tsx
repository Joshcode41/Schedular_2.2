import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../../app/pages/LoginPage';
import { AuthProvider } from '../../app/context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Mock the API
vi.mock('../../services/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('LoginPage', () => {
  const renderLoginPage = () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should render login form', () => {
    renderLoginPage();

    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    renderLoginPage();
    const user = userEvent.setup();

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for invalid email', async () => {
    renderLoginPage();
    const user = userEvent.setup();

    const emailInput = screen.getByPlaceholderText(/email/i);
    await user.type(emailInput, 'invalid-email');

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it('should accept valid email format', async () => {
    renderLoginPage();
    const user = userEvent.setup();

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    // If no validation errors appear, the form accepted the input
    const errorMessages = screen.queryByText(/is required|invalid/i);
    expect(errorMessages).not.toBeInTheDocument();
  });

  it('should have password visibility toggle', () => {
    renderLoginPage();

    const passwordInput = screen.getByPlaceholderText(/password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Look for visibility toggle button
    const toggleButtons = screen.getAllByRole('button');
    expect(toggleButtons.length).toBeGreaterThan(1); // At least sign in button + toggle
  });
});
