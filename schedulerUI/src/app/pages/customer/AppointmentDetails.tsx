import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, Calendar, Clock, MapPin, User, Car, Phone, Mail, MessageSquare, XCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/alert-dialog";
import { toast } from "sonner";
import { getAppointmentById } from "../../lib/mockData";

export function AppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const appointment = getAppointmentById(id || "");

  if (!appointment) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">Appointment not found</p>
            <Button asChild className="mt-4">
              <Link to="/customer/dashboard">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  const canCancel = appointment.status === "pending" || appointment.status === "confirmed";

  const handleCancel = () => {
    toast.success("Appointment cancelled successfully");
    navigate("/customer/dashboard");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl">Appointment Details</h1>
          <p className="text-gray-600 mt-1">Booking ID: {appointment.id}</p>
        </div>
        {getStatusBadge(appointment.status)}
      </div>

      {/* Service Information */}
      <Card>
        <CardHeader>
          <CardTitle>Service Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Service Type</p>
            <p className="text-lg">{appointment.serviceType}</p>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p>{new Date(appointment.preferredDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p>{appointment.preferredTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Service Centre</p>
                <p>{appointment.serviceCentreName}</p>
              </div>
            </div>
            {appointment.technicianName && (
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Assigned Technician</p>
                  <p>{appointment.technicianName}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5" />
            Vehicle Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Make & Model</p>
              <p>{appointment.carMake} {appointment.carModel}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Year</p>
              <p>{appointment.carYear}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Registration Number</p>
              <p>{appointment.registrationNumber}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Customer Name</p>
                <p>{appointment.customerName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p>{appointment.customerPhone}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Remarks */}
      {appointment.remarks && (
        <Card>
          <CardHeader>
            <CardTitle>Remarks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{appointment.remarks}</p>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Booked On</p>
            <p>{new Date(appointment.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last Updated</p>
            <p>{new Date(appointment.updatedAt).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="outline" className="flex-1">
          <Link to="/customer/dashboard">Back to Dashboard</Link>
        </Button>
        
        {appointment.status === "completed" && (
          <Button asChild className="flex-1">
            <Link to={`/customer/feedback/${appointment.id}`}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Leave Feedback
            </Link>
          </Button>
        )}

        {canCancel && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex-1">
                <XCircle className="w-4 h-4 mr-2" />
                Cancel Appointment
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cancel this appointment? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancel} className="bg-red-600 hover:bg-red-700">
                  Yes, Cancel
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
