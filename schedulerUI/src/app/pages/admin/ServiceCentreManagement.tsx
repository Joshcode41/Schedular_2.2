import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, MapPin, Phone, Mail, Plus, Edit, Trash2, Users } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";
import { serviceCentres, appointments } from "../../lib/mockData";

const serviceCentreSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  location: z.string().min(5, "Location must be at least 5 characters"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Valid email required"),
  capacity: z.string().min(1, "Capacity is required"),
});

type ServiceCentreForm = z.infer<typeof serviceCentreSchema>;

export function ServiceCentreManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCentre, setEditingCentre] = useState<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceCentreForm>({
    resolver: zodResolver(serviceCentreSchema),
  });

  const onSubmit = (data: ServiceCentreForm) => {
    if (editingCentre) {
      toast.success("Service centre updated successfully");
    } else {
      toast.success("Service centre added successfully");
    }
    setIsDialogOpen(false);
    setEditingCentre(null);
    reset();
  };

  const handleEdit = (centre: any) => {
    setEditingCentre(centre);
    reset({
      name: centre.name,
      location: centre.location,
      phone: centre.phone,
      email: centre.email,
      capacity: centre.capacity.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    toast.success("Service centre deleted successfully");
  };

  const handleAddNew = () => {
    setEditingCentre(null);
    reset({
      name: "",
      location: "",
      phone: "",
      email: "",
      capacity: "",
    });
    setIsDialogOpen(true);
  };

  const getUtilizationBadge = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage >= 90) {
      return <Badge className="bg-red-100 text-red-800">High ({percentage.toFixed(0)}%)</Badge>;
    } else if (percentage >= 70) {
      return <Badge className="bg-orange-100 text-orange-800">Medium ({percentage.toFixed(0)}%)</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">Low ({percentage.toFixed(0)}%)</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl">Service Centre Management</h1>
          <p className="text-gray-600 mt-1">Manage garage locations and capacity</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="w-4 h-4 mr-2" />
              Add Service Centre
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCentre ? "Edit Service Centre" : "Add New Service Centre"}
              </DialogTitle>
              <DialogDescription>
                {editingCentre 
                  ? "Update the service centre details below" 
                  : "Enter the details for the new service centre"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Centre Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Downtown Auto Service"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Nairobi CBD, Kenyatta Avenue"
                  {...register("location")}
                />
                {errors.location && (
                  <p className="text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+254 700 000 000"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@servicecentre.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Daily Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="10"
                  {...register("capacity")}
                />
                {errors.capacity && (
                  <p className="text-sm text-red-600">{errors.capacity.message}</p>
                )}
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCentre ? "Update" : "Add"} Service Centre
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Service Centres</CardDescription>
            <CardTitle className="text-3xl">{serviceCentres.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Capacity</CardDescription>
            <CardTitle className="text-3xl">
              {serviceCentres.reduce((sum, sc) => sum + sc.capacity, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Current Bookings</CardDescription>
            <CardTitle className="text-3xl">
              {serviceCentres.reduce((sum, sc) => sum + sc.currentBookings, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Service Centres List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {serviceCentres.map((centre) => {
          const centreAppointments = appointments.filter(apt => apt.serviceCentreId === centre.id);
          const activeAppointments = centreAppointments.filter(
            apt => apt.status !== "completed" && apt.status !== "cancelled"
          );
          
          return (
            <Card key={centre.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      {centre.name}
                    </CardTitle>
                    <CardDescription className="mt-2 flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{centre.location}</span>
                    </CardDescription>
                  </div>
                  {getUtilizationBadge(centre.currentBookings, centre.capacity)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{centre.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{centre.email}</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-md p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Capacity Utilization</span>
                    <span className="text-sm">
                      {centre.currentBookings} / {centre.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(centre.currentBookings / centre.capacity) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-blue-50 rounded-md p-2 text-center">
                    <p className="text-blue-900 font-medium">{activeAppointments.length}</p>
                    <p className="text-blue-700 text-xs">Active Bookings</p>
                  </div>
                  <div className="bg-green-50 rounded-md p-2 text-center">
                    <p className="text-green-900 font-medium">
                      {centreAppointments.filter(apt => apt.status === "completed").length}
                    </p>
                    <p className="text-green-700 text-xs">Completed</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(centre)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(centre.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
