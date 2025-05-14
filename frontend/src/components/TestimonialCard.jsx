import React, { useState } from 'react';

export default function TestimonialCard() {
  const testimonials = [
    {
      name: "Maria Smantha",
      role: "Web Developer",
      image: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(1).webp",
      quote:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. A aliquam amet animi blanditiis consequatur debitis dicta distinctio",
    },
    {
      name: "John Doe",
      role: "Graphic Designer",
      image: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(2).webp",
      quote:
        "HandyHome provided excellent service! Their team was professional and delivered beyond my expectations. Highly recommended!",
    },
    {
      name: "Jane Smith",
      role: "Marketing Manager",
      image: "https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(3).webp",
      quote:
        "I was impressed by the quality of work and attention to detail. HandyHome is my go-to for home solutions.",
    },
  ];

  // State to manage current testimonial index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to go to the next testimonial
  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to go to the previous testimonial
  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="bg-white mt-12 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="text-center md:text-left">
            <h2 className="inline-block border-x-4 border-[#076870] bg-blue-50 text-[#076870] text-xl sm:text-2xl md:text-3xl font-light rounded-md px-4 py-2">
              Testimonial
            </h2>
            <p className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900">
              What Our <span className="text-[#076870]">Clients</span> <br />
              <span className="text-[#076870]">Say</span> About Us
            </p>
            <p className="mt-4 text-gray-600 text-lg">
              Here's what some of our valued clients have to say about their
              experience with HandyHome.
            </p>
          </div>

          {/* Right Column */}
          <div className="bg-white rounded-xl overflow-hidden mt-2">
            <div className="relative px-4 py-6">
              {/* Left Quote Icon */}
              <div className="absolute top-0 left-0 text-[#076870] text-4xl opacity-30">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Testimonial Content */}
              <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                  <div className="flex flex-col lg:flex-row items-center transition-all duration-700 ease-in-out">
                    {/* Image */}
                    <div className="w-full lg:w-1/3 flex justify-center mb-4 lg:mb-0">
                      <img
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].name}
                        className="rounded-full shadow-lg w-36 h-36 object-cover"
                      />
                    </div>

                    {/* Testimonial Text */}
                    <div className="w-full lg:w-2/3 lg:text-left text-center px-4">
                      <h4 className="text-xl font-semibold mb-4">
                        {testimonials[currentIndex].name} -{" "}
                        <span className="font-normal text-gray-600">{testimonials[currentIndex].role}</span>
                      </h4>
                      <p className="text-gray-600 mb-4 text-lg">
                        "{testimonials[currentIndex].quote}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Quote Icon */}
              <div className="absolute bottom-0 right-0 text-[#076870] text-4xl opacity-30">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.57-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                </svg>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center gap-6 mt-2 mb-4">
              {/* Left Arrow */}
              <button
                onClick={prevTestimonial}
                className="flex items-center justify-center w-12 h-12 bg-[#076870] text-white rounded-full shadow-md hover:bg-[#065f57] cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
                aria-label="Previous testimonial"
              >
                <svg
                  fill="none"
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              {/* Right Arrow */}
              <button
                onClick={nextTestimonial}
                className="flex items-center justify-center w-12 h-12 bg-[#076870] text-white rounded-full shadow-md hover:bg-[#065f57] cursor-pointer transition duration-300 ease-in-out transform hover:scale-110"
                aria-label="Next testimonial"
              >
                <svg
                  fill="none"
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}