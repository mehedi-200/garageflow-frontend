import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Users from './pages/Users'
import Roles from './pages/Roles'
import RequirePermission from './components/layout/RequirePermission'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import CustomerDetail from './pages/CustomerDetail'
import Vehicles from './pages/Vehicles'
import VehicleDetail from './pages/VehicleDetail'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import Invoices from './pages/Invoices'
import InvoiceDetail from './pages/InvoiceDetail'
import Profile from './pages/Profile'
import More from './pages/More'
import SearchPage from './pages/SearchPage'
import Notifications from './pages/Notifications'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route element={<RequirePermission permission="customers" />}>
            <Route path="customers" element={<Customers />} />
            <Route path="customers/:id" element={<CustomerDetail />} />
          </Route>
          <Route element={<RequirePermission permission="vehicles" />}>
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="vehicles/:id" element={<VehicleDetail />} />
          </Route>
          <Route element={<RequirePermission permission="service_jobs" />}>
            <Route path="jobs" element={<Jobs />} />
            <Route path="jobs/:id" element={<JobDetail />} />
          </Route>
          <Route element={<RequirePermission permission="invoices" />}>
            <Route path="invoices" element={<Invoices />} />
            <Route path="invoices/:id" element={<InvoiceDetail />} />
          </Route>
          <Route path="profile" element={<Profile />} />
          <Route element={<RequirePermission permission="users" />}>
            <Route path="users" element={<Users />} />
          </Route>
          <Route element={<RequirePermission permission="roles" />}>
            <Route path="roles" element={<Roles />} />
          </Route>
          <Route path="more" element={<More />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  )
}
