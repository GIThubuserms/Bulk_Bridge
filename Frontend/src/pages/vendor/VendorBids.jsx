/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useVendor } from "../../context/VendorContext.jsx";
import { Package, DollarSign, Calendar, MapPin } from "lucide-react";

export default function VendorBids() {
  const { getMyBids } = useVendor();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        setLoading(true);
        const data = await getMyBids();
        setBids(data || []);
      } catch (err) {
        console.error("Error fetching bids:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [getMyBids]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-slate-600">Loading bids...</div>
      </div>
    );
  }

  if (bids.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border">
        <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">No bids submitted yet</h3>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">My Bids</h1>
      <div className="grid gap-4">
        {bids.map((bid) => (
          <div
            key={bid._id}
            className="bg-white rounded-xl p-6 border hover:shadow"
          >
            <h3 className="text-xl font-semibold mb-2">
              {bid.orderId?.title || "Order Title Unavailable"}
            </h3>

            <p className="text-slate-600 mb-3 line-clamp-2">
              {bid.orderId?.description || "Order description unavailable"}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <Info
                icon={Package}
                label="Quantity"
                value={bid.orderId?.quantity || "-"}
              />
              <Info
                icon={DollarSign}
                label="Your Bid"
                value={`$${bid.totalPrice}`}
              />
              <Info
                icon={Calendar}
                label="Production Days"
                value={bid.productionTimeDays}
              />
              <Info
                icon={MapPin}
                label="Location"
                value={bid.orderId?.delivery_location || "-"}
              />
            </div>

            <div>
              <span
                className={`px-3 py-1 rounded-full text-white font-medium ${
                  bid.status === "accepted"
                    ? "bg-green-500"
                    : bid.status === "rejected"
                    ? "bg-red-500"
                    : "bg-slate-500"
                }`}
              >
                {bid.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
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
