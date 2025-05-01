import React from 'react'

const ProviderCard = ({ provider, onClick, className = '' }) => {
    return (
      <div 
        onClick={onClick}
        className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 ${className}`}
      >
        <div className="relative">
          <img 
            src={provider.photo} 
            alt={provider.businessName} 
            className="w-full h-48 object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-medium shadow flex items-center">
            ⭐ {provider.rating.toFixed(1)} ({provider.reviewCount})
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1">{provider.businessName}</h3>
          <p className="text-gray-600 mb-1">{provider.service}</p>
          <p className="text-gray-500 text-sm">{provider.location}</p>
        </div>
      </div>
    );
  };

export default ProviderCard
