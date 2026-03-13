import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Calendar, Clock, MapPin, Car, User, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { toast } from "sonner";
import { getAppointmentById } from "../../lib/mockData";

const statusUpdateSchema = z.object({
  status: z.enum(["confirmed", "in-progress", "completed", "delayed"], {
    required_error: "Please select a status",
  }),
  remarks: z.string().min(10, "Remarks must be at least 10 characters"),
});

type StatusUpdateForm = z.infer<typeof statusUpdateSchema>;

export function UpdateStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const appointment = getAppointmentById(id || "");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StatusUpdateForm>({
    resolver: zodResolver(statusUpdateSchema),
    defaultValues: {
      status: appointment?.status as any || "confirmed",
      remarks: appointment?.remarks || "",
    },
  });

  const selectedStatus = watch("status");

  const onSubmit = (data: StatusUpdateForm) => {
    toast.success("Appointment status updated successfully");
    navigate("/technician/dashboard");
  };

  if (!appointment) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">Appointment not found</p>
            <Button asChild className="mt-4">
              <span onClick={() => navigate("/technician/dashboard")}>Back to Dashboard</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusOptions = [
    {
      value: "confirmed",
      label: "Confirmed",
      description: "Appointment is confirmed and scheduled",
      icon: CheckCircle2,
      color: "text-blue-600",
    },
    {
      value: "in-progress",
      label: "In Progress",
      description: "Work is currently being performed",
      icon: AlertCircle,
      color: "text-purple-600",
    },
    {
      value: "delayed",
      label: "Delayed",
      description: "Work is delayed due to unforeseen circumstances",
      icon: XCircle,
      color: "text-orange-600",
    },
    {
      value: "completed",
      label: "Completed",
      description: "All work has been finished",
      icon: CheckCircle2,
      color: "text-green-600",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl">Update Appointment Status</h1>
          <p className="text-gray-600 mt-1">Update the repair status and add remarks</p>
        </div>
      </div>

      {/* Appointment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
          <CardDescription>ID: {appointment.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Service Type</p>
            <p className="text-lg">{appointment.serviceType}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-gray-600">Customer</p>
                <p>{appointment.customerName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-gray-600">Vehicle</p>
                <p>{appointment.carMake} {appointment.carModel} ({appointment.carYear})</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-gray-600">Date</p>
                <p>{new Date(appointment.preferredDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-gray-600">Time</p>
                <p>{appointment.preferredTime}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-500 mt-1" />
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="text-sm">{appointment.serviceCentreName}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Update Form */}
      <Card>
        <CardHeader>
          <CardTitle>Update Status</CardTitle>
          <CardDescription>Select the current status and provide details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Status Selection */}
            <div className="space-y-3">
              <Label>Repair Status</Label>
              <RadioGroup
                value={selectedStatus}
                onValueChange={(value) => setValue("status", value as any)}
              >
                <div className="space-y-3">
                  {statusOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <div
                        key={option.value}
                        className={`flex items-start space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedStatus === option.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setValue("status", option.value as any)}
                      >
                        <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-5 h-5 ${option.color}`} />
                            <Label htmlFor={option.value} className="cursor-pointer">
                              {option.label}
                            </Label>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </RadioGroup>
              {errors.status && (
                <p className="text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>

            {/* Remarks */}
            <div className="space-y-2">
              <Label htmlFor="remarks">Technician Remarks</Label>
              <Textarea
                id="remarks"
                placeholder="Provide details about the repair work, parts used, issues found, recommendations, etc."
                rows={6}
                {...register("remarks")}
              />
              {errors.remarks && (
                <p className="text-sm text-red-600">{errors.remarks.message}</p>
              )}
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-sm text-blue-900">
                <strong>Remarks Guidelines:</strong>
              </p>
              <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
                <li>Describe the work performed in detail</li>
                <li>List any parts replaced or repaired</li>
                <li>Note any additional issues discovered</li>
                <li>Provide recommendations for future maintenance</li>
                {selectedStatus === "delayed" && (
                  <li className="text-orange-700 font-medium">Explain the reason for the delay and expected completion time</li>
                )}
                {selectedStatus === "completed" && (
                  <li className="text-green-700 font-medium">Confirm all work has been completed and tested</li>
                )}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Update Status
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
