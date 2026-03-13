// Mock data for the scheduling system

export type UserRole = "customer" | "technician" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  createdAt: string;
}

export interface ServiceCentre {
  id: string;
  name: string;
  location: string;
  phone: string;
  email: string;
  capacity: number;
  currentBookings: number;
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  assignedAppointments: number;
  status: "available" | "busy" | "offline";
}

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  carMake: string;
  carModel: string;
  carYear: string;
  registrationNumber: string;
  serviceType: string;
  preferredDate: string;
  preferredTime: string;
  serviceCentreId: string;
  serviceCentreName: string;
  technicianId?: string;
  technicianName?: string;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled" | "delayed";
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Feedback {
  id: string;
  appointmentId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Current logged-in user (can be changed to simulate different roles)
export let currentUser: User = {
  id: "user-1",
  name: "John Doe",
  email: "john.doe@example.com",
  role: "customer",
  phone: "+254 712 345 678",
  createdAt: "2024-01-15",
};

export const setCurrentUser = (user: User) => {
  currentUser = user;
};

// Sample users
export const users: User[] = [
  currentUser,
  {
    id: "tech-1",
    name: "Mike Johnson",
    email: "mike.tech@example.com",
    role: "technician",
    phone: "+254 722 111 222",
    createdAt: "2024-01-10",
  },
  {
    id: "admin-1",
    name: "Sarah Admin",
    email: "sarah.admin@example.com",
    role: "admin",
    phone: "+254 733 444 555",
    createdAt: "2024-01-01",
  },
];

// Service centres
export const serviceCentres: ServiceCentre[] = [
  {
    id: "sc-1",
    name: "Downtown Auto Service",
    location: "Nairobi CBD, Kenyatta Avenue",
    phone: "+254 700 111 222",
    email: "downtown@autoservice.com",
    capacity: 10,
    currentBookings: 7,
  },
  {
    id: "sc-2",
    name: "Westlands Car Care",
    location: "Westlands, Parklands Road",
    phone: "+254 700 333 444",
    email: "westlands@carcare.com",
    capacity: 15,
    currentBookings: 12,
  },
  {
    id: "sc-3",
    name: "Eastleigh Motors",
    location: "Eastleigh, 1st Avenue",
    phone: "+254 700 555 666",
    email: "eastleigh@motors.com",
    capacity: 8,
    currentBookings: 5,
  },
  {
    id: "sc-4",
    name: "Karen Service Hub",
    location: "Karen, Bogani Road",
    phone: "+254 700 777 888",
    email: "karen@servicehub.com",
    capacity: 12,
    currentBookings: 8,
  },
];

// Technicians
export const technicians: Technician[] = [
  {
    id: "tech-1",
    name: "Mike Johnson",
    email: "mike.tech@example.com",
    phone: "+254 722 111 222",
    specialization: "Engine & Transmission",
    assignedAppointments: 5,
    status: "busy",
  },
  {
    id: "tech-2",
    name: "David Kamau",
    email: "david.kamau@example.com",
    phone: "+254 722 222 333",
    specialization: "Electrical Systems",
    assignedAppointments: 3,
    status: "available",
  },
  {
    id: "tech-3",
    name: "Peter Ochieng",
    email: "peter.ochieng@example.com",
    phone: "+254 722 333 444",
    specialization: "Body Work & Paint",
    assignedAppointments: 4,
    status: "busy",
  },
  {
    id: "tech-4",
    name: "James Mwangi",
    email: "james.mwangi@example.com",
    phone: "+254 722 444 555",
    specialization: "General Maintenance",
    assignedAppointments: 2,
    status: "available",
  },
  {
    id: "tech-5",
    name: "Robert Kipchoge",
    email: "robert.kipchoge@example.com",
    phone: "+254 722 555 666",
    specialization: "Brake & Suspension",
    assignedAppointments: 0,
    status: "available",
  },
];

// Appointments
export const appointments: Appointment[] = [
  {
    id: "apt-1",
    customerId: "user-1",
    customerName: "John Doe",
    customerPhone: "+254 712 345 678",
    carMake: "Toyota",
    carModel: "Corolla",
    carYear: "2020",
    registrationNumber: "KCA 123A",
    serviceType: "Oil Change & General Service",
    preferredDate: "2026-03-12",
    preferredTime: "10:00",
    serviceCentreId: "sc-1",
    serviceCentreName: "Downtown Auto Service",
    technicianId: "tech-1",
    technicianName: "Mike Johnson",
    status: "in-progress",
    remarks: "Customer requested premium oil",
    createdAt: "2026-03-05",
    updatedAt: "2026-03-08",
  },
  {
    id: "apt-2",
    customerId: "user-1",
    customerName: "John Doe",
    customerPhone: "+254 712 345 678",
    carMake: "Toyota",
    carModel: "Corolla",
    carYear: "2020",
    registrationNumber: "KCA 123A",
    serviceType: "Brake Inspection",
    preferredDate: "2026-03-15",
    preferredTime: "14:00",
    serviceCentreId: "sc-2",
    serviceCentreName: "Westlands Car Care",
    technicianId: "tech-5",
    technicianName: "Robert Kipchoge",
    status: "confirmed",
    createdAt: "2026-03-06",
    updatedAt: "2026-03-07",
  },
  {
    id: "apt-3",
    customerId: "user-1",
    customerName: "John Doe",
    customerPhone: "+254 712 345 678",
    carMake: "Toyota",
    carModel: "Corolla",
    carYear: "2020",
    registrationNumber: "KCA 123A",
    serviceType: "Tire Replacement",
    preferredDate: "2026-02-20",
    preferredTime: "09:00",
    serviceCentreId: "sc-1",
    serviceCentreName: "Downtown Auto Service",
    technicianId: "tech-2",
    technicianName: "David Kamau",
    status: "completed",
    remarks: "All four tires replaced successfully",
    createdAt: "2026-02-15",
    updatedAt: "2026-02-20",
  },
  {
    id: "apt-4",
    customerId: "user-2",
    customerName: "Jane Smith",
    customerPhone: "+254 712 987 654",
    carMake: "Honda",
    carModel: "Civic",
    carYear: "2019",
    registrationNumber: "KCB 456B",
    serviceType: "Engine Diagnostics",
    preferredDate: "2026-03-10",
    preferredTime: "11:00",
    serviceCentreId: "sc-3",
    serviceCentreName: "Eastleigh Motors",
    technicianId: "tech-1",
    technicianName: "Mike Johnson",
    status: "in-progress",
    remarks: "Check engine light on",
    createdAt: "2026-03-03",
    updatedAt: "2026-03-08",
  },
  {
    id: "apt-5",
    customerId: "user-3",
    customerName: "Michael Brown",
    customerPhone: "+254 712 111 222",
    carMake: "Nissan",
    carModel: "X-Trail",
    carYear: "2021",
    registrationNumber: "KCC 789C",
    serviceType: "AC Repair",
    preferredDate: "2026-03-14",
    preferredTime: "15:00",
    serviceCentreId: "sc-4",
    serviceCentreName: "Karen Service Hub",
    status: "pending",
    createdAt: "2026-03-07",
    updatedAt: "2026-03-07",
  },
];

// Feedback
export const feedbacks: Feedback[] = [
  {
    id: "fb-1",
    appointmentId: "apt-3",
    customerId: "user-1",
    customerName: "John Doe",
    rating: 5,
    comment: "Excellent service! The technician was very professional and completed the work on time.",
    createdAt: "2026-02-20",
  },
];

// Service types
export const serviceTypes = [
  "Oil Change & General Service",
  "Brake Inspection & Repair",
  "Tire Replacement",
  "Engine Diagnostics",
  "Transmission Service",
  "AC Repair",
  "Battery Replacement",
  "Wheel Alignment",
  "Electrical System Check",
  "Body Work & Paint",
  "Suspension Repair",
  "Exhaust System Repair",
];

// Helper functions
export const getAppointmentsByCustomer = (customerId: string) => {
  return appointments.filter((apt) => apt.customerId === customerId);
};

export const getAppointmentsByTechnician = (technicianId: string) => {
  return appointments.filter((apt) => apt.technicianId === technicianId);
};

export const getAppointmentById = (id: string) => {
  return appointments.find((apt) => apt.id === id);
};

export const getServiceCentreById = (id: string) => {
  return serviceCentres.find((sc) => sc.id === id);
};

export const getTechnicianById = (id: string) => {
  return technicians.find((tech) => tech.id === id);
};

// ===== CRM DATA =====

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  vehicles: Vehicle[];
  totalSpent: number;
  visitCount: number;
  lastVisit: string;
  status: "active" | "inactive" | "vip";
  notes: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  customerId: string;
  make: string;
  model: string;
  year: string;
  registrationNumber: string;
  vin?: string;
  mileage: number;
  lastServiceDate?: string;
  nextServiceDue?: string;
  motDue?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: "website" | "phone" | "referral" | "walk-in" | "google";
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  interest: string;
  assignedTo?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
  appointmentId?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: "appointment" | "message" | "alert" | "reminder";
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface Shift {
  id: string;
  technicianId: string;
  technicianName: string;
  date: string;
  startTime: string;
  endTime: string;
  serviceCentreId: string;
  serviceCentreName: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  break?: { start: string; end: string };
}

export interface TimeOffRequest {
  id: string;
  technicianId: string;
  technicianName: string;
  startDate: string;
  endDate: string;
  reason: string;
  type: "vacation" | "sick" | "personal";
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface ServiceBay {
  id: string;
  name: string;
  serviceCentreId: string;
  type: "general" | "mot" | "bodywork" | "diagnostic";
  status: "available" | "occupied" | "maintenance";
  currentAppointmentId?: string;
}

export interface WorkOrder {
  id: string;
  appointmentId: string;
  customerId: string;
  customerName: string;
  vehicleId: string;
  status: "draft" | "in-progress" | "pending-approval" | "approved" | "invoiced";
  tasks: WorkOrderTask[];
  parts: PartUsed[];
  laborHours: number;
  laborRate: number;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkOrderTask {
  id: string;
  description: string;
  completed: boolean;
  technicianId?: string;
  technicianName?: string;
  hours: number;
  notes?: string;
}

export interface PartUsed {
  id: string;
  partNumber: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quote {
  id: string;
  customerId: string;
  customerName: string;
  vehicleId: string;
  description: string;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  total: number;
  validUntil: string;
  status: "draft" | "sent" | "approved" | "rejected" | "expired";
  createdAt: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Mock CRM Customers
export const customers: Customer[] = [
  {
    id: "cust-1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+254 712 345 678",
    address: "123 Main Street, Nairobi",
    vehicles: [
      {
        id: "veh-1",
        customerId: "cust-1",
        make: "Toyota",
        model: "Corolla",
        year: "2020",
        registrationNumber: "KCA 123A",
        vin: "JT2BF18K9X0123456",
        mileage: 45000,
        lastServiceDate: "2026-02-20",
        nextServiceDue: "2026-05-20",
        motDue: "2026-12-15",
      },
    ],
    totalSpent: 5420,
    visitCount: 8,
    lastVisit: "2026-03-05",
    status: "vip",
    notes: "Prefers premium oil. Always books in advance.",
    createdAt: "2024-01-15",
  },
  {
    id: "cust-2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+254 712 987 654",
    address: "456 Oak Avenue, Westlands",
    vehicles: [
      {
        id: "veh-2",
        customerId: "cust-2",
        make: "Honda",
        model: "Civic",
        year: "2019",
        registrationNumber: "KCB 456B",
        mileage: 62000,
        motDue: "2026-08-20",
      },
    ],
    totalSpent: 3200,
    visitCount: 5,
    lastVisit: "2026-02-28",
    status: "active",
    notes: "",
    createdAt: "2024-03-10",
  },
];

// Mock Leads
export const leads: Lead[] = [
  {
    id: "lead-1",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "+254 712 111 222",
    source: "website",
    status: "new",
    interest: "Full service and MOT",
    notes: "Interested in monthly service plan",
    createdAt: "2026-03-09",
    updatedAt: "2026-03-09",
  },
  {
    id: "lead-2",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    phone: "+254 712 333 444",
    source: "google",
    status: "contacted",
    interest: "Engine diagnostics",
    assignedTo: "admin-1",
    notes: "Called back, scheduled appointment for next week",
    createdAt: "2026-03-08",
    updatedAt: "2026-03-10",
  },
];

// Mock Messages
export const messages: Message[] = [
  {
    id: "msg-1",
    fromId: "admin-1",
    fromName: "Sarah Admin",
    toId: "tech-1",
    toName: "Mike Johnson",
    subject: "Urgent: Parts needed for KCA 123A",
    message: "Hi Mike, can you check if we have the oil filter for the Toyota Corolla? Customer is waiting.",
    read: true,
    createdAt: "2026-03-10T09:30:00",
    appointmentId: "apt-1",
  },
  {
    id: "msg-2",
    fromId: "tech-1",
    fromName: "Mike Johnson",
    toId: "admin-1",
    toName: "Sarah Admin",
    subject: "Re: Urgent: Parts needed for KCA 123A",
    message: "Yes, we have 3 in stock. I'll use one for this job.",
    read: false,
    createdAt: "2026-03-10T09:35:00",
    appointmentId: "apt-1",
  },
];

// Mock Notifications
export const notifications: Notification[] = [
  {
    id: "notif-1",
    userId: "tech-1",
    type: "appointment",
    title: "New Appointment Assigned",
    message: "You have been assigned to appointment apt-1 - Toyota Corolla service",
    read: true,
    link: "/technician/update-status/apt-1",
    createdAt: "2026-03-05T08:00:00",
  },
  {
    id: "notif-2",
    userId: "admin-1",
    type: "alert",
    title: "Service Bay 2 Available",
    message: "Bay 2 is now free for next appointment",
    read: false,
    createdAt: "2026-03-10T10:15:00",
  },
];

// Mock Shifts
export const shifts: Shift[] = [
  {
    id: "shift-1",
    technicianId: "tech-1",
    technicianName: "Mike Johnson",
    date: "2026-03-10",
    startTime: "08:00",
    endTime: "17:00",
    serviceCentreId: "sc-1",
    serviceCentreName: "Downtown Auto Service",
    status: "in-progress",
    break: { start: "12:00", end: "13:00" },
  },
  {
    id: "shift-2",
    technicianId: "tech-2",
    technicianName: "David Kamau",
    date: "2026-03-10",
    startTime: "08:00",
    endTime: "17:00",
    serviceCentreId: "sc-1",
    serviceCentreName: "Downtown Auto Service",
    status: "in-progress",
    break: { start: "12:30", end: "13:30" },
  },
  {
    id: "shift-3",
    technicianId: "tech-1",
    technicianName: "Mike Johnson",
    date: "2026-03-11",
    startTime: "08:00",
    endTime: "17:00",
    serviceCentreId: "sc-1",
    serviceCentreName: "Downtown Auto Service",
    status: "scheduled",
  },
];

// Mock Time Off Requests
export const timeOffRequests: TimeOffRequest[] = [
  {
    id: "pto-1",
    technicianId: "tech-3",
    technicianName: "Peter Ochieng",
    startDate: "2026-03-15",
    endDate: "2026-03-17",
    reason: "Family vacation",
    type: "vacation",
    status: "pending",
    requestedAt: "2026-03-08",
  },
  {
    id: "pto-2",
    technicianId: "tech-2",
    technicianName: "David Kamau",
    startDate: "2026-03-20",
    endDate: "2026-03-20",
    reason: "Medical appointment",
    type: "personal",
    status: "approved",
    requestedAt: "2026-03-05",
    reviewedBy: "admin-1",
    reviewedAt: "2026-03-06",
  },
];

// Mock Service Bays
export const serviceBays: ServiceBay[] = [
  {
    id: "bay-1",
    name: "Bay 1",
    serviceCentreId: "sc-1",
    type: "general",
    status: "occupied",
    currentAppointmentId: "apt-1",
  },
  {
    id: "bay-2",
    name: "Bay 2",
    serviceCentreId: "sc-1",
    type: "mot",
    status: "available",
  },
  {
    id: "bay-3",
    name: "Bay 3",
    serviceCentreId: "sc-1",
    type: "diagnostic",
    status: "available",
  },
  {
    id: "bay-4",
    name: "Bay 4",
    serviceCentreId: "sc-2",
    type: "general",
    status: "occupied",
    currentAppointmentId: "apt-2",
  },
];

// Helper functions for new data
export const getCustomerById = (id: string) => {
  return customers.find((c) => c.id === id);
};

export const getMessagesByUser = (userId: string) => {
  return messages.filter((m) => m.toId === userId || m.fromId === userId);
};

export const getUnreadMessages = (userId: string) => {
  return messages.filter((m) => m.toId === userId && !m.read);
};

export const getNotificationsByUser = (userId: string) => {
  return notifications.filter((n) => n.userId === userId);
};

export const getUnreadNotifications = (userId: string) => {
  return notifications.filter((n) => n.userId === userId && !n.read);
};

export const getShiftsByTechnician = (technicianId: string) => {
  return shifts.filter((s) => s.technicianId === technicianId);
};

export const getShiftsByDate = (date: string) => {
  return shifts.filter((s) => s.date === date);
};

export const getAvailableBays = (serviceCentreId?: string) => {
  if (serviceCentreId) {
    return serviceBays.filter((b) => b.serviceCentreId === serviceCentreId && b.status === "available");
  }
  return serviceBays.filter((b) => b.status === "available");
};