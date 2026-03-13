import {
  validateTransition,
  canTransition,
  getStatusDescription,
  getNextActions,
} from '../../workflows/appointmentWorkflow';

describe('Appointment Workflow', () => {
  const mockAppointment = {
    id: 'apt-1',
    customer_id: 'cust-1',
    technician_id: null,
    service_centre_id: 'centre-1',
    appointment_date: new Date(),
    status: 'pending',
    service_type: 'AC Repair',
    description: '2023 Toyota Camry',
    notes: null,
    created_at: new Date(),
    updated_at: new Date(),
  };

  describe('canTransition', () => {
    it('should allow transition from pending to confirmed', () => {
      const result = canTransition(mockAppointment, 'confirmed');
      expect(result).toBe(true);
    });

    it('should allow transition from pending to cancelled', () => {
      const result = canTransition(mockAppointment, 'cancelled');
      expect(result).toBe(true);
    });

    it('should reject transition from pending to in_progress', () => {
      const result = canTransition(mockAppointment, 'in_progress');
      expect(result).toBe(false);
    });

    it('should allow transition from confirmed to in_progress', () => {
      const result = canTransition(
        { ...mockAppointment, status: 'confirmed' },
        'in_progress'
      );
      expect(result).toBe(true);
    });

    it('should allow transition from in_progress to completed', () => {
      const result = canTransition(
        { ...mockAppointment, status: 'in_progress' },
        'completed'
      );
      expect(result).toBe(true);
    });
  });

  describe('validateTransition', () => {
    it('should allow valid state transition', () => {
      expect(() => {
        validateTransition(mockAppointment, 'confirmed', 'admin');
      }).not.toThrow();
    });

    it('should reject invalid state transition', () => {
      expect(() => {
        validateTransition(mockAppointment, 'in_progress', 'admin');
      }).toThrow();
    });

    it('should require technician assignment before confirmation', () => {
      expect(() => {
        validateTransition(mockAppointment, 'confirmed', 'admin');
      }).toThrow();
    });

    it('should allow confirmation when technician is assigned', () => {
      const appointmentWithTech = {
        ...mockAppointment,
        technician_id: 'tech-1',
      };
      expect(() => {
        validateTransition(appointmentWithTech, 'confirmed', 'admin');
      }).not.toThrow();
    });

    it('should require notes for completion', () => {
      const inProgressAppointment = {
        ...mockAppointment,
        status: 'in_progress',
        technician_id: 'tech-1',
        notes: null,
      };
      expect(() => {
        validateTransition(inProgressAppointment, 'completed', 'admin');
      }).toThrow();
    });

    it('should allow completion with notes', () => {
      const inProgressAppointment = {
        ...mockAppointment,
        status: 'in_progress',
        technician_id: 'tech-1',
        notes: 'Work completed successfully',
      };
      expect(() => {
        validateTransition(inProgressAppointment, 'completed', 'admin');
      }).not.toThrow();
    });
  });

  describe('getStatusDescription', () => {
    it('should return correct description for pending', () => {
      expect(getStatusDescription('pending')).toBe('Waiting for confirmation');
    });

    it('should return correct description for confirmed', () => {
      expect(getStatusDescription('confirmed')).toBe('Confirmed and scheduled');
    });

    it('should return correct description for in_progress', () => {
      expect(getStatusDescription('in_progress')).toBe('Service in progress');
    });

    it('should return correct description for completed', () => {
      expect(getStatusDescription('completed')).toBe('Service completed');
    });

    it('should return correct description for cancelled', () => {
      expect(getStatusDescription('cancelled')).toBe('Appointment cancelled');
    });
  });

  describe('getNextActions', () => {
    it('should return next actions from pending', () => {
      const actions = getNextActions('pending');
      expect(actions).toContain('confirmed');
      expect(actions).toContain('cancelled');
    });

    it('should return next actions from confirmed', () => {
      const actions = getNextActions('confirmed');
      expect(actions).toContain('in_progress');
      expect(actions).toContain('cancelled');
    });

    it('should return next actions from in_progress', () => {
      const actions = getNextActions('in_progress');
      expect(actions).toContain('completed');
      expect(actions).toContain('cancelled');
    });

    it('should return no next actions from completed', () => {
      const actions = getNextActions('completed');
      expect(actions.length).toBe(0);
    });
  });
});
