/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  User,
  Building,
  MapPin,
  Phone,
  Star,
  CheckCircle,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useAuth();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    company_name: "",
    bio: "",
    location: "",
    phone: "",
  });

  useEffect(() => {
    if (!profile) return;

    setFormData({
      full_name: profile.full_name || "",
      company_name: profile.company_name || "",
      bio: profile.bio || "",
      location: profile.location || "",
      phone: profile.phone || "",
    });
  }, [profile]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-slate-600 hover:text-slate-900 mb-6"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="bg-white rounded-2xl border p-8">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-slate-400" />
            </div>

            {editing ? (
              <input
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                className="text-center text-xl font-bold border rounded-lg px-3 py-2 w-full"
              />
            ) : (
              <h2 className="text-2xl font-bold">{profile.full_name}</h2>
            )}

            <div className="flex justify-center gap-2 text-slate-600 mt-1">
              <span className="capitalize">{profile.role}</span>
              {profile.verified && (
                <CheckCircle className="w-4 h-4 text-blue-500" />
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Info icon={Star} label="Rating" value={`${profile.rating || 0}/5`} />
            <Info
              icon={CheckCircle}
              label="Completed Orders"
              value={profile.total_orders || 0}
            />

            <EditableField
              editing={editing}
              icon={Building}
              value={formData.company_name}
              display={profile.company_name}
              placeholder="Company"
              onChange={(v) =>
                setFormData({ ...formData, company_name: v })
              }
            />

            <EditableField
              editing={editing}
              icon={MapPin}
              value={formData.location}
              display={profile.location}
              placeholder="Location"
              onChange={(v) =>
                setFormData({ ...formData, location: v })
              }
            />

            <EditableField
              editing={editing}
              icon={Phone}
              value={formData.phone}
              display={profile.phone}
              placeholder="Phone"
              onChange={(v) =>
                setFormData({ ...formData, phone: v })
              }
            />
          </div>

          <div className="mt-6 space-y-2">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="w-full border py-3 rounded-xl"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="w-full bg-slate-900 text-white py-3 rounded-xl"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border p-8">
            <h3 className="text-xl font-bold mb-4">About</h3>
            {editing ? (
              <textarea
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                rows={6}
                className="w-full border rounded-xl px-4 py-3"
              />
            ) : (
              <p className="text-slate-600">
                {profile.bio || "No bio added yet."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */

function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5 text-slate-400" />
      <div>
        <div className="text-sm text-slate-500">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}

function EditableField({
  editing,
  icon: Icon,
  value,
  display,
  placeholder,
  onChange,
}) {
  if (editing) {
    return (
      <div>
        <Icon className="w-5 h-5 text-slate-400 mb-2" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>
    );
  }

  if (!display) return null;

  return (
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5 text-slate-400" />
      <div>
        <div className="text-sm text-slate-500">{placeholder}</div>
        <div className="font-medium">{display}</div>
      </div>
    </div>
  );
}
