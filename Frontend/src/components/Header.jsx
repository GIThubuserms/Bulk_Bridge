import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from "../context/AuthContext.jsx"
import { User, LogOut, ShoppingBag, Menu, X, Coins } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function Header({ currentPage, onNavigate }) {
  const { user, signOut } = useAuth();

  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [connects, setConnects] = useState(null);

  useEffect(() => {
    if (user?.role === 'vendor') {
      loadConnects();
    }
  }, [user]);

  const loadConnects = async () => {
    const res = await fetch(`${BASE_URL}/api/v1/connects/me`, {
      credentials: 'include',
    });

    if (res.ok) {
      const data = await res.json();
      setConnects(data.data);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center"
          >
            <ShoppingBag className="w-8 h-8 text-slate-900" />
            <span className="ml-2 text-xl font-bold text-slate-900">
              BulkBridge
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 'dashboard'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              Dashboard
            </button>

            {user?.role === 'purchaser' && (
              <button
                onClick={() => onNavigate('my-requests')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 'my-requests'
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                My Requests
              </button>
            )}

            {user?.role === 'vendor' && (
              <button
                onClick={() => onNavigate('my-bids')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 'my-bids'
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                My Bids
              </button>
            )}

            <button
              onClick={() => onNavigate('messages')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 'messages'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              Messages
            </button>
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {user?.role === 'vendor' && connects && (
              <button
                onClick={() => onNavigate('connects')}
                className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                <Coins className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {connects.available}
                </span>
              </button>
            )}

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              >
                <User className="w-5 h-5" />
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200">
                  <div className="p-4 border-b border-slate-200">
                    <div className="font-semibold text-slate-900">
                      {user?.full_name}
                    </div>
                    <div className="text-sm text-slate-500 capitalize">
                      {user?.role}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onNavigate('profile');
                      setShowProfile(false);
                    }}
                    className="w-full p-3 text-left hover:bg-slate-50 flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">View Profile</span>
                  </button>

                  <button
                    onClick={signOut}
                    className="w-full p-3 text-left hover:bg-slate-50 flex items-center space-x-2 text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  currentPage: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
};
