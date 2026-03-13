import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { CustomerDashboard } from "./pages/customer/CustomerDashboard";
import { BookAppointment } from "./pages/customer/BookAppointment";
import { AppointmentDetails } from "./pages/customer/AppointmentDetails";
import { FeedbackForm } from "./pages/customer/FeedbackForm";
import { TechnicianDashboard } from "./pages/technician/TechnicianDashboard";
import { UpdateStatus } from "./pages/technician/UpdateStatus";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { ServiceCentreManagement } from "./pages/admin/ServiceCentreManagement";
import { TechnicianAssignment } from "./pages/admin/TechnicianAssignment";
import { UserManagement } from "./pages/admin/UserManagement";
import { ReportsAnalytics } from "./pages/admin/ReportsAnalytics";
import { CustomerCRM } from "./pages/admin/CustomerCRM";
import { CalendarManagement } from "./pages/admin/CalendarManagement";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <LoginPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      
      // Customer routes (protected)
      { path: "customer/dashboard", element: <ProtectedRoute requiredRole="customer"><CustomerDashboard /></ProtectedRoute> },
      { path: "customer/book", element: <ProtectedRoute requiredRole="customer"><BookAppointment /></ProtectedRoute> },
      { path: "customer/appointment/:id", element: <ProtectedRoute requiredRole="customer"><AppointmentDetails /></ProtectedRoute> },
      { path: "customer/feedback/:id", element: <ProtectedRoute requiredRole="customer"><FeedbackForm /></ProtectedRoute> },
      
      // Technician routes (protected)
      { path: "technician/dashboard", element: <ProtectedRoute requiredRole="technician"><TechnicianDashboard /></ProtectedRoute> },
      { path: "technician/update-status/:id", element: <ProtectedRoute requiredRole="technician"><UpdateStatus /></ProtectedRoute> },
      
      // Admin routes (protected)
      { path: "admin/dashboard", element: <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute> },
      { path: "admin/service-centres", element: <ProtectedRoute requiredRole="admin"><ServiceCentreManagement /></ProtectedRoute> },
      { path: "admin/technician-assignment", element: <ProtectedRoute requiredRole="admin"><TechnicianAssignment /></ProtectedRoute> },
      { path: "admin/users", element: <ProtectedRoute requiredRole="admin"><UserManagement /></ProtectedRoute> },
      { path: "admin/reports", element: <ProtectedRoute requiredRole="admin"><ReportsAnalytics /></ProtectedRoute> },
      { path: "admin/customer-crm", element: <ProtectedRoute requiredRole="admin"><CustomerCRM /></ProtectedRoute> },
      { path: "admin/calendar-management", element: <ProtectedRoute requiredRole="admin"><CalendarManagement /></ProtectedRoute> },
    ],
  },
]);