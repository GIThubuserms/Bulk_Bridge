/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  User,
  Building,
  MapPin,
  Phone,
  Star,
  CheckCircle,
  Briefcase,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const { profile, user } = useAuth();

  const isVendor = user?.role === "vendor";

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-slate-600 text-lg">Loading...</div>
      </div>
    );
  }

 const userData = isVendor ? profile?.user : profile;
const vendorData = isVendor ? profile?.vendor : null;
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-slate-600 hover:text-slate-900 mb-6"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SIDE */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-slate-400" />
            </div>

            <h2 className="text-2xl font-bold">
              {userData?.username || "User"}
            </h2>

            <div className="capitalize text-slate-500 mt-1 flex items-center justify-center gap-2">
              {user?.role}
              {isVendor && (
                <CheckCircle className="w-4 h-4 text-blue-500" />
              )}
            </div>
          </div>

          <div className="space-y-5">
            {/* Vendor Only Section */}
            {isVendor && vendorData && (
              <>
                <Info
                  icon={Building}
                  label="Business Name"
                  value={vendorData.bussinessname}
                />

                <Info
                  icon={Star}
                  label="Rating"
                  value={`${vendorData.Rating || 0}/5`}
                />

                <Info
                  icon={Briefcase}
                  label="Completed Orders"
                  value={vendorData.completeorders || 0}
                />

                <Info
                  icon={CheckCircle}
                  label="Connects"
                  value={vendorData.connects || 0}
                />
              </>
            )}

            {/* Shared Fields */}
            <Info
              icon={MapPin}
              label="Location"
              value="Lahore"
            />

            <Info
              icon={Phone}
              label="Phone"
              value="03002033010"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-4">About</h3>

            {isVendor ? (
              <p className="text-slate-600 leading-relaxed">
                {vendorData?.description || "No description provided."}
              </p>
            ) : (
              <p className="text-slate-600 leading-relaxed">
                {userData?.bio || "We all remain the same in  life :)"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Info Component ---------- */

function Info({ icon: Icon, label, value }) {
  if (!value) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
        <Icon className="w-4 h-4 text-slate-500" />
      </div>

      <div>
        <div className="text-sm text-slate-500">{label}</div>
        <div className="font-medium text-slate-900">{value}</div>
      </div>
    </div>
  );
}
