import React, { useState, useEffect } from 'react';
import { Search, Loader } from 'lucide-react';
import EventNotification from '../components/EventNotification';
import Navcomp from '../components/Nav2';
import { useEvents } from "../context/eventcontext";
import { useUser } from "../context/usercontext";

const NotificationsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const {unsubevents}=useEvents();
  // const {user} = useUser();

  

  const filteredAndSortedNotifications = unsubevents
    .filter(notification => {
      const matchesSearch = 
        notification?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification?.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification?.creator.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = 
        selectedCategory === 'all' || 
        notification.category.toLowerCase() === selectedCategory.toLowerCase();

      const notificationDate = new Date(notification.date);
      const today = new Date();
      const matchesDate = dateFilter === 'all' || 
        (dateFilter === 'today' && notificationDate.toDateString() === today.toDateString()) ||
        (dateFilter === 'week' && notificationDate >= new Date(today - 7 * 24 * 60 * 60 * 1000)) ||
        (dateFilter === 'month' && notificationDate >= new Date(today - 30 * 24 * 60 * 60 * 1000));

      return matchesSearch && matchesCategory && matchesDate;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    

  const totalPages = Math.ceil(filteredAndSortedNotifications.length / itemsPerPage);
  const paginatedNotifications = filteredAndSortedNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddToCalendar = (notification) => {
    console.log('Adding to calendar:', notification);
  };

  return (
    <>
    <Navcomp/>
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Open Invitations</h1>
          
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="technology">Technology</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="category">Sort by Category</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <>
            {/* Notifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedNotifications.map((notification) => (
                <div 
                  key={notification.id}
                  className="transform transition-all duration-300 hover:-translate-y-1"
                >
                  <EventNotification key={notification._id} {...notification} flag={true}/>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}

            {/* Empty State */}
            {filteredAndSortedNotifications.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">No notifications found</p>
                <p className="text-gray-500 mt-2">Try adjusting your filters or search term</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </>
    
  );
};

export default NotificationsPage;