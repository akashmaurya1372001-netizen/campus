import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, Home, PlusCircle, BarChart2, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">Campus Pulse AI</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
                  <Home size={20} />
                  <span className="hidden sm:inline">Feed</span>
                </Link>
                <Link to="/create" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
                  <PlusCircle size={20} />
                  <span className="hidden sm:inline">Post</span>
                </Link>
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
                  <BarChart2 size={20} />
                  <span className="hidden sm:inline">Analytics</span>
                </Link>
                <Link to="/profile" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
                  <UserIcon size={20} />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <div className="h-6 w-px bg-gray-300 mx-2"></div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-600 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition-colors"
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
