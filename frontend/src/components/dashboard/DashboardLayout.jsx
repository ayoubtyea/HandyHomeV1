// layouts/dashboard/DashboardLayout.jsx (Alternative Version)
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FiHome, FiCalendar, FiUser, FiSettings, FiBell, FiHelpCircle, 
  FiLogOut, FiFileText, FiMenu, FiSearch, FiUsers, FiDollarSign, 
  FiStar, FiClock, FiTool, FiMapPin, FiMessageCircle 
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext"; // Fixed import path
import { Outlet } from "react-router-dom";

const DashboardLayout = ({ userAvatar = "", children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileMenuOpen) setIsProfileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Determine current role from URL or user object
  let currentRole = '';
  if (location.pathname.startsWith('/admin-dashboard')) {
    currentRole = 'admin';
  } else if (location.pathname.startsWith('/provider-dashboard')) {
    currentRole = 'provider';
  } else if (location.pathname.startsWith('/client-dashboard')) {
    currentRole = 'client';
  } else {
    currentRole = user?.role?.toLowerCase() || '';
  }

  // Navigation links based on user role
  const getNavLinks = () => {
    const baseLinks = [
      { name: 'Dashboard', icon: <FiHome className="w-5 h-5" />, path: `/${currentRole}-dashboard` },
      { name: 'Profile', icon: <FiUser className="w-5 h-5" />, path: `/${currentRole}-dashboard/profile` },
      { name: 'Messages', icon: <FiMessageCircle className="w-5 h-5" />, path: `/${currentRole}-dashboard/messages` },
    ];

    // Add role-specific links
    switch (currentRole) {
      case 'client':
        return [
          ...baseLinks,
          { name: 'My Bookings', icon: <FiCalendar className="w-5 h-5" />, path: '/client-dashboard/bookings' },
          { name: 'Reviews', icon: <FiStar className="w-5 h-5" />, path: '/client-dashboard/reviews' },
          { name: 'Payment History', icon: <FiDollarSign className="w-5 h-5" />, path: '/client-dashboard/payments' },
        ];
      case 'provider':
        return [
          ...baseLinks,
          { name: 'My Jobs', icon: <FiTool className="w-5 h-5" />, path: '/provider-dashboard/jobs' },
          { name: 'Schedule', icon: <FiClock className="w-5 h-5" />, path: '/provider-dashboard/schedule' },
          { name: 'Earnings', icon: <FiDollarSign className="w-5 h-5" />, path: '/provider-dashboard/earnings' },
          { name: 'Settings', icon: <FiSettings className="w-5 h-5" />, path: '/provider-dashboard/settings' },
        ];
      case 'admin':
        return [
          ...baseLinks,
          { name: 'Users', icon: <FiUsers className="w-5 h-5" />, path: '/admin-dashboard/users' },
          { name: 'Bookings', icon: <FiCalendar className="w-5 h-5" />, path: '/admin-dashboard/bookings' },
          { name: 'Reviews', icon: <FiStar className="w-5 h-5" />, path: '/admin-dashboard/reviews' },
          { name: 'Reports', icon: <FiFileText className="w-5 h-5" />, path: '/admin-dashboard/reports' },
          { name: 'Settings', icon: <FiSettings className="w-5 h-5" />, path: '/admin-dashboard/settings' },
        ];
      default:
        return baseLinks;
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`bg-white fixed inset-y-0 z-10 flex flex-col shadow transition-all duration-300 ${
          isSidebarOpen ? 'w-64 lg:w-64' : 'w-20 lg:w-20'
        } overflow-hidden`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <div className={`flex items-center ${isSidebarOpen ? '' : 'justify-center w-full'}`}>
            {isSidebarOpen ? (
              <Link to="/" className="text-xl font-bold text-[#076870]">
                HandyHome
              </Link>
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#076870] text-white flex items-center justify-center text-lg font-bold">
                H
              </div>
            )}
          </div>
          <button 
            onClick={toggleSidebar}
            className={`text-gray-500 hover:text-[#076870] ${isSidebarOpen ? '' : 'hidden'}`}
          >
            <FiMenu className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="px-2 space-y-1">
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === link.path
                      ? 'bg-[#076870] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex-shrink-0">{link.icon}</span>
                  {isSidebarOpen && <span className="ml-3">{link.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t p-4">
          <button
            onClick={handleLogout}
            className={`flex items-center text-red-500 hover:text-red-700 ${
              isSidebarOpen ? 'w-full justify-start' : 'justify-center'
            }`}
          >
            <FiLogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isSidebarOpen ? 'ml-64' : 'ml-20'
      }`}>
        {/* Header */}
        <header className="bg-white h-16 flex items-center justify-between px-4 border-b shadow-sm">
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-500 hover:text-[#076870]"
          >
            <FiMenu className="w-6 h-6" />
          </button>

          <div className="flex-1 mx-4">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#076870]"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="relative text-gray-600 hover:text-[#076870]"
              >
                <FiBell className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-10 border">
                  <div className="p-3 border-b">
                    <h3 className="font-medium">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="p-4 border-b hover:bg-gray-50">
                      <p className="text-sm font-medium">New booking request</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                    <div className="p-4 border-b hover:bg-gray-50">
                      <p className="text-sm font-medium">Payment received</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                  <div className="p-2 text-center">
                    <button className="text-sm text-[#076870] hover:underline">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={toggleProfileMenu}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser className="w-full h-full text-gray-700 p-1" />
                  )}
                </div>
                <span className="hidden md:block text-sm font-medium">
                  {user?.fullName || user?.name || 'User'}
                </span>
              </button>
              
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10 border">
                  <div className="p-3 border-b">
                    <p className="font-medium">{user?.fullName || user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.email || ''}</p>
                  </div>
                  <div>
                    <Link
                      to={`/${currentRole}-dashboard/profile`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      to={`/${currentRole}-dashboard/settings`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;