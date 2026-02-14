import { useEffect, useState } from "react";
import { Plus, Package, Clock, CheckCircle, X } from "lucide-react";
// import { useAuth } from "../../contexts/AuthContext";
import { usePurchase } from "../../context/PurchaserContext.jsx";
import { useNavigate } from "react-router-dom";

export default function PurchaserDashboard() {
  const { getMyOrders } = usePurchase();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getMyOrders();
      setOrders(data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((o) => o.status === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-700";
      case "In Progress":
        return "bg-amber-100 text-amber-700";
      case "completed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return <Package className="w-4 h-4" />;
      case "In Progress":
        return <Clock className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <X className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Manage your bulk order requests
          </p>
        </div>
        <button
          onClick={() => navigate("../create-request")}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800"
        >
          <Plus className="w-5 h-5" />
          New Request
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "All", value: "all" },
          { label: "Open", value: "open" },
          { label: "In Progress", value: "In Progress" },
          { label: "Completed", value: "completed" },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => setFilter(item.value)}
            className={`p-4 rounded-xl border-2 ${
              filter === item.value
                ? "border-slate-900 bg-slate-50"
                : "border-slate-200"
            }`}
          >
            <div className="text-2xl font-bold">
              {item.value === "all"
                ? orders.length
                : orders.filter((o) => o.status === item.value).length}
            </div>
            <div className="text-sm text-slate-600">{item.label}</div>
          </button>
        ))}
      </div>

      {/* Orders */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold">No orders found</h3>
          <p className="text-slate-600 mb-6">
            Create your first bulk order request
          </p>
          <button
            onClick={() => navigate("../create-request")}
            className="bg-slate-900 text-white px-6 py-3 rounded-xl"
          >
            Create Request
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <button
              key={order._id}
              onClick={() =>
                navigate(`../request/${order._id}`)
              }
              className="bg-white border rounded-xl p-6 text-left hover:shadow"
            >
              <div className="flex justify-between mb-4">
                <h3 className="text-xl font-semibold">{order.title}</h3>
                <span
                  className={`px-3 py-1 rounded-full flex items-center gap-1 text-xs ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>
              </div>

              <p className="text-slate-600 mb-4 line-clamp-2">
                {order.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-slate-500">Category</div>
                  <div className="font-medium">{order.category}</div>
                </div>
                <div>
                  <div className="text-slate-500">Quantity</div>
                  <div className="font-medium">{order.quantity}</div>
                </div>
                <div>
                  <div className="text-slate-500">Budget</div>
                  <div className="font-medium">
                    ${order.budgetMin} - ${order.budgetMax}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Deadline</div>
                  <div className="font-medium">
                    {new Date(order.deadline).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

