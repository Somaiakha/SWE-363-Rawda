import { useEffect, useState } from "react";
import { Star, Trash2, CheckCircle, Filter } from "lucide-react";

export default function StoreReviews() {
  const [filterType, setFilterType] = useState("all");
  const [toast, setToast] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5050/api"}/reviews`);
    const data = await res.json();

    const formatted = data.map((r) => ({
      id: r._id,
      storeName: r.storeName,
      rating: r.rating,
      reviewer: r.reviewer,
      date: r.createdAt
          ? new Date(r.createdAt).toLocaleDateString()
          : "N/A",
      text: r.text,
      verified: r.verified,
      flagged: r.flagged,
    }));

    setReviews(formatted);
  };

  const toggleVerified = async (id, currentVerified) => {
    await fetch(`http://localhost:5050/api/reviews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        verified: !currentVerified,
        flagged: false,
      }),
    });

    fetchReviews();
    showToast("Review updated");
  };

  const removeReview = async (id) => {
    await fetch(`http://localhost:5050/api/reviews/${id}`, {
      method: "DELETE",
    });

    fetchReviews();
    showToast("Review removed");
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredReviews = reviews.filter((review) => {
    if (filterType === "verified") return review.verified;
    if (filterType === "flagged") return review.flagged;
    if (filterType === "low") return review.rating <= 2;
    return true;
  });

  return (
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Store Ratings & Reviews
          </h1>
          <p className="text-gray-600">
            Manage and moderate plant store reviews
          </p>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Reviews</option>
              <option value="verified">Verified Only</option>
              <option value="flagged">Flagged Reviews</option>
              <option value="low">Low Ratings (≤2 stars)</option>
            </select>
          </div>
        </div>

        {/* Reviews */}
        <div className="space-y-4">
          {filteredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between">

                  <div>
                    <h3 className="font-semibold">{review.storeName}</h3>

                    <div className="flex gap-1 mt-1">
                      {[1,2,3,4,5].map((star) => (
                          <Star
                              key={star}
                              className={`w-4 h-4 ${
                                  star <= review.rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                              }`}
                          />
                      ))}
                    </div>

                    <p className="mt-2">{review.text}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      By {review.reviewer} • {review.date}
                    </p>

                    {review.flagged && (
                        <span className="text-red-600 text-xs">Flagged</span>
                    )}

                    {review.verified && (
                        <span className="text-green-600 text-xs ml-2">Verified</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                        onClick={() =>
                            toggleVerified(review.id, review.verified)
                        }
                    >
                      <CheckCircle className="text-green-600" />
                    </button>

                    <button onClick={() => removeReview(review.id)}>
                      <Trash2 className="text-red-600" />
                    </button>
                  </div>

                </div>
              </div>
          ))}
        </div>

        {toast && (
            <div className="fixed bottom-8 right-8 bg-black text-white px-4 py-2 rounded">
              {toast}
            </div>
        )}
      </div>
  );
}