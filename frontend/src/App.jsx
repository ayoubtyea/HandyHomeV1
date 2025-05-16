import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import BookingPage from './pages/BookingPage';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        {!isAuthPage && <Navbar />}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/service-details/:id" element={<ServiceDetailsPage />} />
            <Route path="/taskers/:id" element={<TaskerDetailsPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/become-tasker" element={<BecomeTasker />} />
            
            {/* Protected routes */}
            <Route 
              path="/book/:id" 
              element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {!isAuthPage && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;