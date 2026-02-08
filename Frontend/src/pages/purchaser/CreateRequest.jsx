// import { useState } from 'react';
// import PropTypes from 'prop-types';
// import { useAuth } from '../../contexts/AuthContext';
// import { supabase } from '../../lib/supabase';
// import { ArrowLeft } from 'lucide-react';

// const categories = [
//   'Custom T-Shirts',
//   'Uniforms',
//   'Promotional Items',
//   'Event Merchandise',
//   'Corporate Gifts',
//   'Packaging',
//   'Printed Materials',
//   'Other',
// ];

// export default function CreateRequest({ onNavigate }) {
//   const { profile } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     category: '',
//     quantity: '',
//     budget_min: '',
//     budget_max: '',
//     deadline: '',
//     delivery_location: '',
//     special_requirements: '',
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!profile) return;

//     setLoading(true);
//     try {
//       const { error } = await supabase.from('requests').insert({
//         purchaser_id: profile.id,
//         title: formData.title,
//         description: formData.description,
//         category: formData.category,
//         quantity: parseInt(formData.quantity, 10),
//         budget_min: parseInt(formData.budget_min, 10),
//         budget_max: parseInt(formData.budget_max, 10),
//         deadline: formData.deadline,
//         delivery_location: formData.delivery_location,
//         special_requirements: formData.special_requirements,
//         design_files: [],
//         status: 'open',
//       });

//       if (error) throw error;

//       onNavigate('dashboard');
//     } catch (error) {
//       console.error('Error creating request:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <button
//         onClick={() => onNavigate('dashboard')}
//         className="flex items-center text-slate-600 hover:text-slate-900 mb-6 transition-colors"
//       >
//         <ArrowLeft className="w-4 h-4 mr-2" />
//         Back to Dashboard
//       </button>

//       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
//         <h1 className="text-3xl font-bold text-slate-900 mb-2">
//           Create Bulk Order Request
//         </h1>
//         <p className="text-slate-600 mb-8">
//           Provide detailed information about your bulk order needs
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Request Title
//             </label>
//             <input
//               type="text"
//               value={formData.title}
//               onChange={(e) =>
//                 setFormData({ ...formData, title: e.target.value })
//               }
//               required
//               className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Category
//             </label>
//             <select
//               value={formData.category}
//               onChange={(e) =>
//                 setFormData({ ...formData, category: e.target.value })
//               }
//               required
//               className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
//             >
//               <option value="">Select a category</option>
//               {categories.map((cat) => (
//                 <option key={cat} value={cat}>
//                   {cat}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-2">
//               Description
//             </label>
//             <textarea
//               rows={4}
//               value={formData.description}
//               onChange={(e) =>
//                 setFormData({ ...formData, description: e.target.value })
//               }
//               required
//               className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <input
//               type="number"
//               placeholder="Quantity"
//               min="1"
//               value={formData.quantity}
//               onChange={(e) =>
//                 setFormData({ ...formData, quantity: e.target.value })
//               }
//               required
//               className="px-4 py-3 border border-slate-300 rounded-xl"
//             />

//             <input
//               type="date"
//               min={new Date().toISOString().split('T')[0]}
//               value={formData.deadline}
//               onChange={(e) =>
//                 setFormData({ ...formData, deadline: e.target.value })
//               }
//               required
//               className="px-4 py-3 border border-slate-300 rounded-xl"
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <input
//               type="number"
//               placeholder="Budget Min"
//               value={formData.budget_min}
//               onChange={(e) =>
//                 setFormData({ ...formData, budget_min: e.target.value })
//               }
//               required
//               className="px-4 py-3 border border-slate-300 rounded-xl"
//             />

//             <input
//               type="number"
//               placeholder="Budget Max"
//               value={formData.budget_max}
//               onChange={(e) =>
//                 setFormData({ ...formData, budget_max: e.target.value })
//               }
//               required
//               className="px-4 py-3 border border-slate-300 rounded-xl"
//             />
//           </div>

//           <input
//             type="text"
//             placeholder="Delivery Location"
//             value={formData.delivery_location}
//             onChange={(e) =>
//               setFormData({ ...formData, delivery_location: e.target.value })
//             }
//             required
//             className="w-full px-4 py-3 border border-slate-300 rounded-xl"
//           />

//           <textarea
//             rows={3}
//             placeholder="Special Requirements (Optional)"
//             value={formData.special_requirements}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 special_requirements: e.target.value,
//               })
//             }
//             className="w-full px-4 py-3 border border-slate-300 rounded-xl"
//           />

//           <div className="flex justify-end gap-4 pt-6 border-t">
//             <button
//               type="button"
//               onClick={() => onNavigate('dashboard')}
//               className="px-6 py-3 border rounded-xl"
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               disabled={loading}
//               className="px-6 py-3 bg-slate-900 text-white rounded-xl disabled:opacity-50"
//             >
//               {loading ? 'Creating...' : 'Create Request'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// CreateRequest.propTypes = {
//   onNavigate: PropTypes.func.isRequired,
// };



function CreateRequest() {
  return (
    <div>
      
      <h1>CREATE REQUEST</h1>
    </div>
  )
}

export default CreateRequest
