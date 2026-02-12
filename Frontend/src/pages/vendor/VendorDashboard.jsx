/* eslint-disable react/prop-types */
import {
  Search,
  Filter,
  Package,
  MapPin,
  Calendar,
  DollarSign,
  Coins,
} from "lucide-react";
import { useVendor } from "../../context/VendorContext";
import { useNavigate } from "react-router-dom";

const categories = [
  "All Categories",
  "Custom T-Shirts",
  "Uniforms",
  "Promotional Items",
  "Event Merchandise",
  "Corporate Gifts",
  "Packaging",
  "Printed Materials",
  "Other",
];

export default function VendorDashboard() {
  const navigate = useNavigate();

  const {
    requests,
    connects,
    loading,
    filters,
    setFilters,
    showFilters,
    setShowFilters,
  } = useVendor();

  const filteredRequests = requests.filter((request) => {
    if (
      filters.category !== "All Categories" &&
      request.category !== filters.category
    )
      return false;

    if (
      filters.search &&
      !request.title.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;

    if (filters.minQuantity && request.quantity < Number(filters.minQuantity))
      return false;

    if (filters.maxQuantity && request.quantity > Number(filters.maxQuantity))
      return false;

    if (
      filters.location &&
      !request.delivery_location
        .toLowerCase()
        .includes(filters.location.toLowerCase())
    )
      return false;

    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Browse Requests
          </h1>
          <p className="text-slate-600 mt-1">
            Find and bid on bulk order opportunities
          </p>
        </div>

        {connects && (
          <div className="flex items-center gap-4">
            <div className="bg-slate-100 rounded-xl px-6 py-3">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-slate-700" />
                <div>
                  <div className="text-xs text-slate-600">
                    Available Connects
                  </div>
                  <div className="text-xl font-bold text-slate-900">
                    {connects.available}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/app/vendor/connects")}
              className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800"
            >
              Buy More
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              placeholder="Search requests..."
              className="w-full pl-10 pr-4 py-3 border rounded-xl"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 border rounded-xl"
          >
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
            <FilterInput
              label="Category"
              element={
                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {categories.map((cat) => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
              }
            />

            <FilterInput
              label="Min Quantity"
              element={
                <input
                  type="number"
                  value={filters.minQuantity}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      minQuantity: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              }
            />

            <FilterInput
              label="Max Quantity"
              element={
                <input
                  type="number"
                  value={filters.maxQuantity}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      maxQuantity: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              }
            />

            <FilterInput
              label="Location"
              element={
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      location: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              }
            />
          </div>
        )}
      </div>

      {/* Requests */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold">
            No requests found
          </h3>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredRequests.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-xl p-6 border hover:shadow"
            >
              <h3 className="text-xl font-semibold mb-2">
                {request.title}
              </h3>

              <p className="text-slate-600 mb-3 line-clamp-2">
                {request.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <Info icon={Package} label="Quantity" value={request.quantity} />
                <Info
                  icon={DollarSign}
                  label="Budget"
                  value={`$${request.budget_min} - $${request.budget_max}`}
                />
                <Info
                  icon={Calendar}
                  label="Deadline"
                  value={new Date(request.deadline).toLocaleDateString()}
                />
                <Info
                  icon={MapPin}
                  label="Location"
                  value={request.delivery_location}
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() =>
                    navigate(`/app/vendor/requests/${request._id}`)
                  }
                  className="px-6 py-2 bg-slate-900 text-white rounded-lg"
                >
                  View & Bid
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-slate-400" />
      <div>
        <div className="text-xs text-slate-500">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}

function FilterInput({ label, element }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label}
      </label>
      {element}
    </div>
  );
}
