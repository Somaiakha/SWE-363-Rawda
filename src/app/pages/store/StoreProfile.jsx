import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Save, X, MapPin, Phone, Mail, Building } from "lucide-react";

export default function StoreProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    storeName: "",
    email: "",
    phone: "",
    location: "",
    about: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchStore();
  }, []);

  const fetchStore = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/stores");

      if (res.data) {
        setFormData({
          storeName: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          location: res.data.location || "",
          about: res.data.about || "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.storeName.trim()) newErrors.storeName = "Store name required";
    if (!formData.email.trim()) newErrors.email = "Email required";
    if (!formData.phone.trim()) newErrors.phone = "Phone required";
    if (!formData.location.trim()) newErrors.location = "Location required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await axios.put("http://localhost:5050/api/stores", {
        name: formData.storeName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        about: formData.about,
      });

      await fetchStore();

      showToast("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.log(error);
      showToast("Update failed");
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Store Profile</h1>
        <p className="text-gray-600">Manage your store information</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b">
          <div className="w-24 h-24 bg-orange-500 rounded-xl flex items-center justify-center text-4xl">
            🏪
          </div>

          <div className="flex-1">
            {isEditing ? (
              <input
                value={formData.storeName}
                onChange={(e) =>
                  setFormData({ ...formData, storeName: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg text-2xl font-bold"
              />
            ) : (
              <h2 className="text-2xl font-bold">{formData.storeName}</h2>
            )}
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg"
            >
              <Edit className="w-4 h-4 inline mr-2" />
              Edit
            </button>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <label className="font-medium flex gap-2 mb-2">
              <Mail className="w-4 h-4" /> Email
            </label>
            <input
              disabled={!isEditing}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border px-4 py-2 rounded-lg"
            />
          </div>

          <div>
            <label className="font-medium flex gap-2 mb-2">
              <Phone className="w-4 h-4" /> Phone
            </label>
            <input
              disabled={!isEditing}
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full border px-4 py-2 rounded-lg"
            />
          </div>

          <div>
            <label className="font-medium flex gap-2 mb-2">
              <MapPin className="w-4 h-4" /> Location
            </label>
            <input
              disabled={!isEditing}
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full border px-4 py-2 rounded-lg"
            />
          </div>

          <div>
            <label className="font-medium flex gap-2 mb-2">
              <Building className="w-4 h-4" /> About
            </label>
            <textarea
              rows="4"
              disabled={!isEditing}
              value={formData.about}
              onChange={(e) =>
                setFormData({ ...formData, about: e.target.value })
              }
              className="w-full border px-4 py-2 rounded-lg"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 border py-2 rounded-lg"
            >
              <X className="w-4 h-4 inline mr-2" />
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="flex-1 bg-orange-600 text-white py-2 rounded-lg"
            >
              <Save className="w-4 h-4 inline mr-2" />
              Save
            </button>
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-8 right-8 bg-black text-white px-5 py-3 rounded-lg">
          {toast}
        </div>
      )}
    </div>
  );
}