import React, { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { getDaysInMonth, getFirstDayOfMonth, formatDate } from "../utils/date";
import { CreateEventDialog } from "./create-event-dialog";
import { CalendarEvent } from "./calendar-event";
import Navcomp from "./Nav2";
import { useEvents } from "../context/eventcontext";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  X,
  Menu
} from 'lucide-react';

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [showMiniCalendar, setShowMiniCalendar] = useState(window.innerWidth >= 768);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [activeFilters, setActiveFilters] = useState({
    helpNeeded: false,
    needsMet: false,
    occasions: false
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const {setEvents, events} = useEvents();
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState(events);
  
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  useEffect(() => {
    const handleResize = () => {
      setShowMiniCalendar(window.innerWidth >= 768);
      if (window.innerWidth >= 768) {
        setIsMobileFilterOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let filtered = [...events];

    if (searchQuery) {
      filtered = filtered.filter(event => 
        event.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (dateRange.start && dateRange.end) {
      const start = new Date(dateRange.start);
      start.setHours(0, 0, 0, 0);

      const end = new Date(dateRange.end);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= start && eventDate <= end
      });
    }

    if (activeFilters.helpNeeded || activeFilters.needsMet || activeFilters.occasions) {
      filtered = filtered.filter(event => {
        if (activeFilters.helpNeeded && event.urgency === "high") return true;
        if (activeFilters.needsMet && event.urgency === "medium") return true;
        if (activeFilters.occasions && event.urgency === "low") return true;
        return false;
      });
    }

    setFilteredEvents(filtered);
  }, [searchQuery, dateRange, activeFilters, events]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const addEvent = (event) => {
    setEvents([...events, event]);
    setIsCreateEventOpen(false);
  };

  const renderFilters = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Date Range</h3>
        <div className="flex flex-col gap-2">
          <input 
            type="date" 
            value={dateRange.start || ''}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
          />
          <input 
            type="date" 
            value={dateRange.end || ''}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
          />
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Urgency</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
            <input 
              type="checkbox" 
              checked={activeFilters.helpNeeded}
              onChange={(e) => setActiveFilters(prev => ({ ...prev, helpNeeded: e.target.checked }))}
              className="rounded text-blue-600" 
            />
            <span className="text-red-500">High</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
            <input 
              type="checkbox" 
              checked={activeFilters.needsMet}
              onChange={(e) => setActiveFilters(prev => ({ ...prev, needsMet: e.target.checked }))}
              className="rounded text-blue-600" 
            />
            <span className="text-blue-500">Medium</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
            <input 
              type="checkbox" 
              checked={activeFilters.occasions}
              onChange={(e) => setActiveFilters(prev => ({ ...prev, occasions: e.target.checked }))}
              className="rounded text-blue-600" 
            />
            <span className="text-yellow-500">Low</span>
          </label>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Event Search</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input 
            type="search" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events..." 
            className="w-full border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderMonthView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-7 gap-1 sm:gap-4">
      {DAYS.map((day) => (
        <div key={day} className="hidden sm:block text-center font-semibold p-2 text-gray-600 bg-gray-50 rounded">
          {day.slice(0, 3)}
        </div>
      ))}
      {blanks.map((blank) => (
        <div key={`blank-${blank}`} className="hidden sm:block p-2" />
      ))}
      {days.map((day) => {
        const date = new Date(year, month, day);
        const dayEvents = filteredEvents.filter(
          (event) => {
            const eventDate = new Date(event.date);
            return (
              eventDate.getFullYear() === date.getFullYear() &&
              eventDate.getMonth() === date.getMonth() &&
              eventDate.getDate() === date.getDate()
            );
          }
        );

        return (
          <div 
            key={day} 
            className="min-h-[100px] sm:min-h-[140px] p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{day}</span>
              <span className="sm:hidden text-xs text-gray-500">
                {DAYS[new Date(year, month, day).getDay()].slice(0, 3)}
              </span>
            </div>
            <div className="mt-2 space-y-1">
              {dayEvents.map((event) => (
                <CalendarEvent key={event._id} event={event} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col h-screen">
      <Navcomp/>

      <div className="flex flex-1">
        <div className={`flex-1 transition-all duration-300 ${!showMiniCalendar ? 'mr-0' : 'mr-0 md:mr-80'}`}>
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <Button onClick={() => setIsCreateEventOpen(true)}>
                Add an Event
              </Button>
              <Button 
                variant="ghost" 
                className="md:hidden"
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center justify-between mb-6 bg-gray-50 p-4 rounded-lg">
              <Button variant="ghost" onClick={handlePrevMonth} className="hover:bg-gray-200">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
                {MONTHS[month]} {year}
              </h2>
              <Button variant="ghost" onClick={handleNextMonth} className="hover:bg-gray-200">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="overflow-y-auto">
              {renderMonthView()}
            </div>
          </div>
        </div>

        {/* Mobile Filters */}
        <div className={`
          fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden transition-opacity duration-300
          ${isMobileFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}>
          <div className={`
            fixed right-0 top-0 bottom-0 w-80 bg-white shadow-lg p-6 transform transition-transform duration-300
            ${isMobileFilterOpen ? 'translate-x-0' : 'translate-x-full'}
          `}>
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="absolute top-4 right-4"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-semibold mb-6">Filters</h2>
            {renderFilters()}
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className={`
          hidden md:block fixed right-0 top-[73px] bottom-0 w-80 bg-white shadow-lg p-6 transform transition-transform duration-300
          ${showMiniCalendar ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <button
            onClick={() => setShowMiniCalendar(!showMiniCalendar)}
            className="absolute -left-10 top-1/2 bg-white p-2 rounded-l-lg shadow-lg"
          >
            {showMiniCalendar ? <ChevronRight /> : <ChevronLeft />}
          </button>

          <h2 className="text-xl font-semibold mb-6">{formatDate(currentDate)}</h2>
          {renderFilters()}
        </div>

        <CreateEventDialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen} onSubmit={addEvent} />
      </div>
    </div>
  );
}