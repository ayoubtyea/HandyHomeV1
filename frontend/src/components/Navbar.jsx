import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    userRole: null,
    userData: null
  });
  const navigate = useNavigate();

  const checkAuth = () => {
    try {
      const token = localStorage.getItem("authToken");
      const userData = JSON.parse(localStorage.getItem("userData") || "null");
      
      setAuthState({
        isAuthenticated: !!token,
        userRole: userData?.role || null,
        userData: userData
      });
    } catch (error) {
      console.error("Error checking auth:", error);
      setAuthState({
        isAuthenticated: false, 
        userRole: null, 
        userData: null 
      });
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener('storage', checkAuth);  
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setAuthState({ 
      isAuthenticated: false, 
      userRole: null, 
      userData: null 
    });
    navigate("/");
    setIsOpen(false); // Close mobile menu on logout
  };

  // Handle dashboard navigation based on role
  const handleDashboardClick = () => {
    if (!authState.userRole) {
      navigate('/');  // If no user role, redirect to the homepage
      return;
    }

    const role = authState.userRole.toLowerCase();
    switch (role) {
      case 'admin':
        navigate('/admin-dashboard');
        break;
      case 'provider':
        navigate('/provider-dashboard');
        break;
      case 'client':
        navigate('/client-dashboard');
        break;
      default:
        navigate('/');
    }
    setIsOpen(false); // Close mobile menu after navigation
  };

  // Close mobile menu when clicking a link
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
  <div>
<nav className="bg-[#F2EADD] md:rounded-full mt-4 mx-auto w-full max-w-6xl -2xl px-4">
      <div className="w-full mx-auto px-2 sm:px-4 lg:px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src="https://i.postimg.cc/C5dQgh9H/MAIN-1.png" alt="Handy Home" className="h-8" />
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#076870] focus:outline-none"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            {!isOpen ? (
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 font-poppins flex-grow justify-center">
          <Link to="/" className="text-gray-700 hover:text-[#076870] transition-colors duration-300">Home</Link>
          <Link to="/Services" className="text-gray-700 hover:text-[#076870] transition-colors duration-300">Services</Link>
          <Link to="/about" className="text-gray-700 hover:text-[#076870] transition-colors duration-300">About Us</Link>
          <Link to="/contact" className="text-gray-700 hover:text-[#076870] transition-colors duration-300">Contact Us</Link>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {authState.isAuthenticated ? (
            <>
              <button 
                onClick={handleDashboardClick}
                className="relative overflow-hidden py-2.5 px-5 text-sm font-medium text-white rounded-full border border-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-300 bg-[#076870] hover:bg-white hover:text-black cursor-pointer"
              >
                Dashboard
              </button>
              <button 
                onClick={handleLogout}
                className="relative overflow-hidden py-2.5 px-5 text-sm font-medium text-white rounded-full border border-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-300 bg-[#076870] hover:bg-white hover:text-black cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/become-tasker">
                <button className="relative overflow-hidden py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-full border border-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-300 hover:bg-[#076870] hover:text-white cursor-pointer">
                  Become a Tasker
                </button>
              </Link>
              <Link to="/auth">
                <button className="relative overflow-hidden py-2.5 px-5 text-sm font-medium text-white rounded-full border border-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-300 bg-[#076870] hover:bg-white hover:text-black cursor-pointer">
                  Sign Up / Log in
                </button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#F2EADD] rounded-lg mx-4 mb-4">
          <Link 
            to="/" 
            onClick={handleLinkClick}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#076870] hover:bg-gray-50"
          >
            Home
          </Link>
          <Link 
            to="/services" 
            onClick={handleLinkClick}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#076870] hover:bg-gray-50"
          >
            Services
          </Link>
          <Link 
            to="/about" 
            onClick={handleLinkClick}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#076870] hover:bg-gray-50"
          >
            About Us
          </Link>
          <Link 
            to="/contact" 
            onClick={handleLinkClick}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#076870] hover:bg-gray-50"
          >
            Contact Us
          </Link>

          <div className="pt-4 pb-2 border-t border-gray-200">
            {authState.isAuthenticated ? (
              <>
                <button 
                  onClick={handleDashboardClick}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white bg-[#076870] hover:bg-white hover:text-black mb-2"
                >
                  Dashboard
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white bg-[#076870] hover:bg-white hover:text-black"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/become-tasker" 
                  onClick={handleLinkClick}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 bg-white hover:bg-[#076870] hover:text-white mb-2"
                >
                  Become a Tasker
                </Link>
                <Link 
                  to="/auth" 
                  onClick={handleLinkClick}
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-[#076870] hover:bg-white hover:text-black"
                >
                  Sign Up / Log in
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  </div> 
   
  )
  ;
};

export default Navbar;