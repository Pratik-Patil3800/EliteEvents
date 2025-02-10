import { Home, Calendar, Bell } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useUser } from "../context/usercontext";

export default function     () {
  const { user } = useUser();
  return (
    <nav className="flex justify-end items-center bg-white shadow-sm mb-6 px-6 py-4 border-b sticky top-0 z-50">
      

      <div className="flex items-center space-x-4">
        {user?.id ? (
          <>
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
        </>
        ): (
          <div className="flex items-center space-x-4">
            <NavLink
              to="/login"
              className="text-gray-600 hover:text-blue-500 transition-all"
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className="text-gray-600 hover:text-blue-500 transition-all"
            >
              Register
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}
