// src/app/pages/gardener/GardenerProfile.jsx
import { useState, useEffect } from "react";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import { usersAPI } from "../../../api/api";

export default function GardenerProfile() {
  const { user, updateUser } = useAuth();

  const [isEditing, setIsEditing]       = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast]               = useState(null);
  const [isSaving, setIsSaving]         = useState(false);
  const [errors, setErrors]             = useState({});
  const [formData, setFormData]         = useState({
    name: "", email: "", phone: "",
    password: "", confirmPassword: "",
    notifications: true,
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name:          user.name  || "",
        email:         user.email || "",
        phone:         user.phone || "",
        notifications: user.notifications ?? true,
      }));
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateEmail    = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const validatePhone    = (v) => /^\+?[\d\s\-()]{10,}$/.test(v);
  const validatePassword = (v) =>
      v.length >= 8 && /[A-Z]/.test(v) && /[a-z]/.test(v) && /[0-9]/.test(v);

  const handleSave = async () => {
    const newErrors = {};
    if (!formData.email)                  newErrors.email = "Email is required";
    else if (!validateEmail(formData.email)) newErrors.email = "Please enter a valid email address";
    if (!formData.phone)                  newErrors.phone = "Phone number is required";
    else if (!validatePhone(formData.phone)) newErrors.phone = "Please enter a valid phone number";
    if (formData.password) {
      if (!validatePassword(formData.password))
        newErrors.password = "Password must be at least 8 characters with uppercase, lowercase, and number";
      else if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setIsSaving(true);
    try {
      const payload = {
        name: formData.name, email: formData.email,
        phone: formData.phone, notifications: formData.notifications,
        ...(formData.password ? { password: formData.password } : {}),
      };
      const updated = await usersAPI.update(user._id, payload);
      updateUser({ name: updated.user.name, email: updated.user.email });
      setIsEditing(false);
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      showToast("Profile updated successfully.");
    } catch (err) {
      showToast(err.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  return (
      <div className="max-w-4xl mx-auto">
        <Link to="/gardener" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" /><span>Back to Home</span>
        </Link>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">Profile Settings</h1>
              <p className="text-gray-600">Manage your account information and preferences</p>
            </div>
            {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors">
                  Edit Profile
                </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Avatar */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="w-24 h-24 bg-[#4CAF50] rounded-full flex items-center justify-center text-white text-3xl font-semibold">
              {formData.name.charAt(0) || "?"}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{formData.name}</h3>
              <p className="text-gray-600 mb-3">Home Gardener</p>
              {isEditing && <button className="text-sm text-[#4CAF50] hover:text-[#45a049] font-medium">Change Photo</button>}
            </div>
          </div>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
              <input type="text" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} disabled={!isEditing}
                     className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] ${!isEditing ? "bg-gray-50 text-gray-600" : ""}`} />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
              <input type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} disabled={!isEditing}
                     className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] ${!isEditing ? "bg-gray-50 text-gray-600 border-gray-300" : errors.email ? "border-red-500" : "border-gray-300"}`} />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
              <input type="tel" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} disabled={!isEditing}
                     className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] ${!isEditing ? "bg-gray-50 text-gray-600 border-gray-300" : errors.phone ? "border-red-500" : "border-gray-300"}`} />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {isEditing && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password (leave blank to keep current)</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} value={formData.password}
                             onChange={(e) => handleInputChange("password", e.target.value)} placeholder="Enter new password"
                             className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] ${errors.password ? "border-red-500" : "border-gray-300"}`} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <input type={showPassword ? "text" : "password"} value={formData.confirmPassword}
                           onChange={(e) => handleInputChange("confirmPassword", e.target.value)} placeholder="Confirm new password"
                           className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`} />
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                </>
            )}

            {/* Notifications */}
            <div className="pt-6 border-t border-gray-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.notifications} onChange={(e) => handleInputChange("notifications", e.target.checked)}
                       disabled={!isEditing} className={`mt-1 w-5 h-5 text-[#4CAF50] border-gray-300 rounded focus:ring-[#4CAF50] ${!isEditing ? "opacity-60" : ""}`} />
                <div>
                  <span className="font-medium text-gray-900">Email Notifications</span>
                  <p className="text-sm text-gray-600">Receive updates about your plants, questions, and services</p>
                </div>
              </label>
            </div>

            {isEditing && (
                <div className="flex gap-3 pt-6">
                  <button onClick={() => { setIsEditing(false); setErrors({}); }} disabled={isSaving}
                          className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={isSaving}
                          className="flex-1 px-6 py-3 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50">
                    {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : "Save Changes"}
                  </button>
                </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Danger Zone</h3>
            <Link to="/gardener/delete-account" className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
              Delete Account
            </Link>
          </div>
        </div>

        {toast && (
            <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in z-50">
              {toast}
            </div>
        )}
      </div>
  );
}