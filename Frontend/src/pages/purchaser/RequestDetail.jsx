import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Package,
  DollarSign,
  MessageSquare,
} from "lucide-react";
import { usePurchase } from "../../context/PurchaserContext.jsx";
import { useParams, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";



export default function RequestDetail() {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const { getOrderById, getBidsOnOrder, acceptBid } = usePurchase();

  const [order, setOrder] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Paramas Id : ",requestId)
    const loadData = async () => {
      try {
        const orderData = await getOrderById(requestId);
        const bidsData = await getBidsOnOrder(requestId);

        setOrder(orderData);
        setBids(bidsData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [requestId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-slate-600">Order not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back */}
      <button
        onClick={() => navigate("/app/purchaser/dashboard")}
        className="flex items-center text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2">
          {/* ORDER */}
          <div className="bg-white rounded-2xl border p-8 mb-6">
            <h1 className="text-3xl font-bold mb-2">{order.title}</h1>

            <span className="px-3 py-1 rounded-full text-xs capitalize bg-slate-100">
              {order.status}
            </span>

            <p className="text-slate-700 my-6">{order.description}</p>

            <div className="grid grid-cols-2 gap-4">
              <Info
                icon={<Package />}
                label="Quantity"
                value={order.quantity}
              />
              <Info
                icon={<DollarSign />}
                label="Budget"
                value={`$${order.budgetMin} - $${order.budgetMax}`}
              />
              <Info
                icon={<Calendar />}
                label="Deadline"
                value={new Date(order.deadline).toLocaleDateString()}
              />
              <Info
                icon={<MapPin />}
                label="Location"
                value={order.deliveryLocation || "—"}
              />
            </div>
          </div>

          {/* BIDS */}
          <div className="bg-white rounded-2xl border p-8">
            <h2 className="text-2xl font-bold mb-6">
              Bids Received ({bids.length})
            </h2>

            {bids.length === 0 ? (
              <p className="text-center text-slate-600">No bids yet</p>
            ) : (
              bids.map((bid) => (
                <div
                  key={bid._id}
                  className={`border rounded-xl p-6 mb-4 ${
                    order.selectedVendorId === bid.vendor._id
                      ? "border-green-500 bg-green-50"
                      : ""
                  }`}
                >
                  <h3 className="font-semibold">
                    {bid.vendor.companyName || bid.vendor.fullName}
                  </h3>

                  <div className="flex justify-between my-4">
                    <span>${bid.price}</span>
                    <span>{bid.productionTime} days</span>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={() =>
                        navigate(`/chat/${order._id}:${bid.vendor._id}`)
                      }
                      className="flex-1 border rounded-lg py-2 flex justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Chat
                    </button>

                    {order.status === "open" && !order.selectedVendorId && (
                      <button
                        onClick={() =>
                          acceptBid(order._id, bid._id, bid.vendor._id)
                        }
                        className="flex-1 bg-slate-900 text-white rounded-lg py-2"
                      >
                        Accept Bid
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <div className="bg-white rounded-2xl border p-6 sticky top-24">
            <Detail label="Category" value={order.category} />
            <Detail
              label="Posted"
              value={new Date(order.createdAt).toLocaleDateString()}
            />
            <Detail label="Bids" value={bids.length} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Small Components ---------- */

function Info({ icon, label, value }) {
  return (
    <div className="flex gap-3 text-slate-600">
      {icon}
      <div>
        <div className="text-sm">{label}</div>
        <div className="font-medium text-slate-900">{value}</div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex justify-between text-sm mb-2">
      <span className="text-slate-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}


Info.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

Detail.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
