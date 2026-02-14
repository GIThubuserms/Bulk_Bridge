/* eslint-disable react/prop-types */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Package,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { useVendor } from "../../context/VendorContext.jsx";

export default function VendorRequestDetail() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { requests = [], connects, submitBid } = useVendor();
  const request = requests.find((r) => r._id === requestId);
  const [showBidForm, setShowBidForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [bidForm, setBidForm] = useState({
    price: "",
    production_time: "",
    price_breakdown: "",
    message: "",
  });

  if (!request) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-slate-600">Request not found</div>
      </div>
    );
  }

  const handleSubmitBid = async (e) => {
    e.preventDefault();

    if (!connects || connects.available < 1) {
      alert("Not enough connects");
      return;
    }

    setSubmitting(true);

    try {
      await submitBid(request._id,{
          totalPrice: Number(bidForm.price),
          productionTimeDays: Number(bidForm.production_time),
          price_breakdown: bidForm.price_breakdown,
          message: bidForm.message,
        },
      );

      alert("Bid submitted successfully");
      navigate("/app/vendor/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to submit bid");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </button>

       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{request.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-slate-600">
              <span>{request.purchaserId.username}</span>
              <span>•</span>
              <span>{request.createdAt}</span>
            </div>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {request.category}
          </span>
        </div>

        <p className="text-slate-700 mb-6">{request.description}</p>

        {/* Meta */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6 border-b pb-6">
          <Info icon={Package} label="Quantity" value={request.quantity} />
          <Info
            icon={DollarSign}
            label="Budget"
            value={`$${request.budgetMin} - $${request.budgetMax}`}
          />
          <Info
            icon={Calendar}
            label="Deadline"
            value={new Date(request.deadline).toLocaleDateString()}
          />
        </div>

        {/* Bid Section */}
        {!showBidForm ? (
          <>
            {connects && connects.available < 1 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="flex items-center mb-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 mr-2" />
                  <h3 className="font-semibold text-amber-900">
                    No Connects Available
                  </h3>
                </div>
                <button
                  onClick={() => navigate("/app/vendor/connects")}
                  className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg"
                >
                  Buy Connects
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowBidForm(true)}
                className="w-full py-3 bg-slate-900 text-white rounded-xl"
              >
                Submit Bid (1 Connect)
              </button>
            )}
          </>
        ) : (
          <form onSubmit={handleSubmitBid} className="space-y-6">
            <h3 className="text-xl font-bold">Submit Your Bid</h3>

            <input
              type="number"
              placeholder="Bid Amount"
              value={bidForm.price}
              onChange={(e) =>
                setBidForm({ ...bidForm, price: e.target.value })
              }
              required
              className="w-full px-4 py-3 border rounded-xl"
            />

            <input
              type="number"
              placeholder="Production Time (days)"
              value={bidForm.production_time}
              onChange={(e) =>
                setBidForm({
                  ...bidForm,
                  production_time: e.target.value,
                })
              }
              required
              className="w-full px-4 py-3 border rounded-xl"
            />

            <textarea
              placeholder="Price breakdown"
              value={bidForm.price_breakdown}
              onChange={(e) =>
                setBidForm({
                  ...bidForm,
                  price_breakdown: e.target.value,
                })
              }
              required
              className="w-full px-4 py-3 border rounded-xl"
            />

            <textarea
              placeholder="Message to purchaser"
              value={bidForm.message}
              onChange={(e) =>
                setBidForm({ ...bidForm, message: e.target.value })
              }
              required
              className="w-full px-4 py-3 border rounded-xl"
            />

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowBidForm(false)}
                className="flex-1 border px-6 py-3 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-slate-900 text-white px-6 py-3 rounded-xl"
              >
                {submitting ? "Submitting..." : "Submit Bid"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ------------------ */

function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center space-x-3">
      <Icon className="w-5 h-5 text-slate-400" />
      <div>
        <div className="text-sm text-slate-500">{label}</div>
        <div className="font-semibold">{value}</div>
      </div>
    </div>
  );
}
