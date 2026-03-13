import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Users, UserCircle, Mail, Phone, Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { toast } from "sonner";
import { users, type UserRole } from "../../lib/mockData";

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone number required"),
  role: z.enum(["customer", "technician", "admin"]),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});

type UserForm = z.infer<typeof userSchema>;

export function UserManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
  });

  const selectedRole = watch("role");

  const onSubmit = (data: UserForm) => {
    if (editingUser) {
      toast.success("User updated successfully");
    } else {
      toast.success("User added successfully");
    }
    setIsDialogOpen(false);
    setEditingUser(null);
    reset();
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    reset({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (userId: string, userName: string) => {
    toast.success(`User ${userName} deleted successfully`);
  };

  const handleAddNew = () => {
    setEditingUser(null);
    reset({
      name: "",
      email: "",
      phone: "",
      role: "customer",
      password: "",
    });
    setIsDialogOpen(true);
  };

  const getRoleBadge = (role: UserRole) => {
    const variants: Record<UserRole, { label: string; className: string }> = {
      customer: { label: "Customer", className: "bg-blue-100 text-blue-800" },
      technician: { label: "Technician", className: "bg-purple-100 text-purple-800" },
      admin: { label: "Admin", className: "bg-red-100 text-red-800" },
    };
    const config = variants[role];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const customerUsers = filteredUsers.filter(u => u.role === "customer");
  const technicianUsers = filteredUsers.filter(u => u.role === "technician");
  const adminUsers = filteredUsers.filter(u => u.role === "admin");

  const UserTable = ({ users }: { users: typeof filteredUsers }) => (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700" 
                      onClick={() => handleDelete(user.id, user.name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl">User Management</h1>
          <p className="text-gray-600 mt-1">Manage system users and roles</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Edit User" : "Add New User"}
              </DialogTitle>
              <DialogDescription>
                {editingUser 
                  ? "Update the user details below" 
                  : "Enter the details for the new user"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+254 712 345 678"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={selectedRole}
                  onValueChange={(value) => setValue("role", value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="technician">Technician</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>

              {!editingUser && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingUser ? "Update" : "Add"} User
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
            <CardDescription className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Users
            </CardDescription>
            <CardTitle className="text-3xl">{users.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Customers</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{customerUsers.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Technicians</CardDescription>
            <CardTitle className="text-3xl text-purple-600">{technicianUsers.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All Users ({filteredUsers.length})
          </TabsTrigger>
          <TabsTrigger value="customers">
            Customers ({customerUsers.length})
          </TabsTrigger>
          <TabsTrigger value="technicians">
            Technicians ({technicianUsers.length})
          </TabsTrigger>
          <TabsTrigger value="admins">
            Admins ({adminUsers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <UserTable users={filteredUsers} />
        </TabsContent>

        <TabsContent value="customers">
          <UserTable users={customerUsers} />
        </TabsContent>

        <TabsContent value="technicians">
          <UserTable users={technicianUsers} />
        </TabsContent>

        <TabsContent value="admins">
          <UserTable users={adminUsers} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
