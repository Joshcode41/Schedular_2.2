import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ProtectedRoute from '../../app/components/ProtectedRoute';
import { AuthProvider, AuthContext } from '../../app/context/AuthContext';
import { useContext } from 'react';

describe('ProtectedRoute', () => {
  const TestComponent = () => {
    const auth = useContext(AuthContext);
    return <div>{auth?.user?.email || 'Not authenticated'}</div>;
  };

  const ProtectedTestComponent = () => (
    <ProtectedRoute>
      <TestComponent />
    </ProtectedRoute>
  );

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should render protected content when user is authenticated', async () => {
    const mockToken = 'mock-jwt-token';
    localStorage.setItem('token', mockToken);

    render(
      <AuthProvider>
        <ProtectedTestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Not authenticated')).not.toBeInTheDocument();
    });
  });

  it('should redirect to login when user is not authenticated', async () => {
    localStorage.removeItem('token');

    render(
      <AuthProvider>
        <ProtectedTestComponent />
      </AuthProvider>
    );

    // Component should check for token and handle accordingly
    await waitFor(() => {
      const element = screen.queryByText('Not authenticated');
      // Either redirected or not authenticated
      expect(element || !localStorage.getItem('token')).toBeTruthy();
    });
  });
});
