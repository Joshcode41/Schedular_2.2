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
import { useServiceCentres } from "../../hooks/useData";
import { useAppointmentMutations } from "../../hooks/useData";
import { useAuth } from "../../context/AuthContext";
import { DarkModeToggle } from "../../components/DarkModeToggle";

// Clean rewrite to fix JSX structure

const serviceTypes = [
  "Oil Change",
  "Tire Service",
  "Brake Maintenance",
  "General Checkup",
  "Major Repair",
  "Suspension",
  "Engine Repair",
  "Body Work"
];

const bookingSchema = z.object({
  vehicle_make: z.string().min(2, "Car make is required"),
  vehicle_model: z.string().min(2, "Car model is required"),
  vehicle_year: z.string().min(4, "Valid year is required"),
  registration_number: z.string().min(3, "Registration number is required"),
  service_type: z.string().min(1, "Please select a service type"),
  service_centre_id: z.string().min(1, "Please select a service centre"),
  appointment_date: z.string().min(1, "Please select a date"),
  appointment_time: z.string().min(1, "Please select a time"),
  additional_notes: z.string().optional(),
});

type BookingForm = z.infer<typeof bookingSchema>;

export function BookAppointment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { centres, loading: centresLoading } = useServiceCentres();
  const { createAppointment, loading: submitting, error: submitError } = useAppointmentMutations();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      vehicle_make: "",
      vehicle_model: "",
      vehicle_year: "",
      registration_number: "",
      service_type: "",
      service_centre_id: "",
      appointment_date: "",
      appointment_time: "",
      additional_notes: "",
    },
  });

  const selectedServiceCentre = watch("service_centre_id");
  const selectedServiceType = watch("service_type");

  const onSubmit = async (data: BookingForm) => {
    try {
      await createAppointment({
        customer_id: user!.id,
        service_centre_id: data.service_centre_id,
        appointment_date: data.appointment_date,
        appointment_time: data.appointment_time,
        service_type: data.service_type,
        description: data.additional_notes,
        vehicle_make: data.vehicle_make,
        vehicle_model: data.vehicle_model,
        vehicle_year: data.vehicle_year,
        registration_number: data.registration_number,
      });
      toast.success("Appointment booked successfully!");
      navigate("/customer/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to book appointment");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Book an Appointment</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Schedule your car service</p>
          </div>
        </div>
        <DarkModeToggle size="sm" />
      </div>

      {submitError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">{submitError}</p>
          </CardContent>
        </Card>
      )}

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
                <Label htmlFor="vehicle_make">Car Make</Label>
                <Input
                  id="vehicle_make"
                  placeholder="e.g., Toyota"
                  {...register("vehicle_make")}
                />
                {errors.vehicle_make && (
                  <p className="text-sm text-red-600">{errors.vehicle_make.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle_model">Car Model</Label>
                <Input
                  id="vehicle_model"
                  placeholder="e.g., Corolla"
                  {...register("vehicle_model")}
                />
                {errors.vehicle_model && (
                  <p className="text-sm text-red-600">{errors.vehicle_model.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle_year">Year</Label>
                <Input
                  id="vehicle_year"
                  placeholder="e.g., 2020"
                  {...register("vehicle_year")}
                />
                {errors.vehicle_year && (
                  <p className="text-sm text-red-600">{errors.vehicle_year.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="registration_number">Registration Number</Label>
                <Input
                  id="registration_number"
                  placeholder="e.g., KCA 123A"
                  {...register("registration_number")}
                />
                {errors.registration_number && (
                  <p className="text-sm text-red-600">{errors.registration_number.message}</p>
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
              <Label htmlFor="service_type">Service Type</Label>
              <Select
                value={selectedServiceType}
                onValueChange={(value) => setValue("service_type", value)}
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
              {errors.service_type && (
                <p className="text-sm text-red-600">{errors.service_type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="service_centre_id">Service Centre</Label>
              {centresLoading ? (
                <div className="text-sm text-gray-500">Loading service centres...</div>
              ) : (
                <>
                  <Select
                    value={selectedServiceCentre}
                    onValueChange={(value) => setValue("service_centre_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service centre" />
                    </SelectTrigger>
                    <SelectContent>
                      {centres.map((centre: any) => (
                        <SelectItem key={centre.id} value={centre.id}>
                          <div className="flex flex-col">
                            <span>{centre.name}</span>
                            <span className="text-xs text-gray-500">{centre.location}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
              {errors.service_centre_id && (
                <p className="text-sm text-red-600">{errors.service_centre_id.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appointment_date">Preferred Date</Label>
                <Input
                  id="appointment_date"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  {...register("appointment_date")}
                />
                {errors.appointment_date && (
                  <p className="text-sm text-red-600">{errors.appointment_date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="appointment_time">Preferred Time</Label>
                <Select
                  value={watch("appointment_time")}
                  onValueChange={(value) => setValue("appointment_time", value)}
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
                {errors.appointment_time && (
                  <p className="text-sm text-red-600">{errors.appointment_time.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additional_notes">Additional Notes (Optional)</Label>
              <Textarea
                id="additional_notes"
                placeholder="Any specific requirements or issues you'd like to mention..."
                rows={3}
                {...register("additional_notes")}
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
                <p>{user?.name}</p>
              </div>
              <div>
                <Label className="text-gray-600">Email</Label>
                <p>{user?.email}</p>
              </div>
              <div>
                <Label className="text-gray-600">Phone</Label>
                <p>{user?.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting} className="flex-1">
            {submitting ? "Booking..." : "Book Appointment"}
          </Button>
        </div>
      </form>
    </div>
  );
}
