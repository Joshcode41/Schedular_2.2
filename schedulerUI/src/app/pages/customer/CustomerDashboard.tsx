import { useState } from "react";
import { Link } from "react-router";
import { Calendar, Clock, MapPin, User, Plus, MessageSquare, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useAppointments } from "../../hooks/useData";
import { useAuth } from "../../context/AuthContext";

export function CustomerDashboard() {
  const { user } = useAuth();
  const { appointments, loading, error } = useAppointments();

  // Handle loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-12"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="space-y-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">Error loading appointments: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter appointments by customer and status
  const customerAppointments = appointments.filter(apt => apt.customer_id === user?.id);
  const upcomingAppointments = customerAppointments.filter(
    (apt) => ["pending", "confirmed", "in_progress"].includes(apt.status)
  );
  const completedAppointments = customerAppointments.filter((apt) => apt.status === "completed");
  const cancelledAppointments = customerAppointments.filter((apt) => apt.status === "cancelled");

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string; icon: any }> = {
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800", icon: Clock },
      confirmed: { label: "Confirmed", className: "bg-blue-100 text-blue-800", icon: CheckCircle2 },
      in_progress: { label: "In Progress", className: "bg-purple-100 text-purple-800", icon: AlertCircle },
      completed: { label: "Completed", className: "bg-green-100 text-green-800", icon: CheckCircle2 },
      cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800", icon: XCircle },
      delayed: { label: "Delayed", className: "bg-orange-100 text-orange-800", icon: AlertCircle },
    };
    const config = variants[status] || variants.pending;
    const Icon = config.icon;
    return (
      <Badge className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const AppointmentCard = ({ appointment }: { appointment: any }) => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{appointment.service_type}</CardTitle>
            <CardDescription>
              {appointment.vehicle_make} {appointment.vehicle_model} ({appointment.vehicle_year})
            </CardDescription>
          </div>
          {getStatusBadge(appointment.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{appointment.appointment_time || "TBD"}</span>
          </div>
        </div>
        {appointment.description && (
          <div className="bg-gray-50 rounded-md p-3 text-sm">
            <p className="text-gray-700">{appointment.description}</p>
          </div>
        )}
        <div className="flex gap-2 pt-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link to={`/customer/appointment/${appointment.id}`}>View Details</Link>
          </Button>
          {appointment.status === "completed" && (
            <Button asChild size="sm" className="flex-1">
              <Link to={`/customer/feedback/${appointment.id}`}>
                <MessageSquare className="w-4 h-4 mr-1" />
                Feedback
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl">Welcome back, {user?.name}</h1>
          <p className="text-gray-600 mt-1">Manage your car service appointments</p>
        </div>
        <Button asChild size="lg">
          <Link to="/customer/book">
            <Plus className="w-4 h-4 mr-2" />
            Book New Appointment
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Upcoming</CardDescription>
            <CardTitle className="text-3xl">{upcomingAppointments.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl">{completedAppointments.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Bookings</CardDescription>
            <CardTitle className="text-3xl">{customerAppointments.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Appointments Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelledAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((apt) => (
              <AppointmentCard key={apt.id} appointment={apt} />
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No upcoming appointments</p>
                <Button asChild className="mt-4">
                  <Link to="/customer/book">Book Your First Appointment</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedAppointments.length > 0 ? (
            completedAppointments.map((apt) => (
              <AppointmentCard key={apt.id} appointment={apt} />
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No completed appointments yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledAppointments.length > 0 ? (
            cancelledAppointments.map((apt) => (
              <AppointmentCard key={apt.id} appointment={apt} />
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <XCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No cancelled appointments</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
