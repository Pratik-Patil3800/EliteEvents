import React from 'react';
import { Calendar, Bell } from 'lucide-react';

const EventNotification = ({ 
  image,
  date,
  name,
  description,
  category,
  from,
  onAddToCalendar 
}) => {
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to truncate description
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <div className="w-full h-[440px] bg-gray-100 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col p-4">
      <div className="relative h-48 flex-shrink-0">
        <img
          src={image || "/api/placeholder/400/200"}
          alt={name}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-4 right-4 px-3 py-1 text-sm bg-white/90 text-black rounded-full">
          {category}
        </span>
      </div>
      
      <div className="p-4 flex-grow flex flex-col bg-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">{name}</h3>
            <p className="text-sm text-gray-600 mb-2 flex items-center">
              <Bell className="w-4 h-4 mr-1 flex-shrink-0" />
              From: {from}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-medium text-gray-700">
              {formatDate(date)}
            </p>
          </div>
        </div>
        
        <p className="text-gray-600 mt-2 line-clamp-3">
          {description}
        </p>
      </div>

      <div className="px-4 py-3 border-t border-gray-100 flex justify-end mt-auto">
        <button
          onClick={onAddToCalendar}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors duration-200"
        >
          <Calendar className="w-4 h-4" />
          Add to Calendar
        </button>
      </div>
    </div>
  );
};

export default EventNotification;