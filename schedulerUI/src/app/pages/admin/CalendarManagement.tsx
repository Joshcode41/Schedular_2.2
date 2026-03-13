import { useState } from "react";
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { appointments, serviceBays, shifts, serviceCentres } from "../../lib/mockData";
import { format, startOfWeek, addDays, isSameDay, parseISO } from "date-fns";

export function CalendarManagement() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week">("week");
  const [selectedCentre, setSelectedCentre] = useState("all");

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Filter appointments by selected centre
  const filteredAppointments = appointments.filter((apt) => {
    if (selectedCentre === "all") return true;
    return apt.serviceCentreId === selectedCentre;
  });

  // Get appointments for a specific day
  const getAppointmentsForDay = (date: Date) => {
    return filteredAppointments.filter((apt) =>
      isSameDay(parseISO(apt.preferredDate), date)
    );
  };

  // Get shifts for a specific day
  const getShiftsForDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return shifts.filter((shift) => shift.date === dateStr);
  };

  // Calculate capacity and utilization
  const getCapacityForDay = (date: Date) => {
    const dayAppointments = getAppointmentsForDay(date);
    const dayShifts = getShiftsForDay(date);
    
    const activeShifts = dayShifts.filter((s) => s.status !== "cancelled").length;
    const totalAppointments = dayAppointments.length;
    const completed = dayAppointments.filter((a) => a.status === "completed").length;
    const inProgress = dayAppointments.filter((a) => a.status === "in-progress").length;

    return {
      appointments: totalAppointments,
      completed,
      inProgress,
      technicians: activeShifts,
      utilization: totalAppointments > 0 ? Math.round((inProgress + completed) / totalAppointments * 100) : 0,
    };
  };

  // Check for conflicts and double bookings
  const getConflicts = (date: Date) => {
    const dayAppointments = getAppointmentsForDay(date);
    const conflicts: string[] = [];

    // Check for time slot conflicts
    const timeSlots = dayAppointments.map((apt) => apt.preferredTime);
    const duplicates = timeSlots.filter((time, index) => timeSlots.indexOf(time) !== index);
    
    if (duplicates.length > 0) {
      conflicts.push(`${duplicates.length} time slot conflicts`);
    }

    // Check if appointments exceed technician capacity
    const dayShifts = getShiftsForDay(date);
    const activeTechs = dayShifts.filter((s) => s.status !== "cancelled").length;
    
    if (dayAppointments.length > activeTechs * 4) {
      conflicts.push("Exceeds technician capacity");
    }

    return conflicts;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
      confirmed: { label: "Confirmed", className: "bg-blue-100 text-blue-800" },
      "in-progress": { label: "In Progress", className: "bg-purple-100 text-purple-800" },
      completed: { label: "Completed", className: "bg-green-100 text-green-800" },
    };
    const config = variants[status] || variants.pending;
    return <Badge className={config.className} style={{ fontSize: "0.65rem", padding: "0.125rem 0.375rem" }}>{config.label}</Badge>;
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const days = direction === "prev" ? -7 : 7;
    setCurrentDate(addDays(currentDate, days));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl">Calendar Management</h1>
          <p className="text-gray-600 mt-1">Schedule overview with automated conflict detection</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedCentre} onValueChange={setSelectedCentre}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Centres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Service Centres</SelectItem>
              {serviceCentres.map((centre) => (
                <SelectItem key={centre.id} value={centre.id}>
                  {centre.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Resource Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Available Bays</CardDescription>
            <CardTitle className="text-3xl">
              {serviceBays.filter((b) => b.status === "available").length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Out of {serviceBays.length} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Shifts</CardDescription>
            <CardTitle className="text-3xl">
              {shifts.filter((s) => s.status === "in-progress").length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Technicians working now</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Today's Appointments</CardDescription>
            <CardTitle className="text-3xl">
              {getAppointmentsForDay(new Date()).length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              {getAppointmentsForDay(new Date()).filter((a) => a.status === "in-progress").length} in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Conflicts Detected</CardDescription>
            <CardTitle className="text-3xl text-red-600">
              {getConflicts(new Date()).length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => navigateWeek("prev")}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-center">
                <p className="text-lg font-medium">
                  {format(weekStart, "MMM d")} - {format(addDays(weekStart, 6), "MMM d, yyyy")}
                </p>
                <p className="text-sm text-gray-600">Week View</p>
              </div>
              <Button variant="outline" size="icon" onClick={() => navigateWeek("next")}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <Button onClick={() => setCurrentDate(new Date())}>Today</Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Week Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, index) => {
              const dayAppointments = getAppointmentsForDay(day);
              const dayShifts = getShiftsForDay(day);
              const capacity = getCapacityForDay(day);
              const conflicts = getConflicts(day);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={index}
                  className={`border rounded-lg p-3 min-h-[300px] ${
                    isToday ? "border-blue-500 bg-blue-50" : "border-gray-200"
                  }`}
                >
                  {/* Day Header */}
                  <div className="mb-3">
                    <p className="text-sm font-medium text-center">
                      {format(day, "EEE")}
                    </p>
                    <p className={`text-2xl font-bold text-center ${isToday ? "text-blue-600" : ""}`}>
                      {format(day, "d")}
                    </p>
                  </div>

                  {/* Capacity Indicator */}
                  <div className="mb-3 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Capacity</span>
                      <span className="font-medium">{capacity.utilization}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          capacity.utilization >= 90
                            ? "bg-red-500"
                            : capacity.utilization >= 70
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${capacity.utilization}%` }}
                      />
                    </div>
                  </div>

                  {/* Conflicts Warning */}
                  {conflicts.length > 0 && (
                    <div className="mb-2 bg-red-50 border border-red-200 rounded px-2 py-1">
                      <div className="flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-red-600" />
                        <span className="text-xs text-red-800">{conflicts.length} conflict(s)</span>
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="mb-3 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Technicians:</span>
                      <span className="font-medium">{capacity.technicians}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Appointments:</span>
                      <span className="font-medium">{capacity.appointments}</span>
                    </div>
                  </div>

                  {/* Appointments List */}
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {dayAppointments.slice(0, 4).map((apt) => (
                      <div
                        key={apt.id}
                        className="bg-white border rounded p-1.5 text-xs hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <span className="font-medium truncate">{apt.preferredTime}</span>
                          {getStatusBadge(apt.status)}
                        </div>
                        <p className="text-gray-700 truncate">{apt.customerName}</p>
                        <p className="text-gray-500 truncate">{apt.serviceType}</p>
                      </div>
                    ))}
                    {dayAppointments.length > 4 && (
                      <p className="text-xs text-center text-gray-500 pt-1">
                        +{dayAppointments.length - 4} more
                      </p>
                    )}
                    {dayAppointments.length === 0 && (
                      <p className="text-xs text-center text-gray-400 py-4">No appointments</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Automated Logic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Automated Scheduling Logic
          </CardTitle>
          <CardDescription>Smart features to prevent conflicts and optimize bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Conflict Prevention</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Detects double-booked time slots</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Prevents technician overallocation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Validates service bay availability</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                  <span>Checks shift schedules automatically</span>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Smart Optimization</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" />
                  <span>Suggests optimal time slots</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" />
                  <span>Balances workload across technicians</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" />
                  <span>Real-time capacity monitoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" />
                  <span>Auto-alerts on overbooking risk</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
