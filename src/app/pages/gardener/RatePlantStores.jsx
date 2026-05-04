// src/app/pages/gardener/RatePlantStores.jsx
import { useState } from "react";
import { ArrowLeft, Star } from "lucide-react";
import { Link } from "react-router";

export default function RatePlantStores() {
  const [selectedOrder, setSelectedOrder]   = useState(null);
  const [rating, setRating]                 = useState(0);
  const [hoveredRating, setHoveredRating]   = useState(0);
  const [selectedTags, setSelectedTags]     = useState([]);
  const [reviewText, setReviewText]         = useState("");
  const [toast, setToast]                   = useState(null);
  const [error, setError]                   = useState(null);
  const [submittedOrders, setSubmittedOrders] = useState([]);

  const [orders] = useState([
    { id: "1", storeName: "Green Haven Plant Care", service: "Plant Care Consultation", date: "Feb 25, 2026", status: "completed", hasReview: false },
    { id: "2", storeName: "Urban Jungle Services",  service: "Plant Repotting",         date: "Feb 20, 2026", status: "completed", hasReview: true  },
    { id: "3", storeName: "Plant Doctor Mobile",    service: "Pest Control Treatment",  date: "Feb 15, 2026", status: "completed", hasReview: false },
    { id: "4", storeName: "Green Haven Plant Care", service: "Watering Service",        date: "March 5, 2026",status: "pending",   hasReview: false },
  ]);

  const tags = ["Fast Service", "Professional", "Friendly Staff", "Affordable", "Great Results", "On Time", "Knowledgeable", "Would Recommend"];

  const toggleTag = (tag) => {
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const handleSubmitReview = () => {
    setError(null);
    if (!selectedOrder) return;
    if (selectedOrder.status !== "completed") { setError("You can only review completed services."); return; }
    if (rating === 0) { setError("Please select a rating."); return; }

    // Mark order as reviewed locally
    setSubmittedOrders((prev) => [...prev, selectedOrder.id]);
    showToast("Thanks for your review! ⭐");

    setTimeout(() => {
      setSelectedOrder(null);
      setRating(0);
      setSelectedTags([]);
      setReviewText("");
    }, 1500);
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const completedOrders = orders.filter((order) => order.status === "completed");

  const ratingLabels = { 1: "Poor", 2: "Fair", 3: "Good", 4: "Very Good", 5: "Excellent" };

  return (
      <div className="max-w-4xl mx-auto">
        <Link to="/gardener" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" /><span>Back to Home</span>
        </Link>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Rate Plant Stores</h1>
          <p className="text-gray-600">Share your experience with completed services</p>
        </div>

        {!selectedOrder ? (
            <div className="space-y-4">
              {completedOrders.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <p className="text-gray-600">No completed orders to review.</p>
                  </div>
              ) : (
                  completedOrders.map((order) => {
                    const isReviewed = order.hasReview || submittedOrders.includes(order.id);
                    return (
                        <div key={order.id} className="bg-white rounded-xl shadow-sm p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">{order.storeName}</h3>
                              <p className="text-gray-600 mb-2">{order.service}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>{order.date}</span>
                                <span className={`px-3 py-1 text-xs rounded-full ${
                                    order.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                                {isReviewed && (
                                    <span className="flex items-center gap-1 text-yellow-600">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />Reviewed
                          </span>
                                )}
                              </div>
                            </div>
                            {isReviewed ? (
                                <button disabled className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed">Reviewed</button>
                            ) : (
                                <button onClick={() => setSelectedOrder(order)}
                                        className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors">
                                  Write Review
                                </button>
                            )}
                          </div>
                        </div>
                    );
                  })
              )}
            </div>
        ) : (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Review Service</h2>
                <p className="text-gray-600">{selectedOrder.storeName}</p>
                <p className="text-sm text-gray-500">{selectedOrder.service} • {selectedOrder.date}</p>
              </div>

              {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
              )}

              <div className="space-y-6">
                {/* Stars */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    How would you rate this service? <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setRating(star)}
                                onMouseEnter={() => setHoveredRating(star)} onMouseLeave={() => setHoveredRating(0)}
                                className="transition-transform hover:scale-110">
                          <Star className={`w-10 h-10 ${star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                        </button>
                    ))}
                  </div>
                  {rating > 0 && <p className="text-sm text-gray-600 mt-2 font-medium">{ratingLabels[rating]}</p>}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Select what describes your experience</label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <button key={tag} type="button" onClick={() => toggleTag(tag)}
                                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                                    selectedTags.includes(tag) ? "bg-[#4CAF50] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}>
                          {tag}
                        </button>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Write your review (optional)</label>
                  <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} rows={6}
                            placeholder="Share details about your experience..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent" />
                  <p className="text-xs text-gray-500 mt-2">Please keep your review respectful and constructive.</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button onClick={() => { setSelectedOrder(null); setRating(0); setSelectedTags([]); setReviewText(""); setError(null); }}
                          className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleSubmitReview}
                          className="flex-1 px-6 py-3 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors font-medium">
                    Submit Review
                  </button>
                </div>
              </div>
            </div>
        )}

        {toast && (
            <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in z-50">
              {toast}
            </div>
        )}
      </div>
  );
}