# Scheduler UI - Testing Documentation

## 📋 Table of Contents
1. [Testing Strategy](#testing-strategy)
2. [Manual Testing Guide](#manual-testing-guide)
3. [Test Scenarios](#test-scenarios)
4. [Browser Testing](#browser-testing)
5. [Accessibility Testing](#accessibility-testing)
6. [Performance Testing](#performance-testing)
7. [Automated Testing Setup](#automated-testing-setup)
8. [Known Issues](#known-issues)

---

## 🎯 Testing Strategy

### Current Status: Manual Testing

**Testing Pyramid:**
```
         /\
        /  \     E2E Tests (Not Started)
       /    \
      /      \   Component Tests (Not Started)
     /--------\  
    /          \ Unit Tests (Not Started)
   /            \
  /------------------\ Manual Testing (In Progress)
```

### Test Coverage
- **Current Coverage:** Manual Testing Only
- **Target Coverage:** 80%+ automated
- **Priority Order:**
  1. Authentication flows (High Risk)
  2. Form submissions (High Risk)
  3. Navigation (Medium Risk)
  4. Theme switching (Low Risk)

---

## 🧪 Manual Testing Guide

### 1. Browser-Based Testing

#### Test Environment Setup
```bash
# Terminal 1 - Start Backend
cd schedulerAPI
pnpm dev

# Terminal 2 - Start Frontend
cd schedulerUI
pnpm dev

# Open Browser
# Navigate to: http://localhost:5173
```

### 2. Feature Testing Checklist

#### Authentication Tests ✅

**Test Case 1: Login Page Loads**
- [ ] Navigate to http://localhost:5173
- [ ] LoginPage should display
- [ ] Form fields visible
- [ ] Password field has eye icon toggle
- [ ] Dark mode works

**Expected Result:** Login form displays with all elements

**Test Case 2: Password Visibility Toggle** ⭐ NEW
```
Steps:
1. Open LoginPage
2. Click in password field
3. Type "123456"
4. Click eye icon
5. Password should be visible as text
6. Click eye icon again
7. Password should be hidden (dots)

Expected: Toggle works smoothly
```

**Test Case 3: Successful Login** ✅
```
Steps:
1. Select role: "Customer"
2. Enter email: "any@email.com"
3. Enter password: "any-password"
4. Click "Sign In"

Expected:
- Toast: "Welcome back"
- Redirect to /customer/dashboard
- User name visible in header
```

**Test Case 4: Role Switching**
```
Steps:
1. Login as Customer
2. Open user dropdown (top right)
3. Select "Switch to Technician"
4. Should redirect to /technician/dashboard

Expected: Role switch successful, layout changes
```

#### Theme Switching Tests ⭐ NEW

**Test Case 5: Theme Switcher Shows**
```
Steps:
1. Login to app
2. Look at top right corner
3. Theme button should be visible (next to user dropdown)

Expected: Theme switcher button present
```

**Test Case 6: Dark Mode Toggle**
```
Steps:
1. Click Theme button
2. Select "Dark"
3. Page background should turn dark
4. Text should be light

Expected: Dark mode applied globally
```

**Test Case 7: Color Theme Selection**
```
Steps:
1. Click Theme button
2. Select different colors (Blue → Purple → Green, etc.)
3. Button and accent colors should change

Expected: All color themes work properly
```

**Test Case 8: Theme Persistence**
```
Steps:
1. Select Dark mode and Purple theme
2. Refresh page (F5)
3. Theme should remain Dark + Purple

Expected: Theme saved to localStorage
```

#### Form Testing Tests

**Test Case 9: Register Page** ✅
```
Steps:
1. Click "Sign up" on LoginPage
2. Enter all fields
3. Enter password "123456"
4. Enter confirm password "123456"
5. Click "Create Account"

Fields to Test:
- Name (min 2 chars)
- Email (valid format)
- Phone (min 10 digits)
- Password (min 6 chars)
- Confirm Password (must match)

Expected: Form validates and shows errors for invalid input
```

**Test Case 10: Password Match Validation**
```
Steps:
1. On RegisterPage
2. Enter password: "Password123"
3. Enter different confirm password: "Password456"
4. Click "Create Account"

Expected: Error message "Passwords don't match"
```

#### Navigation Tests

**Test Case 11: Customer Navigation** ✅
```
After login as Customer, navigation should show:
- Dashboard
- Book Appointment

Each link should navigate correctly
```

**Test Case 12: Admin Navigation** ✅
```
After login as Admin, navigation should show:
- Dashboard
- Calendar
- CRM
- Service Centres
- Technician Assignment
- Users
- Reports

Each link should navigate correctly
```

#### Responsive Design Tests

**Test Case 13: Mobile View (320px)**
```
Steps:
1. Open DevTools (F12)
2. Set Device: iPhone SE (375px)
3. Check navigation is accessible
4. Check forms are readable
5. Check buttons are clickable

Expected: Mobile layout works properly
```

**Test Case 14: Tablet View (768px)**
```
Steps:
1. Set Device: iPad (768px)
2. Check layout reflows correctly
3. Check all content visible

Expected: Tablet layout works properly
```

**Test Case 15: Desktop View (1920px)**
```
Steps:
1. Maximize browser window
2. Check columns and spacing
3. Check no horizontal scroll

Expected: Desktop layout optimal
```

#### API Integration Tests

**Test Case 16: API Connection** (When API Integration Completed)
```
Steps:
1. Start both servers
2. Open LoginPage
3. Enter credentials
4. Click Sign In

Expected:
- Request sent to http://localhost:3001/api/auth/login
- Response received with token
- User logged in
```

**Test Case 17: Appointment Booking** (When API Integration Completed)
```
Steps:
1. Login as Customer
2. Click "Book Appointment"
3. Fill form
4. Click "Submit"

Expected:
- Form submitted to /api/appointments
- Toast: "Appointment created"
- Redirect to dashboard
```

---

## 📝 Test Scenarios

### Scenario 1: Complete User Journey - Customer

```
Day 1 Activities:
1. Register new account
2. Login to system
3. View dashboard
4. Browse services
5. Book appointment
6. View appointment details
7. Provide feedback
8. Logout

Expected Outcome: All steps successful
```

### Scenario 2: Complete User Journey - Admin

```
Day 1 Activities:
1. Login as admin
2. View dashboard (analytics)
3. Create new user
4. Assign technician
5. View calendar
6. View reports
7. Manage service centres
8. Logout

Expected Outcome: All steps successful
```

### Scenario 3: Error Scenarios

```
Error Cases to Test:
1. Login with non-existent user
2. Register with duplicate email
3. Submit form with missing fields
4. Network error during submission
5. Invalid email format
6. Password too short
7. Token expiration (simulate)

Expected: Appropriate error messages shown
```

---

## 🌐 Browser Testing

### Supported Browsers

**Desktop:**
- [ ] Chrome 120+
- [ ] Firefox 121+
- [ ] Safari 17+
- [ ] Edge 120+

**Mobile:**
- [ ] iOS Safari 17+
- [ ] Android Chrome 120+
- [ ] Samsung Internet 20+

### Cross-Browser Testing Checklist

For each browser test:
- [ ] Page loads without errors
- [ ] Styles render correctly
- [ ] Forms work properly
- [ ] Theme switching works
- [ ] Dark mode works
- [ ] All interactions functional

### Testing Tools

```bash
# BrowserStack (online)
https://www.browserstack.com

# Local Testing
- Chrome DevTools
- Firefox Developer Edition
- Safari Developer Tools
- Edge DevTools
```

---

## ♿ Accessibility Testing

### Manual Accessibility Tests

**Test 1: Keyboard Navigation**
```
Steps:
1. Don't use mouse
2. Use Tab key to navigate
3. Use Shift+Tab to go back
4. Use Enter to click buttons
5. Use Space for checkboxes

Expected: All interactive elements accessible
```

**Test 2: Screen Reader (macOS)**
```bash
# Enable VoiceOver
Cmd + F5

# Navigate and listen to descriptions
# Check if all elements have proper labels
```

**Test 3: Color Contrast**
```
Using: WebAIM Contrast Checker

Check:
- Text vs background
- Button vs background
- All text colors meet WCAG AA standard (4.5:1 ratio)

Expected: All text readable
```

**Test 4: Focus Indicators**
```
Steps:
1. Use Tab key to navigate
2. Each element should have visible focus state
3. Focus should not be lost

Expected: Clear focus indicators visible
```

---

## ⚡ Performance Testing

### Load Testing

**Lighthouse Score Check**
```bash
# Open DevTools (F12)
# Go to Lighthouse tab
# Click "Analyze"
# Check:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90
```

**Expected Results:**
```
Current Status: ⏳ To be measured

Target Scores:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+
```

### Bundle Size Analysis

```bash
# Check build size
pnpm build

# Expected:
# dist/index.html          ~5KB
# dist/index.js           ~300KB (gzipped)
# dist/index.css          ~50KB (gzipped)
# Total:                  ~350KB
```

---

## 🤖 Automated Testing Setup

### Phase 1: Setup (Not Started)

```bash
# Install testing dependencies
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom

# Create test structure
mkdir -p src/__tests__/{unit,integration}

# Create test configuration
# vitest.config.ts
# setup.ts
```

### Phase 2: Unit Tests (Not Started)

```typescript
// src/__tests__/unit/PasswordInput.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasswordInput } from '@/app/components/ui/password-input';

describe('PasswordInput Component', () => {
  test('toggles password visibility', async () => {
    const { container } = render(
      <PasswordInput label="Password" />
    );
    
    const input = container.querySelector('input');
    const toggleButton = screen.getByLabelText(/show password/i);
    
    // Initially hidden
    expect(input).toHaveAttribute('type', 'password');
    
    // Click toggle
    await userEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');
    
    // Click again
    await userEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
  });
});
```

### Phase 3: Integration Tests (Not Started)

```typescript
// src/__tests__/integration/LoginPage.test.tsx
describe('LoginPage Integration', () => {
  test('complete login flow', async () => {
    // Render component
    // Fill form
    // Submit
    // Check redirect
    // Verify API call
  });
});
```

### Phase 4: E2E Tests (Not Started)

```bash
# Install Playwright
pnpm add -D @playwright/test

# Create E2E tests
mkdir -p e2e

# Example E2E test (e2e/login.spec.ts)
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.fill('[placeholder="your@email.com"]', 'test@example.com');
  await page.fill('[type="password"]', 'password123');
  await page.click('button:has-text("Sign In")');
  await expect(page).toHaveURL('**/customer/dashboard');
});
```

### Running Tests

```bash
# Unit tests
pnpm test

# E2E tests
pnpm exec playwright test

# With coverage
pnpm test -- --coverage

# Watch mode
pnpm test -- --watch
```

---

## 🐛 Known Issues

### Issue 1: Password Toggle Not Visible
**Severity:** Medium  
**Status:** Fixed ✅  
**Description:** Eye icon not showing in password input  
**Solution:** Implemented PasswordInput component with proper styling

### Issue 2: Dark Mode Not Persisting
**Severity:** Low  
**Status:** Fixed ✅  
**Description:** Theme resets on page refresh  
**Solution:** Added localStorage persistence in ThemeContext

### Issue 3: Forms Not Connected to Backend
**Severity:** High  
**Status:** Not Fixed ❌  
**Description:** Login/Register forms don't call API  
**Impact:** Cannot persist user data  
**Solution:** Connect to schedulerAPI endpoints

```typescript
// TODO: Update LoginPage.tsx
// Current: Mock authentication
// Required: 
// const { user, token } = await authApi.login(email, password, role);
// setCurrentUser(user);
// apiClient.setToken(token);
```

### Issue 4: No Protected Routes
**Severity:** High  
**Status:** Not Fixed ❌  
**Description:** Users can access admin pages without authentication  
**Impact:** Security vulnerability  
**Solution:** Create ProtectedRoute component

```typescript
// TODO: Create app/components/ProtectedRoute.tsx
function ProtectedRoute({ children, requiredRole }) {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
}
```

### Issue 5: API Calls Return Mock Data
**Severity:** High  
**Status:** Partial ❌  
**Description:** API service exists but not integrated  
**Solution:** Update all pages to use API endpoints

---

## 📊 Test Coverage Roadmap

### Current Status
```
Unit Tests:        0% (0/40 tests)
Integration Tests: 0% (0/20 tests)
E2E Tests:         0% (0/15 tests)
Manual Tests:      30% (9/30 scenarios)
```

### Target (4 Weeks)
```
Unit Tests:        100% (40/40 tests)
Integration Tests: 80% (16/20 tests)
E2E Tests:         70% (10/15 tests)
Manual Tests:      100% (30/30 scenarios)
Overall Coverage:  85%
```

---

## 🚀 Testing Roadmap

### Week 1: Manual Testing
- [ ] Complete all manual test cases
- [ ] Document findings
- [ ] Create bug report list

### Week 2: Setup Automation
- [ ] Install testing libraries
- [ ] Configure Jest/Vitest
- [ ] Create test structure
- [ ] Write first unit tests

### Week 3: Unit & Integration Tests
- [ ] Write component tests
- [ ] Write page tests
- [ ] Achieve 60% coverage
- [ ] Fix failing tests

### Week 4: E2E & Performance
- [ ] Set up E2E framework
- [ ] Write critical user journeys
- [ ] Performance testing
- [ ] Optimize for speed

---

## 📞 Debugging Checklist

### When Feature Doesn't Work

- [ ] Check browser console for errors
- [ ] Check Network tab for API calls
- [ ] Verify environment variables
- [ ] Check component props
- [ ] Verify component state (React DevTools)
- [ ] Check CSS classes applied
- [ ] Test in another browser
- [ ] Clear cache and reload

### Common Issues & Fixes

```
Issue: Password toggle doesn't work
Solution: Check PasswordInput component is imported

Issue: Dark mode not applying
Solution: Check ThemeProvider wrapping App

Issue: API calls failing
Solution: Verify backend is running on 3001

Issue: Form not submitting
Solution: Check form validation passes
```

---

**Last Updated:** March 10, 2026  
**Test Status:** 🟡 MANUAL TESTING IN PROGRESS  
**Automated Tests:** 🔴 NOT STARTED  
**Priority:** HIGH - Needed before production
