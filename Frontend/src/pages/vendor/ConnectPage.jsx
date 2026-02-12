import { useAuth } from "../../context/AuthContext.jsx";
import { useVendor } from "../../context/VendorContext.jsx";
import { Coins, Check, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const connectPackages = [
  {
    id: 1,
    name: "Starter",
    price: 500,
    connects_count: 5,
    popular: false,
  },
  {
    id: 2,
    name: "Professional",
    price: 1500,
    connects_count: 20,
    popular: true,
  },
  {
    id: 3,
    name: "Enterprise",
    price: 3000,
    connects_count: 50,
    popular: false,
  },
];

export default function ConnectPage() {
  const { user } = useAuth();
  const { connects, purchaseConnects, loading } = useVendor();
  const navigate = useNavigate();

  const handlePurchase = async (pkg) => {
    if (!user) return;

    const confirmed = window.confirm(
      `Purchase ${pkg.connects_count} connects for $${(
        pkg.price / 100
      ).toFixed(2)}?`
    );

    if (!confirmed) return;

    await purchaseConnects(pkg.connects_count);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/app/vendor/dashboard")}
        className="flex items-center text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">
          Purchase Connects
        </h1>
        <p className="text-lg text-slate-600">
          Use connects to submit bids on purchaser requests
        </p>

        {connects && (
          <div className="inline-flex items-center space-x-2 mt-4 px-6 py-3 bg-slate-100 rounded-xl">
            <Coins className="w-6 h-6 text-slate-700" />
            <div>
              <div className="text-sm text-slate-600">
                Available Connects
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {connects.available}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Packages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {connectPackages.map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-white rounded-2xl p-8 border-2 transition-all ${
              pkg.popular
                ? "border-slate-900 shadow-xl scale-105"
                : "border-slate-200 hover:border-slate-300 hover:shadow-lg"
            }`}
          >
            {pkg.popular && (
              <div className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                MOST POPULAR
              </div>
            )}

            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {pkg.name}
            </h3>

            <div className="mb-6">
              <div className="text-4xl font-bold text-slate-900">
                ${(pkg.price / 100).toFixed(2)}
              </div>

              <div className="text-slate-600 mt-1">
                {pkg.connects_count} Connects
              </div>

              <div className="text-sm text-slate-500 mt-1">
                ${(pkg.price / 100 / pkg.connects_count).toFixed(2)} per connect
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-slate-600">
                <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                <span>{pkg.connects_count} bids</span>
              </li>

              <li className="flex items-center text-slate-600">
                <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                <span>Access to all requests</span>
              </li>

              <li className="flex items-center text-slate-600">
                <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                <span>Direct messaging</span>
              </li>
            </ul>

            <button
              onClick={() => handlePurchase(pkg)}
              className={`w-full py-3 rounded-xl font-medium transition-colors ${
                pkg.popular
                  ? "bg-slate-900 text-white hover:bg-slate-800"
                  : "bg-slate-100 text-slate-900 hover:bg-slate-200"
              }`}
            >
              Purchase Package
            </button>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-4">How Connects Work</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-700">
          <div>
            <h3 className="font-semibold mb-2">What are Connects?</h3>
            <p>
              Connects are credits that allow you to submit bids on purchaser
              requests. Each bid costs 1 connect.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Why do I need them?</h3>
            <p>
              The connect system ensures quality interactions between vendors
              and purchasers.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Starting Balance</h3>
            <p>New vendors receive 5 free connects to get started.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">No Expiration</h3>
            <p>Purchased connects never expire.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
