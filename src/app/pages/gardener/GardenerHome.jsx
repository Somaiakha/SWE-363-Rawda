// src/app/pages/gardener/GardenerHome.jsx
import { Link } from "react-router";
import { MessageCircle, HelpCircle, BookOpen, Store, TrendingUp } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

export default function GardenerHome() {
  const { user } = useAuth();

  const quickActions = [
    {
      title: "Plant Care Assistant",
      description: "Get instant help with your plant questions",
      icon: MessageCircle,
      color: "bg-green-100 text-green-600",
      path: "/gardener/chatbot",
    },
    {
      title: "Ask Community",
      description: "Post questions to expert gardeners",
      icon: HelpCircle,
      color: "bg-blue-100 text-blue-600",
      path: "/gardener/forum",
    },
    {
      title: "Browse Guides",
      description: "Learn from our comprehensive plant guides",
      icon: BookOpen,
      color: "bg-purple-100 text-purple-600",
      path: "/gardener/guides",
    },
    {
      title: "Find Services",
      description: "Get help from nearby plant care experts",
      icon: Store,
      color: "bg-orange-100 text-orange-600",
      path: "/gardener/services",
    },
  ];

  const recentActivity = [
    { text: "New guide: Winter Plant Care Tips", time: "2 hours ago" },
    { text: "Your question received 3 new answers", time: "5 hours ago" },
    { text: "Expert responded to your post", time: "1 day ago" },
  ];

  return (
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Welcome back, {user?.name || "Gardener"}! 🌱
          </h2>
          <p className="text-gray-600">Your plants are waiting for your care. What would you like to do today?</p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action) => (
              <Link
                  key={action.title}
                  to={action.path}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Plants Stats */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">My Plants</h3>
              <span className="text-2xl">🪴</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Plants</span>
                <span className="font-semibold text-gray-900">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Need Watering</span>
                <span className="font-semibold text-orange-600">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Healthy</span>
                <span className="font-semibold text-green-600">9</span>
              </div>
            </div>
          </div>

          {/* Community Activity */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Community</h3>
              <TrendingUp className="w-5 h-5 text-[#4CAF50]" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Questions Asked</span>
                <span className="font-semibold text-gray-900">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Answers Received</span>
                <span className="font-semibold text-blue-600">18</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Guides Saved</span>
                <span className="font-semibold text-purple-600">7</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                  <div key={index} className="border-l-2 border-[#4CAF50] pl-3">
                    <p className="text-sm text-gray-900">{activity.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
              ))}
            </div>
          </div>
        </div>

        {/* Daily Tip */}
        <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-start gap-4">
            <span className="text-3xl">💡</span>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Daily Tip</h3>
              <p className="text-gray-700">
                Water your plants early in the morning to reduce water loss from evaporation and help prevent fungal diseases.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}
