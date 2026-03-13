import { Link } from "react-router";
import { Users, Building2, Calendar, TrendingUp, Clock, CheckCircle2, AlertCircle, UserCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { appointments, serviceCentres, technicians, users, feedbacks } from "../../lib/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

export function AdminDashboard() {
  // Calculate statistics
  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter(apt => apt.status === "pending").length;
  const inProgressAppointments = appointments.filter(apt => apt.status === "in-progress").length;
  const completedAppointments = appointments.filter(apt => apt.status === "completed").length;
  const totalCustomers = users.filter(u => u.role === "customer").length;
  const totalTechnicians = technicians.length;
  const availableTechnicians = technicians.filter(t => t.status === "available").length;
  const totalServiceCentres = serviceCentres.length;
  const averageRating = feedbacks.length > 0 
    ? (feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length).toFixed(1) 
    : "N/A";

  // Today's appointments
  const today = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter(apt => apt.preferredDate === today);

  // Status distribution data for pie chart
  const statusData = [
    { name: "Pending", value: pendingAppointments, color: "#fbbf24" },
    { name: "In Progress", value: inProgressAppointments, color: "#a78bfa" },
    { name: "Completed", value: completedAppointments, color: "#34d399" },
    { name: "Cancelled", value: appointments.filter(apt => apt.status === "cancelled").length, color: "#f87171" },
  ];

  // Appointments by service centre
  const appointmentsByCentre = serviceCentres.map(centre => ({
    name: centre.name.split(" ").slice(0, 2).join(" "),
    appointments: appointments.filter(apt => apt.serviceCentreId === centre.id).length,
    capacity: centre.capacity,
  }));

  // Recent appointments
  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800" },
      confirmed: { label: "Confirmed", className: "bg-blue-100 text-blue-800" },
      "in-progress": { label: "In Progress", className: "bg-purple-100 text-purple-800" },
      completed: { label: "Completed", className: "bg-green-100 text-green-800" },
      cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800" },
      delayed: { label: "Delayed", className: "bg-orange-100 text-orange-800" },
    };
    const config = variants[status] || variants.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your auto service system</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Total Appointments
            </CardDescription>
            <CardTitle className="text-3xl">{totalAppointments}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{todayAppointments.length} scheduled today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Customers
            </CardDescription>
            <CardTitle className="text-3xl">{totalCustomers}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <UserCircle className="w-4 h-4" />
              Technicians
            </CardDescription>
            <CardTitle className="text-3xl">{totalTechnicians}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{availableTechnicians} available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Service Centres
            </CardDescription>
            <CardTitle className="text-3xl">{totalServiceCentres}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Active locations</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-yellow-800">
              <Clock className="w-4 h-4" />
              Pending
            </CardDescription>
            <CardTitle className="text-3xl text-yellow-900">{pendingAppointments}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-purple-800">
              <AlertCircle className="w-4 h-4" />
              In Progress
            </CardDescription>
            <CardTitle className="text-3xl text-purple-900">{inProgressAppointments}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-green-800">
              <CheckCircle2 className="w-4 h-4" />
              Completed
            </CardDescription>
            <CardTitle className="text-3xl text-green-900">{completedAppointments}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2 text-blue-800">
              <TrendingUp className="w-4 h-4" />
              Average Rating
            </CardDescription>
            <CardTitle className="text-3xl text-blue-900">{averageRating}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700">{feedbacks.length} reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments by Service Centre */}
        <Card>
          <CardHeader>
            <CardTitle>Appointments by Service Centre</CardTitle>
            <CardDescription>Total appointments per location</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={appointmentsByCentre}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="appointments" fill="#3b82f6" name="Appointments" />
                <Bar dataKey="capacity" fill="#94a3b8" name="Capacity" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment Status Distribution</CardTitle>
            <CardDescription>Current status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Appointments</CardTitle>
              <CardDescription>Latest bookings in the system</CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link to="/admin/reports">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAppointments.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="font-medium">{apt.customerName}</p>
                      <p className="text-sm text-gray-600">{apt.serviceType}</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>{new Date(apt.preferredDate).toLocaleDateString()}</p>
                      <p>{apt.preferredTime}</p>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  {getStatusBadge(apt.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button asChild variant="outline" className="h-auto py-6">
          <Link to="/admin/service-centres" className="flex flex-col items-center gap-2">
            <Building2 className="w-6 h-6" />
            <span>Manage Service Centres</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-6">
          <Link to="/admin/technician-assignment" className="flex flex-col items-center gap-2">
            <Users className="w-6 h-6" />
            <span>Assign Technicians</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-6">
          <Link to="/admin/users" className="flex flex-col items-center gap-2">
            <UserCircle className="w-6 h-6" />
            <span>User Management</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-6">
          <Link to="/admin/reports" className="flex flex-col items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            <span>View Reports</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
