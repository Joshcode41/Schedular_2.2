import { useState } from "react";
import { Link } from "react-router";
import { Users, Mail, Phone, MapPin, Car, Calendar, Star, TrendingUp, Search, Plus, Eye } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { customers, leads, appointments } from "../../lib/mockData";
import { toast } from "sonner";

export function CustomerCRM() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery)
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      active: { label: "Active", className: "bg-green-100 text-green-800" },
      inactive: { label: "Inactive", className: "bg-gray-100 text-gray-800" },
      vip: { label: "VIP", className: "bg-purple-100 text-purple-800" },
    };
    const config = variants[status] || variants.active;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getLeadStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      new: { label: "New", className: "bg-blue-100 text-blue-800" },
      contacted: { label: "Contacted", className: "bg-yellow-100 text-yellow-800" },
      qualified: { label: "Qualified", className: "bg-green-100 text-green-800" },
      converted: { label: "Converted", className: "bg-purple-100 text-purple-800" },
      lost: { label: "Lost", className: "bg-red-100 text-red-800" },
    };
    const config = variants[status] || variants.new;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getSourceBadge = (source: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      website: { label: "Website", className: "bg-blue-100 text-blue-800" },
      phone: { label: "Phone", className: "bg-green-100 text-green-800" },
      referral: { label: "Referral", className: "bg-purple-100 text-purple-800" },
      "walk-in": { label: "Walk-in", className: "bg-orange-100 text-orange-800" },
      google: { label: "Google", className: "bg-red-100 text-red-800" },
    };
    const config = variants[source] || variants.website;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const CustomerDetailsDialog = ({ customer }: { customer: any }) => {
    const customerAppointments = appointments.filter((apt) => apt.customerId === customer.id);

    return (
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{customer.name}</span>
            {getStatusBadge(customer.status)}
          </DialogTitle>
          <DialogDescription>{customer.email}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Information */}
          <div>
            <h4 className="text-sm font-medium mb-3">Contact Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-start gap-2 sm:col-span-2">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                <span>{customer.address}</span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-blue-900">£{customer.totalSpent.toLocaleString()}</p>
              <p className="text-xs text-blue-700">Total Spent</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-900">{customer.visitCount}</p>
              <p className="text-xs text-green-700">Visits</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <p className="text-sm font-bold text-purple-900">{new Date(customer.lastVisit).toLocaleDateString()}</p>
              <p className="text-xs text-purple-700">Last Visit</p>
            </div>
          </div>

          {/* Vehicles */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Car className="w-4 h-4" />
              Vehicles ({customer.vehicles.length})
            </h4>
            <div className="space-y-2">
              {customer.vehicles.map((vehicle: any) => (
                <div key={vehicle.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{vehicle.make} {vehicle.model} ({vehicle.year})</p>
                      <p className="text-sm text-gray-600">{vehicle.registrationNumber}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-gray-600">Mileage</p>
                      <p className="font-medium">{vehicle.mileage.toLocaleString()} miles</p>
                    </div>
                    {vehicle.motDue && (
                      <div>
                        <p className="text-gray-600">MOT Due</p>
                        <p className="font-medium">{new Date(vehicle.motDue).toLocaleDateString()}</p>
                      </div>
                    )}
                    {vehicle.nextServiceDue && (
                      <div>
                        <p className="text-gray-600">Next Service</p>
                        <p className="font-medium">{new Date(vehicle.nextServiceDue).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Service History */}
          <div>
            <h4 className="text-sm font-medium mb-3">Service History ({customerAppointments.length})</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {customerAppointments.map((apt) => (
                <div key={apt.id} className="border rounded-lg p-3 text-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{apt.serviceType}</p>
                      <p className="text-gray-600 text-xs">{new Date(apt.preferredDate).toLocaleDateString()}</p>
                    </div>
                    <Badge className={apt.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                      {apt.status}
                    </Badge>
                  </div>
                  {apt.remarks && (
                    <p className="text-xs text-gray-600 mt-2">{apt.remarks}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {customer.notes && (
            <div>
              <h4 className="text-sm font-medium mb-2">Notes</h4>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                {customer.notes}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl">Customer CRM</h1>
          <p className="text-gray-600 mt-1">Manage customer relationships and leads</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Customers
            </CardDescription>
            <CardTitle className="text-3xl">{customers.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              {customers.filter((c) => c.status === "vip").length} VIP customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Active Leads
            </CardDescription>
            <CardTitle className="text-3xl">{leads.filter((l) => l.status !== "converted" && l.status !== "lost").length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{leads.filter((l) => l.status === "new").length} new this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              Total Vehicles
            </CardDescription>
            <CardTitle className="text-3xl">
              {customers.reduce((sum, c) => sum + c.vehicles.length, 0)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Tracked in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Lifetime Value
            </CardDescription>
            <CardTitle className="text-3xl">
              £{customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Total revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search customers, leads by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="customers">Customers ({filteredCustomers.length})</TabsTrigger>
          <TabsTrigger value="leads">Leads ({filteredLeads.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Customer Database</CardTitle>
              <CardDescription>All registered customers with service history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Vehicles</TableHead>
                      <TableHead className="text-center">Visits</TableHead>
                      <TableHead className="text-right">Spent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-gray-600">{customer.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{customer.phone}</TableCell>
                        <TableCell className="text-sm">{customer.vehicles.length}</TableCell>
                        <TableCell className="text-center">{customer.visitCount}</TableCell>
                        <TableCell className="text-right font-medium">£{customer.totalSpent.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(customer.status)}</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(customer)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            {selectedCustomer && <CustomerDetailsDialog customer={selectedCustomer} />}
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads">
          <Card>
            <CardHeader>
              <CardTitle>Lead Pipeline</CardTitle>
              <CardDescription>Track and convert potential customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Interest</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{lead.email}</p>
                            <p className="text-gray-600">{lead.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{lead.interest}</TableCell>
                        <TableCell>{getSourceBadge(lead.source)}</TableCell>
                        <TableCell>{getLeadStatusBadge(lead.status)}</TableCell>
                        <TableCell className="text-sm">{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toast.success("Lead converted to customer!")}
                          >
                            Convert
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
