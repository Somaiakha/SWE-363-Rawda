// src/app/pages/gardener/QAForum.jsx
import { useState, useEffect } from "react";
import { ArrowLeft, Search, Plus, Heart, MessageCircle, Bookmark, TrendingUp, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import { questionsAPI } from "../../../api/api";

export default function QAForum() {
  const { user } = useAuth();

  const [questions, setQuestions]               = useState([]);
  const [isLoading, setIsLoading]               = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery]           = useState("");
  const [showPostModal, setShowPostModal]       = useState(false);
  const [toast, setToast]                       = useState(null);
  const [newTitle, setNewTitle]                 = useState("");
  const [newContent, setNewContent]             = useState("");
  const [newTags, setNewTags]                   = useState("");
  const [isPosting, setIsPosting]               = useState(false);

  const categories = [
    { id: "all",      label: "All Questions" },
    { id: "watering", label: "Watering" },
    { id: "pests",    label: "Pests & Diseases" },
    { id: "indoor",   label: "Indoor Plants" },
    { id: "outdoor",  label: "Outdoor Plants" },
    { id: "soil",     label: "Soil & Fertilizer" },
  ];

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (searchQuery)                params.search = searchQuery;
      if (selectedCategory !== "all") params.tag    = selectedCategory;
      const data = await questionsAPI.getAll(params);
      setQuestions(data);
    } catch {
      showToast("Failed to load questions.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchQuestions(); }, [selectedCategory]);

  const handleSearchKey = (e) => { if (e.key === "Enter") fetchQuestions(); };

  const handleLike = async (questionId) => {
    try {
      const res = await questionsAPI.like(questionId);
      setQuestions((prev) =>
          prev.map((q) => q._id === questionId ? { ...q, likes: res.likes } : q)
      );
    } catch { showToast("Failed to like."); }
  };

  const handleBookmark = async (questionId) => {
    try {
      const res = await questionsAPI.bookmark(questionId);
      setQuestions((prev) =>
          prev.map((q) =>
              q._id === questionId
                  ? { ...q, bookmarks: res.bookmarked
                        ? [...(q.bookmarks || []), user._id]
                        : (q.bookmarks || []).filter((id) => id !== user._id) }
                  : q
          )
      );
      showToast(res.bookmarked ? "Saved successfully." : "Bookmark removed.");
    } catch { showToast("Failed to bookmark."); }
  };

  const handleSubmitPost = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    setIsPosting(true);
    try {
      const tags    = newTags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
      const created = await questionsAPI.create({ title: newTitle, content: newContent, tags });
      setQuestions((prev) => [created, ...prev]);
      setShowPostModal(false);
      setNewTitle(""); setNewContent(""); setNewTags("");
      showToast("Question posted successfully!");
    } catch (err) {
      showToast(err.message || "Failed to post question.");
    } finally { setIsPosting(false); }
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const isBookmarked = (q) =>
      (q.bookmarks || []).map((id) => id.toString()).includes(user?._id?.toString());

  const formatTime = (dateStr) => {
    const diff  = Date.now() - new Date(dateStr).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days  = Math.floor(hours / 24);
    if (days  > 0) return `${days} day${days  > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return `${mins || 1} minute${mins > 1 ? "s" : ""} ago`;
  };

  return (
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link to="/gardener" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Q&A Forum</h1>
                <p className="text-sm text-gray-600">Ask questions and share knowledge with the community</p>
              </div>
            </div>
            <button onClick={() => setShowPostModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors">
              <Plus className="w-5 h-5" />Ask Question
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search questions... (press Enter)" value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleSearchKey}
                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent" />
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto">
            {categories.map((cat) => (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                            selectedCategory === cat.id ? "bg-[#4CAF50] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                  {cat.label}
                </button>
            ))}
          </div>
        </div>

        {/* Trending */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 mb-6 border border-orange-200">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <h2 className="font-semibold text-gray-900">Trending This Week</h2>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-700">🔥 How to prepare garden for winter</p>
            <p className="text-sm text-gray-700">🔥 Best low-light indoor plants</p>
            <p className="text-sm text-gray-700">🔥 Organic pest control methods</p>
          </div>
        </div>

        {/* Questions */}
        {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-[#4CAF50]" />
            </div>
        ) : questions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <p className="text-gray-500 mb-4">No questions found.</p>
              <button onClick={() => setShowPostModal(true)}
                      className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors">
                Be the first to ask!
              </button>
            </div>
        ) : (
            <div className="space-y-4">
              {questions.map((question) => (
                  <div key={question._id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <Link to={`/gardener/forum/${question._id}`} className="group">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#4CAF50] transition-colors">
                            {question.title}
                          </h3>
                        </Link>
                        <p className="text-gray-600 mb-3 line-clamp-2">{question.content}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {(question.tags || []).map((tag) => (
                              <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{tag}</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{question.author?.name || "Anonymous"}</span>
                          <span>•</span>
                          <span>{formatTime(question.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleLike(question._id)}
                                  className="flex items-center gap-1 px-3 py-1 text-gray-600 hover:text-red-600 transition-colors">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm font-medium">{question.likes || 0}</span>
                          </button>
                          <button onClick={() => handleBookmark(question._id)}
                                  className={`p-2 rounded-lg transition-colors ${isBookmarked(question) ? "text-[#4CAF50] bg-green-50" : "text-gray-400 hover:text-[#4CAF50] hover:bg-gray-50"}`}>
                            <Bookmark className="w-5 h-5" fill={isBookmarked(question) ? "currentColor" : "none"} />
                          </button>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">{question.answers?.length || 0} answers</span>
                        </div>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
        )}

        {/* Post Modal */}
        {showPostModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Ask a Question</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title <span className="text-red-500">*</span></label>
                    <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                           placeholder="What's your question?"
                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description <span className="text-red-500">*</span></label>
                    <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)}
                              placeholder="Provide more details..." rows={6}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags <span className="text-gray-400 text-xs">(comma separated)</span></label>
                    <input type="text" value={newTags} onChange={(e) => setNewTags(e.target.value)}
                           placeholder="e.g. watering, indoor, pests"
                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]" />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button onClick={() => setShowPostModal(false)} disabled={isPosting}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
                      Cancel
                    </button>
                    <button onClick={handleSubmitPost} disabled={isPosting || !newTitle.trim() || !newContent.trim()}
                            className="flex-1 px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {isPosting ? <><Loader2 className="w-4 h-4 animate-spin" />Posting...</> : "Post Question"}
                    </button>
                  </div>
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

