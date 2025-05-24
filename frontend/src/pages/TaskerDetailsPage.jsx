import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReadyToJoin from '../components/ReadyToJoin';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import the auth context

// Icons for skills
const SkillIcons = {
  Wiring: '🔌',
  'Lighting Installation': '💡',
  'Circuit Repair': '⚡',
  'Pipe Repair': '🚰',
  'Drain Cleaning': '🚿',
  'Water Heater Installation': '🔥',
  'Furniture Repair': '🪑',
  Cabinetry: '🔨',
  'Custom Built-Ins': '🛠️',
};

// Example taskers data
const taskersData = [
  {
    id: 1,
    name: 'John Doe',
    rating: 4.5,
    location: 'New York',
    price: 100,
    available: true,
    image: 'https://cdn.prod.website-files.com/6641b18a77a92d76b329c2d5/6641b50e3a30a5d77c8578a8_electrical-problems.jpg',
    taskType: 'Electrician',
    department: 'Electrical Engineering',
    experience: '5+ years',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    reviews: 120,
    availability: {
      Monday: { start: '09:00', end: '17:00', status: 'Available' },
      Tuesday: { start: '09:00', end: '17:00', status: 'Available' },
      Wednesday: { start: '09:00', end: '17:00', status: 'Booked' },
      Thursday: { start: '09:00', end: '17:00', status: 'Available' },
      Friday: { start: '09:00', end: '17:00', status: 'Available' },
      Saturday: { start: '10:00', end: '14:00', status: 'Available' },
      Sunday: { status: 'Not Available' },
    },
    bio: 'Emily Watson brings a wealth of expertise and experience to her role as an electrician at HandyHome.',
    skills: ['Wiring', 'Lighting Installation', 'Circuit Repair'],
    services: [
      { name: 'Wiring Installation', price: 150, description: 'Professional wiring installation for homes and offices.' },
      { name: 'Lighting Setup', price: 100, description: 'Installation of modern lighting solutions.' },
      { name: 'Circuit Repair', price: 200, description: 'Diagnosis and repair of electrical circuits.' },
    ],
    clientReviews: [
      { name: 'Alice', rating: "5", comment: 'Great work, very professional!', date: '2023-10-01' },
      { name: 'Bob', rating: "4", comment: 'Fixed my issue quickly.', date: '2023-09-25' },
      { name: 'Charlie', rating: "5", comment: 'Highly recommended.', date: '2023-09-20' },
    ],
  },
  // Add more taskers here...
];

// Example top-rated taskers (hardcoded for now)
const exampleTopRatedTaskers = [
  {
    id: 2,
    name: 'Jane Smith',
    rating: 4.8,
    location: 'California',
    price: 200,
    image: 'https://cdn.prod.website-files.com/6641b18a77a92d76b329c2d5/6641b4ed7288e84197d4a6b7_plumbing-solutions.jpg',
    taskType: 'Electrician',
    reviews: 95,
    milesAway: 5,
    availableThisWeekend: true,
  },
  {
    id: 3,
    name: 'Bob Brown',
    rating: 4.7,
    location: 'Texas',
    price: 150,
    image: 'https://cdn.prod.website-files.com/6641b18a77a92d76b329c2d5/6641b4c384a3010ab6bf5e72_carpentry-services.jpg',
    taskType: 'Electrician',
    reviews: 80,
    milesAway: 10,
    availableThisWeekend: false,
  },
  {
    id: 4,
    name: 'Alice Johnson',
    rating: 4.9,
    location: 'Florida',
    price: 180,
    image: 'https://cdn.prod.website-files.com/6641b18a77a92d76b329c2d5/6641b4c384a3010ab6bf5e72_carpentry-services.jpg',
    taskType: 'Electrician',
    reviews: 110,
    milesAway: 2,
    availableThisWeekend: true,
  },
];

const TaskerDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); // Use the auth context
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  const tasker = taskersData.find((tasker) => tasker.id === parseInt(id));

  if (!tasker) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Tasker not found!</h2>
          <Link to="/services" className="text-[#076870] hover:underline">
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const handleBookService = (e) => {
    e.preventDefault(); // Prevent any default behavior
    
    if (!isAuthenticated) {
      // Show the signup prompt
      setShowSignupPrompt(true);
      
      // Auto-hide the prompt after 5 seconds
      setTimeout(() => setShowSignupPrompt(false), 5000);
      
      // Do NOT navigate - just return early
      return;
    }
    
    // If user is authenticated, proceed with booking
    navigate(`/book/${id}`);
  };

  const handleSignupClick = () => {
    // Navigate to auth page with return path
    navigate('/auth', { state: { from: `/book/${id}` } });
  };

  const topRatedTaskers = exampleTopRatedTaskers;

  return (
    <>
      <section
        className="bg-cover bg-center h-96"
        style={{
          backgroundImage:
            'url("https://cdn.prod.website-files.com/663b34c56f05c8c9e12aafdc/664058919f21cfec93f3fe47_hero-bg.jpg")',
        }}
      >
        <div className="text-center text-black pt-24">
          <motion.div
            className="inline-block border-x-4 border-[#076870] text-[#076870] rounded-md px-6 py-2 cursor-pointer bg-[#EAF4F4]"
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2
              className="text-sm font-light sm:text-sm md:text-sm"
              initial={{ opacity: 0, y: 70 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Team Details
            </motion.h2>
          </motion.div>
          <motion.h2
            className="text-xl md:text-5xl font-bold mt-6"
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {tasker.name}
          </motion.h2>
          <motion.p
            className="text-sm mt-4"
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {tasker.bio}
          </motion.p>
        </div>
      </section>

      <section className="bg-white p-8 rounded-lg shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* First Flex Section: Picture and Info */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Picture Section */}
            <div className="w-full md:w-1/2">
              <img
                src={tasker.image}
                alt={tasker.name}
                className="w-full h-auto rounded-lg"
              />
            </div>

            {/* Info Section */}
            <div className="w-full md:w-1/2 bg-gray-200 px-6 py-6 rounded">
              <h1 className="text-3xl font-bold">
                <span className="font-light">Hello, I'm</span> <br />
                {tasker.name}
              </h1>
              <p className="text-xl text-[#076870] font-semibold">{tasker.taskType}</p>
              <div className="hidden md:block h-1 w-[50%] mt-2 mb-2 bg-gray-300"></div>
              <p className="text-gray-600">Department: {tasker.department}</p>
              <p className="text-gray-600">Experience: {tasker.experience}</p>
              <p className="text-gray-600">Email: {tasker.email}</p>
              <p className="text-gray-600">Phone: {tasker.phone}</p>

              {/* Buttons */}
              <div className="mt-6 flex flex-col gap-4">
                <div className="flex gap-4">
                  <button
                    onClick={handleBookService}
                    className="px-6 py-3 cursor-pointer bg-[#076870] text-white rounded-lg hover:bg-[#065f57] transition duration-300"
                  >
                    Book a Service
                  </button>
                  <button className="px-6 py-3 cursor-pointer bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300">
                    Message Provider
                  </button>
                </div>
                
                {/* Signup Prompt */}
                {showSignupPrompt && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Authentication Required
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>
                            Please{' '}
                            <button 
                              className="font-medium underline hover:text-red-600"
                              onClick={handleSignupClick}
                            >
                              sign up or log in
                            </button>{' '}
                            to book this service.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Second Flex Section: Skills and Experience */}
          <div className="mt-8 flex flex-col md:flex-row gap-8">
            {/* Skills Section */}
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl font-bold">Professional Skills</h2>
              <div className="mt-4 space-y-2">
                {tasker.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span>{SkillIcons[skill]}</span>
                    <p className="text-gray-700">{skill}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Section */}
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl font-bold">Experience</h2>
              <p className="text-gray-700 mt-4">{tasker.bio}</p>
            </div>
          </div>

          {/* Third Flex Section: Services and Availability */}
          <div className="mt-8 flex flex-col md:flex-row gap-8">
            {/* Services Section */}
            <div className="w-full md:w-1/2 bg-[#EAF4F4] py-6 px-6 rounded">
              <h2 className="text-2xl font-light">Services Offered</h2>
              <div className="mt-4 space-y-4">
                {tasker.services.map((service, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border-l-4 border-[#076870]">
                    <p className="font-semibold">{service.name}</p>
                    <p className="text-gray-700">${service.price}</p>
                    <p className="text-gray-600 text-sm mt-2">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability Section */}
            <div className="w-full md:w-1/2 bg-[#EAF4F4] py-6 px-6 rounded">
              <h2 className="text-2xl font-light">Availability</h2>
              <div className="mt-4">
                {/* Desktop Table */}
                <div className="hidden md:block">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="p-2 text-center">Day</th>
                        <th className="p-2 text-center">Hours</th>
                        <th className="p-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(tasker.availability).map(([day, time]) => (
                        <tr key={day} className="border-b border-gray-200 text-center">
                          <td className="p-2">{day}</td>
                          <td className="p-2">
                            {typeof time === 'string' ? '-' : `${time.start} - ${time.end}`}
                          </td>
                          <td className="p-2">
                            <span
                              className={`px-2 py-1 rounded-full text-sm ${
                                time.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {time.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Stacked Layout */}
                <div className="md:hidden space-y-4">
                  {Object.entries(tasker.availability).map(([day, time]) => (
                    <div key={day} className="bg-white p-4 rounded-lg border-l-4 border-[#076870]">
                      <p className="font-semibold">{day}</p>
                      <p className="text-gray-700">
                        {typeof time === 'string' ? '-' : `${time.start} - ${time.end}`}
                      </p>
                      <p className="text-gray-700">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            time.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {time.status}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Client Reviews Section */}
          <div className="mt-8 bg-[#EAF4F4] px-6 py-6 rounded">
            <h2 className="text-2xl font-light">Client Reviews</h2>
            <div className="mt-4 space-y-4">
              {tasker.clientReviews.map((review, index) => (
                <div key={index} className="border-l-4 border-[#076870] bg-white p-6 rounded-lg">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">{review.name}</p>
                    <p className="text-gray-600 text-sm">{review.date}</p>
                  </div>
                  <p className="text-gray-700">⭐⭐⭐⭐⭐ {review.rating}</p>
                  <p className="text-gray-700 mt-2">"{review.comment}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Rated Taskers in the Same Services Section */}
          <div className="mt-8">
            <h2 className="text-3xl border-x-4 border-[#076870] text-[#076870] rounded-md px-6 py-2 cursor-pointer bg-[#EAF4F4] text-center max-auto">
              Top Rated Taskers in {tasker.taskType}
            </h2>

            {/* Top Rated Taskers Grid */}
            <div className="mt-8 bg-[#EAF4F4] px-6 py-6 rounded">
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
                {topRatedTaskers.map((tasker) => (
                  <div key={tasker.id} className="bg-white p-4 rounded-lg shadow-md">
                    <img
                      src={tasker.image}
                      alt={tasker.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <h3 className="text-xl font-semibold mt-2">{tasker.name}</h3>
                    <p className="text-[#076870]">{tasker.taskType}</p>
                    
                    <div className="mt-4 mb-4 flex justify-center gap-4">
                      <button className="px-2 py-2 text-orange-400 rounded-full font-light bg-orange-100 hover:bg-orange-200 transition duration-300 cursor-pointer">
                        Top Rated
                      </button>
                      <button className="px-2 py-2 text-green-800 bg-green-100 rounded-full font-light hover:bg-green-200 cursor-pointer transition duration-300">
                        Verified
                      </button>
                    </div>
                    
                    <p className="text-gray-600">⭐ {tasker.rating} ({tasker.reviews} reviews)</p>
                    <p className="text-gray-600">${tasker.price} / hour</p>

                    {/* Miles Away and Available This Weekend */}
                    <div className="mt-4 space-y-2">
                      <p className="text-gray-600">📍 {tasker.milesAway} miles away</p>
                      <p className="text-gray-600">
                        {tasker.availableThisWeekend ? '✅ Available this weekend' : '❌ Not available this weekend'}
                      </p>
                    </div>

                    {/* View Profile Button */}
                    <Link 
                      to={`/taskers/${tasker.id}`}
                      className="mt-4 px-4 py-2 bg-[#076870] text-white rounded-full hover:bg-[#065f57] transition duration-300 cursor-pointer block"
                    >
                      View Profile
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <ReadyToJoin />
    </>
  );
};

export default TaskerDetailsPage;