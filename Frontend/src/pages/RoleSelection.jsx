import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Store } from "lucide-react";

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const continueHandler = () => {
    if (!selectedRole) return;
    navigate(`/login/${selectedRole}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Welcome to BulkBridge
          </h1>
          <p className="text-lg text-slate-600">
            Choose how you want to continue
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Purchaser */}
          <button
            onClick={() => setSelectedRole("purchaser")}
            className={`bg-white rounded-2xl p-8 text-left transition-all duration-200 hover:shadow-xl ${
              selectedRole === "purchaser"
                ? "ring-2 ring-blue-500 shadow-xl"
                : "shadow-md hover:scale-105"
            }`}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Iam a Purchaser
            </h2>
            <p className="text-slate-600 mb-4">
              Post bulk order requests for custom products, get competitive bids
              from verified vendors, and manage your orders from start to finish.
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                Post custom product requests
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                Receive and compare vendor bids
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                Track orders and delivery
              </li>
            </ul>
          </button>

          {/* Vendor */}
          <button
            onClick={() => setSelectedRole("vendor")}
            className={`bg-white rounded-2xl p-8 text-left transition-all duration-200 hover:shadow-xl ${
              selectedRole === "vendor"
                ? "ring-2 ring-emerald-500 shadow-xl"
                : "shadow-md hover:scale-105"
            }`}
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
              <Store className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Iam a Vendor
            </h2>
            <p className="text-slate-600 mb-4">
              Browse bulk order requests, submit competitive bids, negotiate with
              purchasers, and grow your manufacturing business.
            </p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2" />
                Browse order requests
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2" />
                Submit competitive bids
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2" />
                Build your reputation
              </li>
            </ul>
          </button>
        </div>

        {/* Continue Button */}
        {selectedRole && (
          <div className="text-center">
            <button
              onClick={continueHandler}
              className="bg-slate-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors"
            >
              Continue as{" "}
              {selectedRole === "purchaser" ? "Purchaser" : "Vendor"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
