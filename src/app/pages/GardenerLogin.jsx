import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function GardenerLogin() {
  const navigate  = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
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
      const user = await login(email, password);
      if (user.role !== "gardener") {
        setError("This portal is for gardeners only.");
        setIsLoading(false);
        return;
      }
      setToast("Login Successful");
      setTimeout(() => navigate("/gardener"), 800);
    } catch (err) {
      setError(err.message || "Invalid email or password");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#4CAF50] to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl">🏡</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gardener Portal</h1>
          <p className="text-gray-600">Sign in to your plant care companion</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="gardener@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                  required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm text-center">{error}</p>
              </div>
            )}
            <button type="submit" disabled={isLoading}
              className="w-full px-6 py-3 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] disabled:bg-gray-300 transition-colors font-medium flex items-center justify-center gap-2">
              {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" />Signing in...</> : "Sign In"}
            </button>
          </form>
          <div className="mt-6 text-center">
            <button onClick={() => navigate("/")} className="text-sm text-gray-600 hover:text-[#4CAF50]">
              ← Back to Role Selection
            </button>
          </div>
        </div>
      </div>
      {toast && (
        <div className="fixed top-8 right-8 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          ✓ {toast}
        </div>
      )}
    </div>
  );
}
