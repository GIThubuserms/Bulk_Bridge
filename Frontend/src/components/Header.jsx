import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useVendor } from "../context/VendorContext.jsx"; // ✅ added
import { User, ShoppingBag, Menu, X, Coins } from "lucide-react";

export default function Header() {
  const { user, signOut } = useAuth();
  const { connects } = useVendor(); 

  const navigate = useNavigate();
  const location = useLocation();

  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const basePath =
    user?.role === "purchaser"
      ? "/app/purchaser"
      : "/app/vendor";

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to={`${basePath}/dashboard`} className="flex items-center">
            <ShoppingBag className="w-8 h-8 text-slate-900" />
            <span className="ml-2 text-xl font-bold text-slate-900">
              BulkBridge
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to={`${basePath}/dashboard`}
              className={`px-4 py-2 rounded-lg font-medium ${
                isActive(`${basePath}/dashboard`)
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Dashboard
            </Link>

            {user?.role === "purchaser" && (
              <Link
                to={`${basePath}/my-requests`}
                className={`px-4 py-2 rounded-lg font-medium ${
                  isActive(`${basePath}/my-requests`)
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                My Requests
              </Link>
            )}

            {user?.role === "vendor" && (
              <>
                <Link
                  to={`${basePath}/my-bids`}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    isActive(`${basePath}/my-bids`)
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  My Bids
                </Link>

                <Link
                  to={`${basePath}/connects`}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    isActive(`${basePath}/connects`)
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Connects
                </Link>
              </>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">

            {/* Connect Counter */}
            {user?.role === "vendor" && connects && (
              <Link
                to={`${basePath}/connects`}
                className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-slate-100 rounded-lg"
              >
                <Coins className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {connects.available}
                </span>
              </Link>
            )}

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <User className="w-5 h-5" />
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border">
                  <div className="p-4 border-b">
                    <div className="font-semibold">{user?.full_name}</div>
                    <div className="text-sm capitalize">{user?.role}</div>
                  </div>

                  <button
                    onClick={() => {
                      navigate("/app/profile");
                      setShowProfile(false);
                    }}
                    className="w-full p-3 text-left hover:bg-slate-50"
                  >
                    View Profile
                  </button>

                  <button
                    onClick={signOut}
                    className="w-full p-3 text-left hover:bg-slate-50 text-red-600"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden"
            >
              {showMobileMenu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
