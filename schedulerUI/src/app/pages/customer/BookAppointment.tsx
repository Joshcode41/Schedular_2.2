import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { ArrowLeft, Calendar, Car } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { toast } from "sonner";
import { currentUser, serviceCentres, serviceTypes } from "../../lib/mockData";

const bookingSchema = z.object({
  carMake: z.string().min(2, "Car make is required"),
  carModel: z.string().min(2, "Car model is required"),
  carYear: z.string().min(4, "Valid year is required"),
  registrationNumber: z.string().min(3, "Registration number is required"),
  serviceType: z.string().min(1, "Please select a service type"),
  serviceCentreId: z.string().min(1, "Please select a service centre"),
  preferredDate: z.string().min(1, "Please select a date"),
  preferredTime: z.string().min(1, "Please select a time"),
  additionalNotes: z.string().optional(),
});

type BookingForm = z.infer<typeof bookingSchema>;

export function BookAppointment() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      carMake: "",
      carModel: "",
      carYear: "",
      registrationNumber: "",
      serviceType: "",
      serviceCentreId: "",
      preferredDate: "",
      preferredTime: "",
      additionalNotes: "",
    },
  });

  const selectedServiceCentre = watch("serviceCentreId");
  const selectedServiceType = watch("serviceType");

  const onSubmit = (data: BookingForm) => {
    const serviceCentre = serviceCentres.find(sc => sc.id === data.serviceCentreId);
    
    // Check availability
    if (serviceCentre && serviceCentre.currentBookings >= serviceCentre.capacity) {
      toast.error("Selected service centre is fully booked. Please choose another date or location.");
      return;
    }

    toast.success("Appointment booked successfully! You will receive a confirmation shortly.");
    navigate("/customer/dashboard");
  };

  const getAvailabilityStatus = (centreId: string) => {
    const centre = serviceCentres.find(sc => sc.id === centreId);
    if (!centre) return null;
    
    const availableSlots = centre.capacity - centre.currentBookings;
    const percentage = (centre.currentBookings / centre.capacity) * 100;
    
    if (percentage >= 90) {
      return <span className="text-red-600 text-sm">Almost Full ({availableSlots} slots left)</span>;
    } else if (percentage >= 70) {
      return <span className="text-orange-600 text-sm">Limited Availability ({availableSlots} slots left)</span>;
    } else {
      return <span className="text-green-600 text-sm">Available ({availableSlots} slots left)</span>;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl">Book an Appointment</h1>
          <p className="text-gray-600 mt-1">Schedule your car service</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Vehicle Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5" />
              Vehicle Information
            </CardTitle>
            <CardDescription>Enter your vehicle details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="carMake">Car Make</Label>
                <Input
                  id="carMake"
                  placeholder="e.g., Toyota"
                  {...register("carMake")}
                />
                {errors.carMake && (
                  <p className="text-sm text-red-600">{errors.carMake.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="carModel">Car Model</Label>
                <Input
                  id="carModel"
                  placeholder="e.g., Corolla"
                  {...register("carModel")}
                />
                {errors.carModel && (
                  <p className="text-sm text-red-600">{errors.carModel.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="carYear">Year</Label>
                <Input
                  id="carYear"
                  placeholder="e.g., 2020"
                  {...register("carYear")}
                />
                {errors.carYear && (
                  <p className="text-sm text-red-600">{errors.carYear.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  placeholder="e.g., KCA 123A"
                  {...register("registrationNumber")}
                />
                {errors.registrationNumber && (
                  <p className="text-sm text-red-600">{errors.registrationNumber.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Service Details
            </CardTitle>
            <CardDescription>Choose service type and schedule</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="serviceType">Service Type</Label>
              <Select
                value={selectedServiceType}
                onValueChange={(value) => setValue("serviceType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.serviceType && (
                <p className="text-sm text-red-600">{errors.serviceType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceCentreId">Service Centre</Label>
              <Select
                value={selectedServiceCentre}
                onValueChange={(value) => setValue("serviceCentreId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service centre" />
                </SelectTrigger>
                <SelectContent>
                  {serviceCentres.map((centre) => (
                    <SelectItem key={centre.id} value={centre.id}>
                      <div className="flex flex-col">
                        <span>{centre.name}</span>
                        <span className="text-xs text-gray-500">{centre.location}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedServiceCentre && (
                <div className="flex justify-between items-center">
                  {getAvailabilityStatus(selectedServiceCentre)}
                </div>
              )}
              {errors.serviceCentreId && (
                <p className="text-sm text-red-600">{errors.serviceCentreId.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferredDate">Preferred Date</Label>
                <Input
                  id="preferredDate"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  {...register("preferredDate")}
                />
                {errors.preferredDate && (
                  <p className="text-sm text-red-600">{errors.preferredDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredTime">Preferred Time</Label>
                <Select
                  value={watch("preferredTime")}
                  onValueChange={(value) => setValue("preferredTime", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="08:00">08:00 AM</SelectItem>
                    <SelectItem value="09:00">09:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="12:00">12:00 PM</SelectItem>
                    <SelectItem value="13:00">01:00 PM</SelectItem>
                    <SelectItem value="14:00">02:00 PM</SelectItem>
                    <SelectItem value="15:00">03:00 PM</SelectItem>
                    <SelectItem value="16:00">04:00 PM</SelectItem>
                    <SelectItem value="17:00">05:00 PM</SelectItem>
                  </SelectContent>
                </Select>
                {errors.preferredTime && (
                  <p className="text-sm text-red-600">{errors.preferredTime.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
              <Textarea
                id="additionalNotes"
                placeholder="Any specific requirements or issues you'd like to mention..."
                rows={3}
                {...register("additionalNotes")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Your registered contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-gray-600">Name</Label>
                <p>{currentUser.name}</p>
              </div>
              <div>
                <Label className="text-gray-600">Email</Label>
                <p>{currentUser.email}</p>
              </div>
              <div>
                <Label className="text-gray-600">Phone</Label>
                <p>{currentUser.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            Book Appointment
          </Button>
        </div>
      </form>
    </div>
  );
}
