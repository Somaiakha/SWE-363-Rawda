import { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { Search, Filter, History, Clock, CheckCircle, XCircle, Eye, Loader2 } from "lucide-react";

const API = "http://localhost:5050/api";

function authHeaders() {
  const token = localStorage.getItem("token");
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

export default function ReviewAnswers() {
  const [activeTab, setActiveTab] = useState("Pending");
  const [pendingReviews, setPendingReviews] = useState([]);
  const [historyReviews, setHistoryReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState("approve");
  const [feedbackNote, setFeedbackNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchGuides = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/guides`, { headers: authHeaders() });
      const guides = await res.json();
      setPendingReviews(guides.filter((g) => g.approvalStatus === "Pending"));
      setHistoryReviews(guides.filter((g) => g.approvalStatus !== "Pending"));
    } catch {
      showToast("Failed to load submissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGuides(); }, []);

  const handleAction = (review, type) => {
    setSelectedReview(review);
    setActionType(type);
    setShowDetailModal(false);
    setShowActionModal(true);
  };

  const confirmAction = async () => {
    if (!selectedReview) return;
    setSubmitting(true);
    const newStatus = actionType === "approve" ? "Approved" : "Rejected";
    try {
      const res = await fetch(`${API}/guides/${selectedReview._id}/status`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ approvalStatus: newStatus, feedbackNote }),
      });
      if (!res.ok) throw new Error();
      showToast(`Submission ${newStatus.toLowerCase()} successfully.`);
      setShowActionModal(false);
      setSelectedReview(null);
      setFeedbackNote("");
      await fetchGuides();
    } catch {
      showToast("Failed to update submission. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPending = pendingReviews.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusBadge = (status) => {
    const map = {
      Approved: "bg-green-100 text-green-700",
      Rejected: "bg-red-100 text-red-700",
      Revision: "bg-yellow-100 text-yellow-700",
    };
    return map[status] || "bg-gray-100 text-gray-700";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const diff = Math.floor((Date.now() - d) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Review Submissions</h1>
          <p className="text-gray-500 mt-1">Review content from other experts and community members.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 w-full md:w-64"
            />
          </div>
          <Button variant="outline" className="border-gray-200 text-gray-700 gap-2">
            <Filter size={16} /> Filter
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("Pending")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "Pending" ? "border-[#4CAF50] text-[#2E7D32] bg-green-50/50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
          >
            <Clock size={16} /> Pending ({pendingReviews.length})
          </button>
          <button
            onClick={() => setActiveTab("History")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "History" ? "border-[#4CAF50] text-[#2E7D32] bg-green-50/50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
          >
            <History size={16} /> History ({historyReviews.length})
          </button>
        </div>

        <div className="p-6 space-y-3">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            </div>
          ) : activeTab === "Pending" ? (
            filteredPending.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No pending reviews found.</p>
            ) : (
              filteredPending.map((review) => (
                <div key={review._id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{review.title}</p>
                    <span className="text-xs text-gray-400">
                      {formatDate(review.createdAt)} · {review.category || "Guide"} · by {review.submittedBy}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setSelectedReview(review); setShowDetailModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleAction(review, "approve")} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleAction(review, "reject")} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )
          ) : (
            historyReviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No review history yet.</p>
            ) : (
              historyReviews.map((review) => (
                <div key={review._id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{review.title}</p>
                    <span className="text-xs text-gray-400">
                      {formatDate(review.updatedAt)} · {review.category || "Guide"} · by {review.submittedBy}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusBadge(review.approvalStatus)}`}>
                    {review.approvalStatus}
                  </span>
                </div>
              ))
            )
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-center">
          <Button variant="ghost" className="text-gray-500 text-sm">Load More</Button>
        </div>
      </div>

      {showDetailModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Submission Details</h3>
            <div className="space-y-3 mb-6">
              <p><span className="font-medium">Title:</span> {selectedReview.title}</p>
              <p><span className="font-medium">Category:</span> {selectedReview.category}</p>
              <p><span className="font-medium">Submitted by:</span> {selectedReview.submittedBy}</p>
              <p><span className="font-medium">Submitted:</span> {formatDate(selectedReview.createdAt)}</p>
              <p><span className="font-medium">Status:</span> {selectedReview.approvalStatus}</p>
              {selectedReview.content && (
                <div>
                  <p className="font-medium mb-1">Content:</p>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded p-3 max-h-40 overflow-y-auto">{selectedReview.content}</p>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDetailModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Close</button>
              <button onClick={() => handleAction(selectedReview, "reject")} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Reject</button>
              <button onClick={() => handleAction(selectedReview, "approve")} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Approve</button>
            </div>
          </div>
        </div>
      )}

      {showActionModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {actionType === "approve" ? "Approve Submission" : "Reject Submission"}
            </h3>
            <p className="text-gray-600 mb-4">
              {actionType === "approve"
                ? "Approve this submission and make it visible to users?"
                : "Reject this submission and notify the author?"}
            </p>
            {actionType === "reject" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Feedback (Optional)</label>
                <textarea
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                  rows={3}
                  placeholder="Provide feedback to the author..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setShowActionModal(false); setFeedbackNote(""); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                disabled={submitting}
                className={`flex-1 px-4 py-2 text-white rounded-lg flex items-center justify-center gap-2 ${actionType === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"} disabled:opacity-60`}
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
