import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserCircle, Calendar, Clock, MapPin, Car, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { toast } from "sonner";
import { appointments, technicians } from "../../lib/mockData";

const assignmentSchema = z.object({
  technicianId: z.string().min(1, "Please select a technician"),
});

type AssignmentForm = z.infer<typeof assignmentSchema>;

export function TechnicianAssignment() {
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);

  const {
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssignmentForm>({
    resolver: zodResolver(assignmentSchema),
  });

  const selectedTechnicianId = watch("technicianId");

  const unassignedAppointments = appointments.filter(
    apt => !apt.technicianId && apt.status !== "cancelled" && apt.status !== "completed"
  );
  const assignedAppointments = appointments.filter(
    apt => apt.technicianId && apt.status !== "cancelled" && apt.status !== "completed"
  );

  const onSubmit = (data: AssignmentForm) => {
    const technician = technicians.find(t => t.id === data.technicianId);
    toast.success(`Appointment assigned to ${technician?.name}`);
    setSelectedAppointment(null);
    reset();
  };

  const handleAssign = (appointmentId: string) => {
    setSelectedAppointment(appointmentId);
    reset();
  };

  const handleUnassign = (appointmentId: string, technicianName: string) => {
    toast.success(`Unassigned from ${technicianName}`);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
      confirmed: { label: "Confirmed", className: "bg-blue-100 text-blue-800" },
      "in-progress": { label: "In Progress", className: "bg-purple-100 text-purple-800" },
    };
    const config = variants[status] || variants.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getTechnicianStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      available: { label: "Available", className: "bg-green-100 text-green-800" },
      busy: { label: "Busy", className: "bg-orange-100 text-orange-800" },
      offline: { label: "Offline", className: "bg-gray-100 text-gray-800" },
    };
    const config = variants[status] || variants.available;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const AppointmentCard = ({ appointment, showAssignButton }: { appointment: any; showAssignButton: boolean }) => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex gap-2 mb-2">
              {getStatusBadge(appointment.status)}
            </div>
            <CardTitle className="text-lg">{appointment.serviceType}</CardTitle>
            <CardDescription>ID: {appointment.id}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-600">Customer</p>
            <p>{appointment.customerName}</p>
          </div>
          <div>
            <p className="text-gray-600">Vehicle</p>
            <p>{appointment.carMake} {appointment.carModel}</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>{new Date(appointment.preferredDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>{appointment.preferredTime}</span>
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span>{appointment.serviceCentreName}</span>
          </div>
          {appointment.technicianName && (
            <div className="flex items-center gap-2 sm:col-span-2">
              <UserCircle className="w-4 h-4 text-gray-500" />
              <span>{appointment.technicianName}</span>
            </div>
          )}
        </div>

        {showAssignButton && selectedAppointment === appointment.id ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 pt-2">
            <div className="space-y-2">
              <Label>Select Technician</Label>
              <Select
                value={selectedTechnicianId}
                onValueChange={(value) => setValue("technicianId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a technician" />
                </SelectTrigger>
                <SelectContent>
                  {technicians.map((tech) => (
                    <SelectItem key={tech.id} value={tech.id}>
                      <div className="flex items-center justify-between w-full gap-3">
                        <span>{tech.name}</span>
                        <span className="text-xs text-gray-500">
                          {tech.specialization} • {tech.assignedAppointments} assigned
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.technicianId && (
                <p className="text-sm text-red-600">{errors.technicianId.message}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" className="flex-1" onClick={() => setSelectedAppointment(null)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="flex-1">
                Confirm Assignment
              </Button>
            </div>
          </form>
        ) : showAssignButton ? (
          <Button size="sm" className="w-full" onClick={() => handleAssign(appointment.id)}>
            <UserCircle className="w-4 h-4 mr-2" />
            Assign Technician
          </Button>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-red-600 hover:text-red-700" 
            onClick={() => handleUnassign(appointment.id, appointment.technicianName)}
          >
            Unassign
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">Technician Assignment</h1>
        <p className="text-gray-600 mt-1">Assign technicians to appointments</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Unassigned Appointments</CardDescription>
            <CardTitle className="text-3xl text-orange-600">{unassignedAppointments.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Assigned Appointments</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{assignedAppointments.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Available Technicians</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {technicians.filter(t => t.status === "available").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Technicians Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Technicians Overview</CardTitle>
          <CardDescription>Current workload and availability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {technicians.map((tech) => (
              <div key={tech.id} className="border rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-medium">{tech.name}</p>
                    <p className="text-sm text-gray-600">{tech.specialization}</p>
                  </div>
                  {getTechnicianStatusBadge(tech.status)}
                </div>
                <div className="flex items-center justify-between text-sm mt-3">
                  <span className="text-gray-600">Assigned:</span>
                  <span className="font-medium">{tech.assignedAppointments}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Appointments Tabs */}
      <Tabs defaultValue="unassigned" className="space-y-4">
        <TabsList>
          <TabsTrigger value="unassigned">
            Unassigned ({unassignedAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="assigned">
            Assigned ({assignedAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="unassigned" className="space-y-4">
          {unassignedAppointments.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {unassignedAppointments.map((apt) => (
                <AppointmentCard key={apt.id} appointment={apt} showAssignButton={true} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="w-12 h-12 mx-auto text-green-500 mb-4" />
                <p className="text-gray-600">All appointments have been assigned</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="assigned" className="space-y-4">
          {assignedAppointments.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {assignedAppointments.map((apt) => (
                <AppointmentCard key={apt.id} appointment={apt} showAssignButton={false} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No assigned appointments</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
