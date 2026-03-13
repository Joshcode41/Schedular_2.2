import { Link } from "react-router";
import { Calendar, Clock, MapPin, Car, Phone, User, CheckCircle2, AlertCircle, XCircle, Edit } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { currentUser, getAppointmentsByTechnician } from "../../lib/mockData";

export function TechnicianDashboard() {
  const appointments = getAppointmentsByTechnician(currentUser.id);
  const activeAppointments = appointments.filter(
    (apt) => apt.status === "confirmed" || apt.status === "in-progress" || apt.status === "delayed"
  );
  const completedAppointments = appointments.filter((apt) => apt.status === "completed");
  const todayAppointments = appointments.filter((apt) => {
    const today = new Date().toISOString().split("T")[0];
    return apt.preferredDate === today && apt.status !== "completed" && apt.status !== "cancelled";
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string; icon: any }> = {
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800", icon: Clock },
      confirmed: { label: "Confirmed", className: "bg-blue-100 text-blue-800", icon: CheckCircle2 },
      "in-progress": { label: "In Progress", className: "bg-purple-100 text-purple-800", icon: AlertCircle },
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

  const getPriorityBadge = (date: string, status: string) => {
    if (status === "completed" || status === "cancelled") return null;
    
    const appointmentDate = new Date(date);
    const today = new Date();
    const diffDays = Math.ceil((appointmentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return <Badge className="bg-red-100 text-red-800">Today</Badge>;
    } else if (diffDays === 1) {
      return <Badge className="bg-orange-100 text-orange-800">Tomorrow</Badge>;
    }
    return null;
  };

  const AppointmentCard = ({ appointment }: { appointment: any }) => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex gap-2 mb-2">
              {getStatusBadge(appointment.status)}
              {getPriorityBadge(appointment.preferredDate, appointment.status)}
            </div>
            <CardTitle className="text-lg">{appointment.serviceType}</CardTitle>
            <CardDescription>
              Appointment ID: {appointment.id}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Customer Info */}
        <div className="bg-gray-50 rounded-md p-3 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{appointment.customerName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{appointment.customerPhone}</span>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="flex items-center gap-2 text-sm">
          <Car className="w-4 h-4 text-gray-500" />
          <span className="text-gray-700">
            {appointment.carMake} {appointment.carModel} ({appointment.carYear}) - {appointment.registrationNumber}
          </span>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{new Date(appointment.preferredDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{appointment.preferredTime}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 sm:col-span-2">
            <MapPin className="w-4 h-4" />
            <span>{appointment.serviceCentreName}</span>
          </div>
        </div>

        {/* Remarks */}
        {appointment.remarks && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm">
            <p className="text-blue-900">{appointment.remarks}</p>
          </div>
        )}

        {/* Actions */}
        {appointment.status !== "completed" && appointment.status !== "cancelled" && (
          <Button asChild className="w-full">
            <Link to={`/technician/update-status/${appointment.id}`}>
              <Edit className="w-4 h-4 mr-2" />
              Update Status
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">My Assignments</h1>
        <p className="text-gray-600 mt-1">Manage your assigned appointments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Today's Appointments</CardDescription>
            <CardTitle className="text-3xl">{todayAppointments.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Assignments</CardDescription>
            <CardTitle className="text-3xl">{activeAppointments.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl">{completedAppointments.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Today's Appointments - Priority Section */}
      {todayAppointments.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <AlertCircle className="w-5 h-5" />
              Today's Appointments
            </CardTitle>
            <CardDescription className="text-red-800">
              {todayAppointments.length} appointment{todayAppointments.length !== 1 ? "s" : ""} scheduled for today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayAppointments.map((apt) => (
              <AppointmentCard key={apt.id} appointment={apt} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Appointments Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">
            Active ({activeAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({appointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeAppointments.length > 0 ? (
            activeAppointments.map((apt) => (
              <AppointmentCard key={apt.id} appointment={apt} />
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No active appointments</p>
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

        <TabsContent value="all" className="space-y-4">
          {appointments.length > 0 ? (
            appointments.map((apt) => (
              <AppointmentCard key={apt.id} appointment={apt} />
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No appointments assigned yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
