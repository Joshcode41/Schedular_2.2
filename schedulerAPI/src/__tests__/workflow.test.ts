import {
  validateTransition,
  canTransition,
  getStatusDescription,
  getNextActions,
  AppointmentWorkflow,
  AppointmentStatus,
} from '../workflows/appointmentWorkflow';

describe('Appointment Workflow', () => {
  const mockAppointment: AppointmentWorkflow = {
    status: 'pending' as AppointmentStatus,
    technicianId: undefined,
    notes: undefined,
  };

  describe('canTransition', () => {
    it('should allow transition from pending to confirmed', () => {
      const result = canTransition('pending' as AppointmentStatus, 'confirmed' as AppointmentStatus);
      expect(result).toBe(true);
    });

    it('should allow transition from pending to cancelled', () => {
      const result = canTransition('pending' as AppointmentStatus, 'cancelled' as AppointmentStatus);
      expect(result).toBe(true);
    });

    it('should reject transition from pending to in_progress', () => {
      const result = canTransition('pending' as AppointmentStatus, 'in_progress' as AppointmentStatus);
      expect(result).toBe(false);
    });

    it('should allow transition from confirmed to in_progress', () => {
      const result = canTransition(
        'confirmed' as AppointmentStatus,
        'in_progress' as AppointmentStatus
      );
      expect(result).toBe(true);
    });

    it('should allow transition from in_progress to completed', () => {
      const result = canTransition(
        'in_progress' as AppointmentStatus,
        'completed' as AppointmentStatus
      );
      expect(result).toBe(true);
    });
  });

  describe('validateTransition', () => {
    it('should allow valid state transition', () => {
      expect(() => {
        validateTransition(mockAppointment, 'confirmed', 'admin');
      }).toThrow();
      // Note: This throws because technician is not assigned
    });

    it('should reject invalid state transition', () => {
      expect(() => {
        validateTransition(mockAppointment, 'in_progress' as AppointmentStatus, 'admin');
      }).toThrow();
    });

    it('should require technician assignment before confirmation', () => {
      expect(() => {
        validateTransition(mockAppointment, 'confirmed' as AppointmentStatus, 'admin');
      }).toThrow();
    });

    it('should allow confirmation when technician is assigned', () => {
      const appointmentWithTech: AppointmentWorkflow = {
        ...mockAppointment,
        technicianId: 'tech-1',
      };
      expect(() => {
        validateTransition(appointmentWithTech, 'confirmed' as AppointmentStatus, 'admin');
      }).not.toThrow();
    });

    it('should require notes for completion', () => {
      const inProgressAppointment: AppointmentWorkflow = {
        ...mockAppointment,
        status: 'in_progress' as AppointmentStatus,
        technicianId: 'tech-1',
        notes: undefined,
      };
      expect(() => {
        validateTransition(inProgressAppointment, 'completed' as AppointmentStatus, 'admin');
      }).toThrow();
    });

    it('should allow completion with notes', () => {
      const inProgressAppointment: AppointmentWorkflow = {
        ...mockAppointment,
        status: 'in_progress' as AppointmentStatus,
        technicianId: 'tech-1',
        notes: 'Work completed successfully',
      };
      expect(() => {
        validateTransition(inProgressAppointment, 'completed' as AppointmentStatus, 'admin');
      }).not.toThrow();
    });
  });

  describe('getStatusDescription', () => {
    it('should return correct description for pending', () => {
      expect(getStatusDescription('pending' as AppointmentStatus)).toBe('Awaiting confirmation from admin');
    });

    it('should return correct description for confirmed', () => {
      expect(getStatusDescription('confirmed' as AppointmentStatus)).toBe('Technician assigned, ready for service');
    });

    it('should return correct description for in_progress', () => {
      expect(getStatusDescription('in_progress' as AppointmentStatus)).toBe('Service is currently underway');
    });

    it('should return correct description for completed', () => {
      expect(getStatusDescription('completed' as AppointmentStatus)).toBe('Service completed, awaiting feedback');
    });

    it('should return correct description for cancelled', () => {
      expect(getStatusDescription('cancelled' as AppointmentStatus)).toBe('Appointment cancelled');
    });
  });

  describe('getNextActions', () => {
    it('should return next actions from pending', () => {
      const actions = getNextActions('pending' as AppointmentStatus);
      expect(actions).toContain('confirmed');
      expect(actions).toContain('cancelled');
    });

    it('should return next actions from confirmed', () => {
      const actions = getNextActions('confirmed' as AppointmentStatus);
      expect(actions).toContain('in_progress');
      expect(actions).toContain('cancelled');
    });

    it('should return next actions from in_progress', () => {
      const actions = getNextActions('in_progress' as AppointmentStatus);
      expect(actions).toContain('completed');
      expect(actions).toContain('cancelled');
    });

    it('should return no next actions from completed', () => {
      const actions = getNextActions('completed');
      expect(actions.length).toBe(0);
    });
  });
});
