import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

/**
 * Hook to fetch all users from API
 */
export function useUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Failed to fetch users');
        
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  return { users, loading, error };
}

/**
 * Hook to fetch all appointments
 */
export function useAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/appointments', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        
        if (!response.ok) throw new Error('Failed to fetch appointments');
        
        const data = await response.json();
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  return { appointments, loading, error };
}

/**
 * Hook to fetch all technicians
 */
export function useTechnicians() {
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/technicians', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        
        if (!response.ok) throw new Error('Failed to fetch technicians');
        
        const data = await response.json();
        setTechnicians(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, [token]);

  return { technicians, loading, error };
}

/**
 * Hook to fetch all service centres
 */
export function useServiceCentres() {
  const [centres, setCentres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchCentres = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/service-centres', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        
        if (!response.ok) throw new Error('Failed to fetch service centres');
        
        const data = await response.json();
        setCentres(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCentres();
  }, [token]);

  return { centres, loading, error };
}

/**
 * Hook to fetch single appointment by ID
 */
export function useAppointment(id: string) {
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!id) return;

    const fetchAppointment = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/api/appointments/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        
        if (!response.ok) throw new Error('Failed to fetch appointment');
        
        const data = await response.json();
        setAppointment(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id, token]);

  return { appointment, loading, error };
}
