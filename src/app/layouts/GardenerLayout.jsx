// src/app/layouts/GardenerLayout.jsx
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Home, MessageCircle, BookOpen, Store, Star, User, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function GardenerLayout() {
  const location         = useLocation();
  const navigate         = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => {
    if (path === "/gardener" && location.pathname === "/gardener") return true;
    if (path !== "/gardener" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    logout();
    navigate("/gardener/login");
  };

  const navItems = [
    { path: "/gardener",          label: "Home",                 icon: Home },
    { path: "/gardener/chatbot",  label: "Plant Care Assistant", icon: MessageCircle },
    { path: "/gardener/forum",    label: "Q&A Forum",            icon: MessageCircle },
    { path: "/gardener/guides",   label: "Plant Guides",         icon: BookOpen },
    { path: "/gardener/services", label: "Care Services",        icon: Store },
    { path: "/gardener/ratings",  label: "My Ratings",           icon: Star },
    { path: "/gardener/profile",  label: "Profile",              icon: User },
  ];

  return (
      <div className="min-h-screen bg-[#E8F5E9]">
        <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#4CAF50] rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl font-bold">🌿</span>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Rawda</h1>
                  <p className="text-sm text-gray-600">
                    {user?.name ? `Welcome, ${user.name}` : "Home Gardener"}
                  </p>
                </div>
              </div>
              <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </nav>

        <div className="flex pt-[73px]">
          <aside className="w-64 bg-white border-r border-gray-200 fixed left-0 bottom-0 top-[73px] overflow-y-auto">
            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                  <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          isActive(item.path)
                              ? "bg-[#4CAF50] text-white shadow-sm"
                              : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
              ))}
            </nav>
          </aside>

          <main className="flex-1 ml-64 p-8">
            <Outlet />
          </main>
        </div>
      </div>
  );
}