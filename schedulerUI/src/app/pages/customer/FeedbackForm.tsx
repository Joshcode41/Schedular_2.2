import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Star, MessageSquare } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { toast } from "sonner";
import { getAppointmentById } from "../../lib/mockData";
import { useState } from "react";

const feedbackSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
});

type FeedbackForm = z.infer<typeof feedbackSchema>;

export function FeedbackForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const appointment = getAppointmentById(id || "");
  const [hoveredStar, setHoveredStar] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const rating = watch("rating");

  const onSubmit = (data: FeedbackForm) => {
    toast.success("Thank you for your feedback!");
    navigate("/customer/dashboard");
  };

  if (!appointment) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">Appointment not found</p>
            <Button asChild className="mt-4">
              <span onClick={() => navigate("/customer/dashboard")}>Back to Dashboard</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (appointment.status !== "completed") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">Feedback can only be submitted for completed appointments</p>
            <Button asChild className="mt-4">
              <span onClick={() => navigate("/customer/dashboard")}>Back to Dashboard</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl">Leave Feedback</h1>
          <p className="text-gray-600 mt-1">Share your experience with us</p>
        </div>
      </div>

      {/* Appointment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-600">Service Type</p>
              <p>{appointment.serviceType}</p>
            </div>
            <div>
              <p className="text-gray-600">Service Centre</p>
              <p>{appointment.serviceCentreName}</p>
            </div>
            <div>
              <p className="text-gray-600">Vehicle</p>
              <p>{appointment.carMake} {appointment.carModel}</p>
            </div>
            <div>
              <p className="text-gray-600">Technician</p>
              <p>{appointment.technicianName || "Not assigned"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Your Feedback
          </CardTitle>
          <CardDescription>Help us improve our service</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Star Rating */}
            <div className="space-y-2">
              <Label>Overall Rating</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setValue("rating", star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= (hoveredStar || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm text-gray-600">
                    {rating === 5 && "Excellent"}
                    {rating === 4 && "Good"}
                    {rating === 3 && "Average"}
                    {rating === 2 && "Poor"}
                    {rating === 1 && "Very Poor"}
                  </span>
                )}
              </div>
              {errors.rating && (
                <p className="text-sm text-red-600">{errors.rating.message}</p>
              )}
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label htmlFor="comment">Your Comments</Label>
              <Textarea
                id="comment"
                placeholder="Tell us about your experience... What did you like? What could be improved?"
                rows={6}
                {...register("comment")}
              />
              {errors.comment && (
                <p className="text-sm text-red-600">{errors.comment.message}</p>
              )}
            </div>

            {/* Tips for good feedback */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-sm text-blue-900">
                <strong>Tips for helpful feedback:</strong>
              </p>
              <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
                <li>Be specific about what you liked or disliked</li>
                <li>Mention the technician's professionalism and expertise</li>
                <li>Comment on the timeliness and quality of service</li>
                <li>Suggest areas for improvement</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Submit Feedback
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
