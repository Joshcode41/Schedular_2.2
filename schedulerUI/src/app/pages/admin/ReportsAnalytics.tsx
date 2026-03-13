import { useState } from "react";
import { Calendar, Download, TrendingUp, Users, CheckCircle2, Star, FileText } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";
import { appointments, technicians, serviceCentres, feedbacks } from "../../lib/mockData";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export function ReportsAnalytics() {
  const [dateRange, setDateRange] = useState("week");
  const [selectedCentre, setSelectedCentre] = useState("all");

  // Filter appointments based on selections
  const filteredAppointments = appointments.filter(apt => {
    if (selectedCentre !== "all" && apt.serviceCentreId !== selectedCentre) {
      return false;
    }
    return true;
  });

  // Calculate metrics
  const totalAppointments = filteredAppointments.length;
  const completedAppointments = filteredAppointments.filter(apt => apt.status === "completed").length;
  const completionRate = totalAppointments > 0 
    ? ((completedAppointments / totalAppointments) * 100).toFixed(1) 
    : "0";
  const averageRating = feedbacks.length > 0 
    ? (feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length).toFixed(1) 
    : "N/A";

  // Appointments by service type
  const serviceTypeData = filteredAppointments.reduce((acc, apt) => {
    const type = apt.serviceType;
    if (!acc[type]) {
      acc[type] = { name: type.length > 20 ? type.substring(0, 20) + "..." : type, count: 0 };
    }
    acc[type].count++;
    return acc;
  }, {} as Record<string, { name: string; count: number }>);
  const serviceTypeChartData = Object.values(serviceTypeData).sort((a, b) => b.count - a.count).slice(0, 8);

  // Appointments by status
  const statusData = [
    { 
      name: "Pending", 
      value: filteredAppointments.filter(apt => apt.status === "pending").length,
      color: "#fbbf24"
    },
    { 
      name: "Confirmed", 
      value: filteredAppointments.filter(apt => apt.status === "confirmed").length,
      color: "#3b82f6"
    },
    { 
      name: "In Progress", 
      value: filteredAppointments.filter(apt => apt.status === "in-progress").length,
      color: "#a78bfa"
    },
    { 
      name: "Completed", 
      value: filteredAppointments.filter(apt => apt.status === "completed").length,
      color: "#34d399"
    },
    { 
      name: "Cancelled", 
      value: filteredAppointments.filter(apt => apt.status === "cancelled").length,
      color: "#f87171"
    },
    { 
      name: "Delayed", 
      value: filteredAppointments.filter(apt => apt.status === "delayed").length,
      color: "#fb923c"
    },
  ];

  // Technician performance
  const technicianPerformance = technicians.map(tech => {
    const techAppointments = appointments.filter(apt => apt.technicianId === tech.id);
    const completed = techAppointments.filter(apt => apt.status === "completed").length;
    return {
      name: tech.name,
      total: techAppointments.length,
      completed,
      specialization: tech.specialization,
    };
  }).sort((a, b) => b.completed - a.completed);

  // Service centre performance
  const centrePerformance = serviceCentres.map(centre => {
    const centreAppointments = appointments.filter(apt => apt.serviceCentreId === centre.id);
    const completed = centreAppointments.filter(apt => apt.status === "completed").length;
    return {
      name: centre.name,
      total: centreAppointments.length,
      completed,
      location: centre.location,
    };
  }).sort((a, b) => b.total - a.total);

  // Recent feedback
  const recentFeedback = [...feedbacks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  const handleExportReport = (type: string) => {
    toast.success(`${type} report exported successfully`);
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 inline ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">System performance and insights</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => handleExportReport("Summary")}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
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
            <p className="text-sm text-gray-600">All time bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Completed
            </CardDescription>
            <CardTitle className="text-3xl">{completedAppointments}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{completionRate}% completion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Average Rating
            </CardDescription>
            <CardTitle className="text-3xl">{averageRating}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{feedbacks.length} total reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Active Technicians
            </CardDescription>
            <CardTitle className="text-3xl">
              {technicians.filter(t => t.status !== "offline").length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Out of {technicians.length} total</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="technicians">Technicians</TabsTrigger>
          <TabsTrigger value="centres">Service Centres</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Service Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Services</CardTitle>
                <CardDescription>Most requested service types</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={serviceTypeChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" name="Appointments" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Appointment Status</CardTitle>
                <CardDescription>Current status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData.filter(s => s.value > 0)}
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
        </TabsContent>

        <TabsContent value="technicians" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Technician Performance</CardTitle>
                  <CardDescription>Appointments handled and completed</CardDescription>
                </div>
                <Button variant="outline" onClick={() => handleExportReport("Technician Performance")}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Technician</TableHead>
                      <TableHead>Specialization</TableHead>
                      <TableHead className="text-center">Total</TableHead>
                      <TableHead className="text-center">Completed</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {technicianPerformance.map((tech) => {
                      const rate = tech.total > 0 ? ((tech.completed / tech.total) * 100).toFixed(0) : "0";
                      return (
                        <TableRow key={tech.name}>
                          <TableCell className="font-medium">{tech.name}</TableCell>
                          <TableCell>{tech.specialization}</TableCell>
                          <TableCell className="text-center">{tech.total}</TableCell>
                          <TableCell className="text-center">{tech.completed}</TableCell>
                          <TableCell className="text-right">{rate}%</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="centres" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Service Centre Performance</CardTitle>
                  <CardDescription>Bookings by location</CardDescription>
                </div>
                <Button variant="outline" onClick={() => handleExportReport("Service Centre Performance")}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service Centre</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-center">Total Appointments</TableHead>
                      <TableHead className="text-center">Completed</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {centrePerformance.map((centre) => {
                      const rate = centre.total > 0 ? ((centre.completed / centre.total) * 100).toFixed(0) : "0";
                      return (
                        <TableRow key={centre.name}>
                          <TableCell className="font-medium">{centre.name}</TableCell>
                          <TableCell>{centre.location}</TableCell>
                          <TableCell className="text-center">{centre.total}</TableCell>
                          <TableCell className="text-center">{centre.completed}</TableCell>
                          <TableCell className="text-right">{rate}%</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Customer Feedback</CardTitle>
                  <CardDescription>Recent reviews and ratings</CardDescription>
                </div>
                <Button variant="outline" onClick={() => handleExportReport("Customer Feedback")}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentFeedback.length > 0 ? (
                recentFeedback.map((feedback) => (
                  <div key={feedback.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{feedback.customerName}</p>
                        <p className="text-sm text-gray-600">Appointment ID: {feedback.appointmentId}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {getRatingStars(feedback.rating)}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">{feedback.comment}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No feedback available yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
