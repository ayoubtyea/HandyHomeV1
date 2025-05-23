import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import ServicesPage from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import BecomeTasker from './pages/BecomeTasker';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './index.css';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import TaskerDetailsPage from './pages/TaskerDetailsPage';
import NotFound from './pages/NotFound';
import { useAuth } from './contexts/AuthContext'; 
import ProtectedRoute from './components/ProtectedRoute';
import BookingPage from './pages/BookingPage';

// Dashboard Layout
import DashboardLayout from './layouts/dashboard/DashboardLayout';

// Admin Dashboard
import AdminDashboard from './pages/dashboard/admin/AdminDashboard';
import Bookings from './pages/dashboard/admin/Bookings';
import Reviews from './pages/dashboard/admin/Reviews';

// Client Dashboard
import ClientDashboard from './pages/dashboard/client/ClientDashboard';
import ClientBookings from './pages/dashboard/client/ClientBookings';
import ClientProfile from './pages/dashboard/client/ClientProfile';
import ClientReviews from './pages/dashboard/client/ClientReviews';

// Provider Dashboard
import ProviderDashboard from './pages/dashboard/provider/ProviderDashboard';
import ProviderProfile from './pages/dashboard/provider/ProviderProfile';
import ProviderSettings from './pages/dashboard/provider/ProviderSettings';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  
  // Check if the current path is a dashboard path
  const isDashboardPath = 
    location.pathname.startsWith('/admin-dashboard') || 
    location.pathname.startsWith('/provider-dashboard') || 
    location.pathname.startsWith('/client-dashboard');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Only show Navbar on non-auth pages and non-dashboard pages */}
      {!isAuthPage && !isDashboardPath && <Navbar />}
      
      <main className={`flex-grow ${isDashboardPath ? 'bg-gray-100' : ''}`}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/service-details/:id" element={<ServiceDetailsPage />} />
          <Route path="/taskers/:id" element={<TaskerDetailsPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/become-tasker" element={<BecomeTasker />} />
          
          {/* Admin Dashboard Routes */}
          <Route path="/admin-dashboard" element={
            <ProtectedRoute requiredRole="admin">
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin-dashboard/bookings" element={
            <ProtectedRoute requiredRole="admin">
              <DashboardLayout>
                <Bookings />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin-dashboard/reviews" element={
            <ProtectedRoute requiredRole="admin">
              <DashboardLayout>
                <Reviews />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* Client Dashboard Routes */}
          <Route path="/client-dashboard" element={
            <ProtectedRoute requiredRole="client">
              <DashboardLayout>
                <ClientDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/client-dashboard/bookings" element={
            <ProtectedRoute requiredRole="client">
              <DashboardLayout>
                <ClientBookings />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/client-dashboard/profile" element={
            <ProtectedRoute requiredRole="client">
              <DashboardLayout>
                <ClientProfile />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/client-dashboard/reviews" element={
            <ProtectedRoute requiredRole="client">
              <DashboardLayout>
                <ClientReviews />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* Provider Dashboard Routes */}
          <Route path="/provider-dashboard" element={
            <ProtectedRoute requiredRole="provider">
              <DashboardLayout>
                <ProviderDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/provider-dashboard/profile" element={
            <ProtectedRoute requiredRole="provider">
              <DashboardLayout>
                <ProviderProfile />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/provider-dashboard/settings" element={
            <ProtectedRoute requiredRole="provider">
              <DashboardLayout>
                <ProviderSettings />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* Protected booking route */}
          <Route path="/book/:id" element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          } />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      {/* Only show Footer on non-auth pages and non-dashboard pages */}
      {!isAuthPage && !isDashboardPath && <Footer />}
    </div>
  );
}

export default App;