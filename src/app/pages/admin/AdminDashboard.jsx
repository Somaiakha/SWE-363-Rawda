import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Users,
  UserCheck,
  MessageSquare,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeExperts: 0,
    forumPosts: 0,
    pendingReviews: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5050/api"}/admin/stats`);
      const data = await res.json();
      setStats(data);
    } catch {
      console.error("Failed to fetch stats");
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5050/api"}/admin/recent-activity`);
      const data = await res.json();
      setRecentActivity(data);
    } catch {
      console.error("Failed to fetch recent activity");
    }
  };

  const statsCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Active Experts",
      value: stats.activeExperts,
      icon: UserCheck,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Forum Posts",
      value: stats.forumPosts,
      icon: MessageSquare,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Pending Reviews",
      value: stats.pendingReviews,
      icon: AlertCircle,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  const pendingItems = [
    {
      title: "Expert Applications",
      count: 8,
      color: "text-green-600 bg-green-50",
      path: "/admin/experts",
    },
    {
      title: "Content Approvals",
      count: 15,
      color: "text-blue-600 bg-blue-50",
      path: "/admin/content",
    },
    {
      title: "Reported Posts",
      count: 3,
      color: "text-red-600 bg-red-50",
      path: "/admin/forum",
    },
    {
      title: "Review Flags",
      count: 12,
      color: "text-orange-600 bg-orange-50",
      path: "/admin/reviews",
    },
  ];

  return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600">
            Welcome back, Admin. Here's what's happening today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                      className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
          ))}
        </div>

        {/* Pending Items + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Items */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Pending Items
              </h2>

              <div className="space-y-3">
                {pendingItems.map((item) => (
                    <button
                        key={item.title}
                        onClick={() => navigate(item.path)}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                  <span className="text-sm font-medium text-gray-700">
                    {item.title}
                  </span>
                      <span
                          className={`px-3 py-1 ${item.color} rounded-full text-sm font-semibold`}
                      >
                    {item.count}
                  </span>
                    </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </h2>
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>

              <div className="space-y-4">
                {recentActivity.length === 0 ? (
                    <p className="text-sm text-gray-500">No recent activity yet.</p>
                ) : (
                    recentActivity.map((activity, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0"
                        >
                          <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">
                              {activity.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
