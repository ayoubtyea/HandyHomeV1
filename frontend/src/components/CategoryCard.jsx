import React from 'react'

const CategoryCard = ({ category, onClick, className = '' }) => {
    return (
      <div 
        onClick={onClick}
        className={`bg-white rounded-lg shadow-md p-6 text-center cursor-pointer hover:shadow-lg transition-shadow duration-300 ${className}`}
      >
        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <img src={category.icon} alt={category.name} className="w-8 h-8" />
        </div>
        <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
        <p className="text-gray-500 text-sm">{category.serviceCount} providers</p>
      </div>
    );
  };

export default CategoryCard
