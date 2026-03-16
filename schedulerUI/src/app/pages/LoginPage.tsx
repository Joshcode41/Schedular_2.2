import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router";
import { Settings, Chrome } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { PasswordInput } from "../components/ui/password-input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { DarkModeToggle } from "../components/DarkModeToggle";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["customer", "technician", "admin"]),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const {
    register: formRegister,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      role: "customer",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      console.log("Submitting login data:", data); // Debug log
      await login(data.email, data.password, data.role);
      navigate(`/${data.role}/dashboard`);
    } catch (error) {
      console.error("Login error:", error); // Debug log
      toast.error("Login failed");
    }
  };

  const handleGoogleLogin = () => {
    toast.error("Google login not yet implemented");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <DarkModeToggle size="md" variant="outline" />
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Settings className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AutoService Pro</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Service Scheduling System</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role">Login As</Label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="technician">Technician</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...formRegister("email")}
                  className={errors.email ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>

              {/* Password Input - Using Controller for proper registration */}
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
                    placeholder="Enter your password"
                    value={field.value || ""}
                    onChange={field.onChange}
                    error={errors.password?.message}
                    disabled={isLoading}
                  />
                )}
              />

              {/* Demo Credentials Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                <p className="font-semibold mb-2">Demo Credentials:</p>
                <p>Use any email and password to login</p>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <Separator className="my-4" />

            {/* Google Login */}
            <Button
              type="button"
              variant="outline"
              className="w-full mb-4"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <Chrome className="w-4 h-4 mr-2" />
              Sign in with Google
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
          This is a demo application. Use the test credentials to explore all features.
        </p>
      </div>
    </div>
  );
}