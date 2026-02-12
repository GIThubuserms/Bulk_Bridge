import { useState } from "react";
import { usePurchase } from "../../context/PurchaserContext.jsx";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
} from "lucide-react";

export default function CreateRequest() {
  const navigate = useNavigate();
  const { postOrder, loading, error } = usePurchase();

  const categories = [
    "Custom T-Shirts",
    "Uniforms",
    "Promotional Items",
    "Event Merchandise",
    "Corporate Gifts",
    "Packaging",
    "Printed Materials",
    "Other",
  ];
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    quantity: 1,
    budgetMin: "",
    budgetMax: "",
    deadline: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting:", formData); // <-- check form data
    try {
      const data = await postOrder(formData);
      console.log("Response:", data); // <-- check response
      navigate("/app/purchaser/dashboard");
    } catch (err) {
      console.log("Error:", err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate("/app/purchaser/dashboard")}
        className="flex items-center text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>
      <h2 className="text-3xl font-bold text-slate-900 mb-2">
        Create Purchase Request
      </h2>
      <p className="text-slate-600 mb-8">
        Provide detailed information about your order
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Order Title
          </label>
          <input
            name="title"
            placeholder="Order title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Order description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Minimum Budget
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                $
              </span>
              <input
                type="number"
                name="budgetMin"
                placeholder="Minimum Budget"
                value={formData.budgetMin}
                onChange={handleChange}
                required
                className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Maximum Budget
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                $
              </span>
              <input
                type="number"
                name="budgetMax"
                placeholder="Maximum Budget"
                value={formData.budgetMax}
                onChange={handleChange}
                required
                className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Order"}
          </button>
        </div>

        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
