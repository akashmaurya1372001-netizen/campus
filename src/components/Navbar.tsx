import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {
  LogOut,
  Home,
  PlusCircle,
  BarChart2,
  User as UserIcon,
  Sparkles,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="rounded-2xl " >
              <img src="src/assets/logoonly.png" alt="" className="rounded-2xl h-16" />
            </div>
            <span className="font-bold text-lg bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:inline">
              Campus Connect
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {user ? (
              <>
                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-3">
                  <Link
                    to="/"
                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-sm font-medium"
                  >
                    <Home size={18} />
                    <span>Feed</span>
                  </Link>
                  <Link
                    to="/create"
                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-sm font-medium"
                  >
                    <PlusCircle size={18} />
                    <span>Create</span>
                  </Link>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-sm font-medium"
                  >
                    <BarChart2 size={18} />
                    <span>Analytics</span>
                  </Link>
                </div>

                {/* Divider */}
                <div className="h-6 w-px bg-gray-300/50"></div>

                {/* User Section */}
                <div className="flex items-center gap-3">
                  <Link
                    to="/profile"
                    className="hidden sm:flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-sm font-medium"
                  >
                    <UserIcon size={18} />
                    <div className="text-left">
                      <p className="text-xs font-semibold text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user.role}
                      </p>
                    </div>
                  </Link>
                  <Link
                    to="/profile"
                    className="sm:hidden p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <UserIcon size={20} />
                  </Link>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-linear-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white px-5 py-2 rounded-full font-medium transition-all text-sm"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
