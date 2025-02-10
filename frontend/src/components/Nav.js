import { Search, Home, Calendar, Bell } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useUser } from "../context/usercontext";

export default function Navcomp({ searchQuery, handleSearch }) {
  const { user } = useUser();
  return (
    <nav className="flex justify-between items-center bg-white mb-6 shadow-sm border-b p-4 w-full">
      <div className="relative flex-1 max-w-lg">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search files..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      <div className="flex items-center space-x-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center space-x-2 ${
              isActive ? "text-blue-600" : "text-gray-500"
            } hover:ring-2 hover:ring-blue-500 transition-all`
          }
        >
          <Home className="h-6 w-6 hover:scale-110" />
        </NavLink>

        <NavLink
          to="/calendar"
          className={({ isActive }) =>
            `flex items-center space-x-2 ${
              isActive ? "text-blue-600" : "text-gray-500"
            } hover:ring-2 hover:ring-blue-500 transition-all`
          }
        >
          <Calendar className="h-6 w-6 hover:scale-110" />
        </NavLink>

        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `relative ${
              isActive ? "text-blue-600" : "text-gray-500"
            } hover:ring-2 hover:ring-blue-500 transition-all`
          }
        >
          <Bell className="h-6 w-6 hover:scale-110" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>`relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 hover:border-blue-500 transition-all transform hover:scale-110 ${isActive ? "ring-2 ring-blue-500" : ""}`}
        >
          <img
            src={user?.avatar}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </NavLink>
      </div>
    </nav>
  );
}
