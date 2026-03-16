# Phase 2 Implementation Guide — Wire Frontend to API

**Status:** Ready to implement  
**Timeline:** 8-10 hours  
**Total Pages:** 13

---

## ✅ Completed (Phase 1)

- ✅ Service Centres route has PUT/DELETE endpoints
- ✅ All auth route tests passing (17 tests)
- ✅ DB pool mocking in place for route tests
- ✅ `useData.ts` hooks with mutation functions added

---

## 📋 Pages to Wire (in priority order)

### **TIER 1: Customer Pages (4 pages) — 3-4 hours**

These are user-facing and fundamental to the app working.

#### **1. CustomerDashboard.tsx** 
**Current:** Imports from `mockData.ts`  
**Action:**
```typescript
// Remove:
import { currentUser, getAppointmentsByCustomer } from "../../lib/mockData";

// Add:
import { useAppointments } from "../../app/hooks/useData";
import { useAuth } from "../../app/context/AuthContext";

export function CustomerDashboard() {
  const { user } = useAuth();
  const { appointments, loading, error } = useAppointments();
  
  if (loading) return <PageSkeleton />;
  if (error) return <ErrorBanner message={error} />;
  
  const upcomingAppointments = appointments.filter(a => 
    ['pending', 'confirmed', 'in_progress'].includes(a.status) &&
    a.customer_id === user?.id
  );
```

---

#### **2. BookAppointment.tsx**
**Current:** Form exists, no submission  
**Action:**
```typescript
import { useAppointmentMutations } from "../../app/hooks/useData";
import { useServiceCentres } from "../../app/hooks/useData";
import { useAuth } from "../../app/context/AuthContext";

export function BookAppointment() {
  const { user } = useAuth();
  const { createAppointment, loading: submitting, error } = useAppointmentMutations();
  const { centres, loading: centresLoading } = useServiceCentres();

  const onSubmit = async (data: BookingFormData) => {
    try {
      await createAppointment({
        customer_id: user!.id,
        service_centre_id: data.serviceCentreId,
        appointment_date: data.date,
        appointment_time: data.time,
        service_type: data.serviceType,
        description: data.description,
        vehicle_make: data.vehicleMake,
        vehicle_model: data.vehicleModel,
        vehicle_year: data.vehicleYear,
        registration_number: data.registrationNumber,
      });
      toast.success('Appointment booked!');
      navigate('/customer/appointments');
    } catch (err: any) {
      toast.error(err.message);
    }
  };
```

---

#### **3. AppointmentDetails.tsx**
**Current:** Shows mock data  
**Action:**
```typescript
import { useAppointment, useAppointmentMutations } from "../../app/hooks/useData";

const { id } = useParams();
const { appointment, loading, error } = useAppointment(id!);
const { cancelAppointment } = useAppointmentMutations();

const handleCancel = async () => {
  if (confirm('Cancel this appointment?')) {
    await cancelAppointment(id!);
    navigate('/customer/appointments');
  }
};
```

---

#### **4. FeedbackForm.tsx**
**Current:** No form submission  
**Action:**
```typescript
// Add to hooks/useData.ts first:
export function useFeedbackMutations() {
  const { token } = useAuth();
  const submitFeedback = async (appointmentId: string, data: any) => {
    const response = await fetch(`http://localhost:3001/api/appointments/${appointmentId}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to submit feedback');
    return response.json().then(r => r.data);
  };
  return { submitFeedback };
}

// Then in FeedbackForm.tsx:
const { appointmentId } = useParams();
const { submitFeedback, loading } = useFeedbackMutations();
const onSubmit = async (data: any) => {
  await submitFeedback(appointmentId!, data);
  toast.success('Thank you for your feedback!');
};
```

---

### **TIER 2: Technician Pages (2 pages) — 1.5-2 hours**

#### **5. TechnicianDashboard.tsx**
```typescript
import { useAppointments } from "../../app/hooks/useData";
import { useAuth } from "../../app/context/AuthContext";

const { user } = useAuth();
const { appointments, loading } = useAppointments();

// Filter for technician's appointments
const myAppointments = appointments.filter(a => a.technician_id === user?.id);
```

---

#### **6. UpdateStatus.tsx**
```typescript
const { appointmentId } = useParams();
const { updateAppointment, loading } = useAppointmentMutations();

const onSubmit = async (data: any) => {
  await updateAppointment(appointmentId!, {
    status: data.status,
    notes: data.notes,
  });
  toast.success('Appointment updated');
};
```

---

### **TIER 3: Admin Pages (7 pages) — 3-5 hours**

These are complex with tables, filters, and CRUD operations.

#### **7. UserManagement.tsx**
```typescript
const { users, loading } = useUsers();
const { createUser, updateUser, deleteUser } = useUserMutations();
const [editingId, setEditingId] = useState<string | null>(null);

// Render table with users
// Add edit/delete buttons that call mutations
// Add modal for creating new users

const handleDelete = async (id: string) => {
  if (confirm('Delete user?')) {
    await deleteUser(id);
    // Refetch users (add refetch to useUsers hook)
  }
};
```

---

#### **8. ServiceCentreManagement.tsx**
```typescript
const { centres, loading } = useServiceCentres();
const { createServiceCentre, updateServiceCentre, deleteServiceCentre } = useServiceCentreMutations();

// Table with centres
// Edit/delete buttons linked to mutations
```

---

#### **9. TechnicianAssignment.tsx**
```typescript
import { useAppointments, useTechnicians } from "../../app/hooks/useData";
import { useAppointmentMutations } from "../../app/hooks/useData";

const { appointments, loading: aptsLoading } = useAppointments();
const { technicians, loading: techsLoading } = useTechnicians();
const { updateAppointment } = useAppointmentMutations();

// Show pending appointments
// Dropdown to select technician
// Update button calls updateAppointment with technician_id
```

---

#### **10. AdminDashboard.tsx**
```typescript
const { users, loading: usersLoading } = useUsers();
const { appointments, loading: aptsLoading } = useAppointments();

// Calculate stats from real data
const totalUsers = users.length;
const totalAppointments = appointments.length;
const completedAppointments = appointments.filter(a => a.status === 'completed').length;
```

---

#### **11. ReportsAnalytics.tsx**
```typescript
const { appointments, loading } = useAppointments();

// Filter by date range from form
// Feed real appointment data to Recharts components
const completionRate = (
  appointments.filter(a => a.status === 'completed').length / appointments.length
) * 100;
```

---

#### **12. CustomerCRM.tsx**
```typescript
const { users, loading } = useUsers();

// Filter customers only
const customers = users.filter(u => u.role === 'customer');

// Show customer list with appointment history
```

---

#### **13. CalendarManagement.tsx**
```typescript
const { appointments, loading } = useAppointments();

// Map appointments to calendar events
// Show appointments by date
```

---

## 🎯 Implementation Pattern

All pages follow this structure:

```typescript
import { useAuth } from "../context/AuthContext";
import { useAppointments, useAppointmentMutations } from "../hooks/useData";

export function MyPage() {
  // 1. Get auth context
  const { user, token } = useAuth();
  
  // 2. Get data
  const { appointments, loading, error } = useAppointments();
  
  // 3. Get mutations
  const { createAppointment, updateAppointment } = useAppointmentMutations();
  
  // 4. Show loading state
  if (loading) return <PageSkeleton />;
  
  // 5. Show error state
  if (error) return <ErrorBanner message={error} onRetry={() => location.reload()} />;
  
  // 6. Show empty state
  if (!appointments.length) return <EmptyState message="No appointments" />;
  
  // 7. Render with real data
  return (
    <div>
      {appointments.map(apt => (
        <Card key={apt.id}>
          <h2>{apt.service_type}</h2>
          <p>{apt.appointment_date}</p>
          <Button onClick={() => updateAppointment(apt.id, { status: 'confirmed' })}>
            Confirm
          </Button>
        </Card>
      ))}
    </div>
  );
}
```

---

## 🔧 Helper Components Needed

Create if not already exist:

```typescript
// src/app/components/PageSkeleton.tsx
export function PageSkeleton() {
  return <div className="space-y-3">
    {[...Array(5)].map((_, i) => (
      <Skeleton key={i} className="h-20 w-full" />
    ))}
  </div>;
}

// src/app/components/ErrorBanner.tsx
export function ErrorBanner({ message, onRetry }: any) {
  return <Alert variant="destructive">
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
    <Button onClick={onRetry} className="mt-2">Retry</Button>
  </Alert>;
}

// src/app/components/EmptyState.tsx
export function EmptyState({ message }: any) {
  return <Card>
    <CardContent className="text-center py-8">
      <p className="text-gray-500">{message}</p>
    </CardContent>
  </Card>;
}
```

---

## 🚀 Refetching Data After Mutations

The current hooks don't automatically refetch. You have two options:

**Option A: Manual refetch**
```typescript
const [trigger, setTrigger] = useState({});
const { appointments } = useAppointments();

const createApt = async (data: any) => {
  await createAppointment(data);
  setTrigger({}); // Trigger refetch by changing dependency
};
```

**Option B: React Query (recommended for future)**
```bash
pnpm add @tanstack/react-query
```

For now, manual refetch is acceptable.

---

## ✅ Testing the Wiring

1. Start backend: `cd schedulerAPI && pnpm dev`
2. Start frontend: `cd schedulerUI && pnpm dev`
3. Login with demo credentials
4. Navigate to each page
5. Verify data loads (no more mock data)
6. Try create/update/delete operations
7. Check network tab for API calls

---

## 📊 Completion Checklist

- [ ] Tier 1 (4 customer pages) complete
- [ ] Tier 2 (2 technician pages) complete
- [ ] Tier 3 (7 admin pages) complete
- [ ] All pages show loading/error/empty states
- [ ] All forms submit to real API
- [ ] Data refetches after mutations
- [ ] No console errors
- [ ] All API calls include Authorization header

---

## 🎯 Next Steps After Phase 2

1. **Phase 3:** Fix XSS (localStorage → httpOnly cookies) — 2-3 hours
2. **Phase 4:** Frontend testing setup — 4-6 hours
3. **Phase 5:** Email notifications — 3-4 hours
4. **Production:** Deploy to Railway/Vercel

---

**Estimated total Phase 2 time:** 8-10 hours  
**Developer can parallelize:** Yes, each page is independent
