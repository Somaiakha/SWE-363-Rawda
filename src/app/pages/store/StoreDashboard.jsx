import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  TrendingUp,
  Package,
  DollarSign,
  Star,
  Inbox,
  AlertCircle
} from "lucide-react";

export default function StoreDashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const p = await axios.get("http://localhost:5050/api/products");
      const s = await axios.get("http://localhost:5050/api/services");
      const r = await axios.get("http://localhost:5050/api/service-requests");

      setProducts(p.data);
      setServices(s.data);
      setRequests(r.data);
    } catch (error) {
      console.log(error);
    }
  };

  const pendingRequests = requests.filter(
    (item) => item.status === "Pending"
  ).length;

  const completedRequests = requests.filter(
    (item) => item.status === "Completed"
  ).length;

  const totalRevenue = completedRequests * 120;

  const lowStockProducts = products.filter(
    (item) => item.stock <= 5
  );

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      change: "+ Live Data",
      icon: Package,
      color: "bg-blue-100 text-blue-600"
    },
    {
      label: "Active Services",
      value: services.length,
      change: `${pendingRequests} pending`,
      icon: Inbox,
      color: "bg-green-100 text-green-600"
    },
    {
      label: "Average Rating",
      value: "4.8",
      change: "Customer reviews",
      icon: Star,
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      label: "Monthly Revenue",
      value: `$${totalRevenue}`,
      change: "Completed requests",
      icon: DollarSign,
      color: "bg-orange-100 text-orange-600"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Store Overview
        </h1>

        <p className="text-gray-600">
          Welcome back! Here's your store performance
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">

              <div
                className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
              >
                <stat.icon className="w-6 h-6" />
              </div>

              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </h3>

            <p className="text-sm text-gray-600 mb-1">
              {stat.label}
            </p>

            <p className="text-xs text-gray-500">
              {stat.change}
            </p>

          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Requests */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">

            <h2 className="text-lg font-semibold text-gray-900">
              Recent Service Requests
            </h2>

            <button
              onClick={() => navigate("/store/requests")}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              View All
            </button>

          </div>

          <div className="space-y-4">

            {requests.slice(0, 3).map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >

                <div>
                  <p className="font-medium text-gray-900">
                    {item.customerName}
                  </p>

                  <p className="text-sm text-gray-600">
                    {item.service}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {item.dates}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : item.status === "Accepted"
                      ? "bg-green-100 text-green-700"
                      : item.status === "Declined"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {item.status}
                </span>

              </div>
            ))}

          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-xl shadow-sm p-6">

          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-orange-600" />

            <h2 className="text-lg font-semibold text-gray-900">
              Low Stock Alert
            </h2>
          </div>

          <div className="space-y-4">

            {lowStockProducts.slice(0, 3).map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-3 border border-orange-200 bg-orange-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {item.name}
                  </p>

                  <p className="text-sm text-gray-600">
                    {item.category}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-orange-600">
                    {item.stock}
                  </p>

                  <p className="text-xs text-gray-500">
                    units left
                  </p>
                </div>
              </div>
            ))}

          </div>

          <button
            onClick={() => navigate("/store/products")}
            className="w-full mt-4 py-2 text-sm text-orange-600 hover:text-orange-700 font-medium border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
          >
            Manage Inventory
          </button>

        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl p-6 text-white shadow-sm">

        <h2 className="text-xl font-semibold mb-4">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <button
            onClick={() => navigate("/store/products")}
            className="p-4 rounded-xl bg-white/20 hover:bg-white/30 transition text-left"
          >
            <p className="font-semibold text-white">
              Add Product
            </p>

            <p className="text-sm text-orange-100 mt-1">
              Manage inventory items
            </p>
          </button>

          <button
            onClick={() => navigate("/store/services")}
            className="p-4 rounded-xl bg-white/20 hover:bg-white/30 transition text-left"
          >
            <p className="font-semibold text-white">
              Create Service
            </p>

            <p className="text-sm text-orange-100 mt-1">
              Add plant care service
            </p>
          </button>

          <button
            onClick={() => navigate("/store/requests")}
            className="p-4 rounded-xl bg-white/20 hover:bg-white/30 transition text-left"
          >
            <p className="font-semibold text-white">
              View Requests
            </p>

            <p className="text-sm text-orange-100 mt-1">
              {pendingRequests} pending requests
            </p>
          </button>

          <button
            onClick={() => navigate("/store/ratings")}
            className="p-4 rounded-xl bg-white/20 hover:bg-white/30 transition text-left"
          >
            <p className="font-semibold text-white">
              Check Reviews
            </p>

            <p className="text-sm text-orange-100 mt-1">
              Customer feedback
            </p>
          </button>

        </div>
      </div>

    </div>
  );
}