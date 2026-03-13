import { AppError } from '../utils/serializers';

export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface AppointmentWorkflow {
  status: AppointmentStatus;
  technicianId?: string;
  notes?: string;
}

/**
 * Appointment State Machine Definition
 * Defines valid state transitions for appointment lifecycle
 */
const VALID_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

/**
 * Check if transition from current status to target status is allowed
 */
export function canTransition(currentStatus: AppointmentStatus, targetStatus: AppointmentStatus): boolean {
  return VALID_TRANSITIONS[currentStatus]?.includes(targetStatus) ?? false;
}

/**
 * Validate appointment state transition with business logic
 * @throws AppError if transition is invalid
 */
export function validateTransition(
  appointment: AppointmentWorkflow,
  targetStatus: AppointmentStatus,
  requestingUserRole?: string
): void {
  const currentStatus = appointment.status as AppointmentStatus;

  // Check if transition is allowed by state machine
  if (!canTransition(currentStatus, targetStatus)) {
    throw new AppError(
      `Cannot transition from '${currentStatus}' to '${targetStatus}'`,
      400,
      'INVALID_STATE_TRANSITION'
    );
  }

  // Business rule: Technician must be assigned before confirming
  if (targetStatus === 'confirmed' && !appointment.technicianId) {
    throw new AppError(
      'A technician must be assigned before confirming the appointment',
      400,
      'MISSING_TECHNICIAN'
    );
  }

  // Business rule: Notes required when completing
  if (targetStatus === 'completed' && !appointment.notes) {
    throw new AppError(
      'Service notes are required when completing an appointment',
      400,
      'MISSING_NOTES'
    );
  }

  // Role-based restrictions (can be extended)
  if (targetStatus === 'cancelled' && requestingUserRole === 'customer') {
    // Could add cancellation cutoff time check here
    // const hoursUntilAppointment = getHoursUntilAppointment(appointment);
    // if (hoursUntilAppointment < 24) {
    //   throw new AppError('Appointments can only be cancelled 24 hours in advance', 400, 'CANCELLATION_TOO_LATE');
    // }
  }
}

/**
 * Get description of current status (for UI display)
 */
export function getStatusDescription(status: AppointmentStatus): string {
  const descriptions: Record<AppointmentStatus, string> = {
    pending: 'Awaiting confirmation from admin',
    confirmed: 'Technician assigned, ready for service',
    in_progress: 'Service is currently underway',
    completed: 'Service completed, awaiting feedback',
    cancelled: 'Appointment cancelled',
  };
  return descriptions[status] || 'Unknown status';
}

/**
 * Get next suggested actions for a given status
 */
export function getNextActions(status: AppointmentStatus): AppointmentStatus[] {
  return VALID_TRANSITIONS[status] || [];
}
