import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5050/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: username,
          password: password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid email/password");
        setIsLoading(false);
        return;
      }

      if (data.user.role !== "admin") {
        setError("Access denied. Admin only.");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      showToast("Login Successfully");

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);

    } catch (err) {
      setError("Server error. Make sure backend is running.");
    }

    setIsLoading(false);
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <span className="text-2xl">🛡️</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Rawda Admin Panel</h1>
            <p className="text-gray-600">Secure administrator access</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">

            <form onSubmit={handleLogin} className="space-y-5">

              {/* Email */}
              <div>
                <label className="text-sm text-gray-700 block mb-1">Email</label>
                <input
                    type="email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    required
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-sm text-gray-700 block mb-1">Password</label>
                <div className="relative">
                  <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                      required
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg text-center">
                    {error}
                  </div>
              )}

              {/* Login Button */}
              <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:bg-gray-300"
              >
                {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Logging in...
                    </>
                ) : (
                    "Login"
                )}
              </button>

              {/* ✅ BACK BUTTON (what you wanted) */}
              <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                ← Back to Main App
              </button>

            </form>

            {/* Info */}
            <div className="mt-6 pt-4 border-t text-center text-sm text-gray-500">
              <p>Use your MongoDB account</p>
            </div>
          </div>
        </div>

        {/* Toast */}
        {toast && (
            <div className="fixed top-6 right-6 bg-green-600 text-white px-5 py-2 rounded-lg shadow">
              ✓ {toast}
            </div>
        )}
      </div>
  );
}