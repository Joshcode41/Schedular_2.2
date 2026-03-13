import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router";
import { Settings } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { PasswordInput } from "../components/ui/password-input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerAuth, isLoading } = useAuth();
  const {
    register: formRegister,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      console.log("Submitting form data:", data); // Debug log
      await registerAuth(data.name, data.email, data.password, data.phone, "customer");
      toast.success("Account created successfully! Redirecting to dashboard...");
      navigate("/customer/dashboard");
    } catch (error) {
      console.error("Registration error:", error); // Debug log
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-purple-600 dark:bg-purple-500 rounded-full flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl dark:text-white">Create Account</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Register as a new customer
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="dark:text-gray-300">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...formRegister("name")}
                className={errors.name ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...formRegister("email")}
                className={errors.email ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="dark:text-gray-300">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+254 712 345 678"
                {...formRegister("phone")}
                className={errors.phone ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.phone && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.phone.message}</p>
              )}
            </div>

            {/* Password Field - Using Controller */}
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" }
              }}
              render={({ field }) => (
                <PasswordInput
                  id="password"
                  label="Password"
                  placeholder="••••••••"
                  value={field.value || ""}
                  onChange={field.onChange}
                  error={errors.password?.message}
                  disabled={isLoading}
                />
              )}
            />

            {/* Confirm Password Field - Using Controller */}
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Please confirm your password"
              }}
              render={({ field }) => (
                <PasswordInput
                  id="confirmPassword"
                  label="Confirm Password"
                  placeholder="••••••••"
                  value={field.value || ""}
                  onChange={field.onChange}
                  error={errors.confirmPassword?.message}
                  disabled={isLoading}
                />
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-600 dark:text-purple-400 hover:underline font-semibold">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
