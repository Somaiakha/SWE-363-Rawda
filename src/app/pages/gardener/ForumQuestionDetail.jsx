// src/app/pages/gardener/ForumQuestionDetail.jsx
import { useState, useEffect } from "react";
import { ArrowLeft, Heart, Share2, Loader2, CheckCircle } from "lucide-react";
import { Link, useParams } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import { questionsAPI, answersAPI } from "../../../api/api";

export default function ForumQuestionDetail() {
  const { id }   = useParams();
  const { user } = useAuth();

  const [question, setQuestion]   = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newAnswer, setNewAnswer] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [toast, setToast]         = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const data = await questionsAPI.getById(id);
        setQuestion(data);
      } catch { showToast("Failed to load question."); }
      finally { setIsLoading(false); }
    };
    fetch();
  }, [id]);

  const handleLikeQuestion = async () => {
    try {
      const res = await questionsAPI.like(id);
      setQuestion((prev) => ({ ...prev, likes: res.likes }));
    } catch { showToast("Failed to like."); }
  };

  const handleLikeAnswer = async (answerId) => {
    try {
      const res = await answersAPI.like(id, answerId);
      setQuestion((prev) => ({
        ...prev,
        answers: prev.answers.map((a) =>
            a._id === answerId ? { ...a, likes: res.likes } : a
        ),
      }));
    } catch { showToast("Failed to like answer."); }
  };

  const handleSubmitAnswer = async () => {
    if (!newAnswer.trim()) return;
    setIsPosting(true);
    try {
      const updated = await answersAPI.create(id, newAnswer);
      setQuestion(updated);
      setNewAnswer("");
      showToast("Answer posted successfully!");
    } catch (err) {
      showToast(err.message || "Failed to post answer.");
    } finally { setIsPosting(false); }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("Link copied to clipboard!");
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const formatTime = (dateStr) => {
    const diff  = Date.now() - new Date(dateStr).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days  = Math.floor(hours / 24);
    if (days  > 0) return `${days} day${days  > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return `${mins || 1} minute${mins > 1 ? "s" : ""} ago`;
  };

  if (isLoading) return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-[#4CAF50]" />
      </div>
  );

  if (!question) return (
      <div className="text-center py-32">
        <p className="text-gray-500 mb-4">Question not found.</p>
        <Link to="/gardener/forum" className="text-[#4CAF50] hover:underline">Back to Forum</Link>
      </div>
  );

  return (
      <div className="max-w-4xl mx-auto">
        <Link to="/gardener/forum" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5" /><span>Back to Forum</span>
        </Link>

        {/* Question */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900 mb-3">{question.title}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {(question.tags || []).map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">{tag}</span>
                ))}
              </div>
            </div>
            <button onClick={handleLikeQuestion} className="flex items-center gap-1 px-3 py-1 text-gray-600 hover:text-red-600 transition-colors">
              <Heart className="w-5 h-5" /><span className="font-medium">{question.likes || 0}</span>
            </button>
          </div>
          <p className="text-gray-700 mb-4 leading-relaxed">{question.content}</p>
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="font-medium">{question.author?.name || "Anonymous"}</span>
              <span>•</span>
              <span>{formatTime(question.createdAt)}</span>
            </div>
            <button onClick={handleShare} className="flex items-center gap-2 px-3 py-1 text-gray-600 hover:text-[#4CAF50] transition-colors">
              <Share2 className="w-4 h-4" /><span className="text-sm">Share</span>
            </button>
          </div>
        </div>

        {/* Answers */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {question.answers?.length || 0} {question.answers?.length === 1 ? "Answer" : "Answers"}
          </h2>

          {question.answers?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No answers yet. Be the first to answer!</p>
              </div>
          ) : (
              <div className="space-y-6">
                {question.answers.map((answer) => (
                    <div key={answer._id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-[#4CAF50] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {(answer.author?.name || "A")[0].toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-900">{answer.author?.name || "Anonymous"}</span>
                            {answer.author?.role === "expert" && (
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">✓ Expert</span>
                            )}
                            {answer.isVerified && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                          <CheckCircle className="w-3 h-3" />Verified
                        </span>
                            )}
                            <span className="text-sm text-gray-500">• {formatTime(answer.createdAt)}</span>
                          </div>
                          <p className="text-gray-700 mb-3 leading-relaxed">{answer.content}</p>
                          <button onClick={() => handleLikeAnswer(answer._id)} className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors">
                            <Heart className="w-4 h-4" /><span className="text-sm font-medium">{answer.likes || 0}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>

        {/* Post Answer */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
          <textarea value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="Share your knowledge or experience..." rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent mb-4" />
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Be respectful and helpful in your answer</p>
            <button onClick={handleSubmitAnswer} disabled={!newAnswer.trim() || isPosting}
                    className="px-6 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
              {isPosting ? <><Loader2 className="w-4 h-4 animate-spin" />Posting...</> : "Post Answer"}
            </button>
          </div>
        </div>

        {toast && (
            <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in z-50">
              {toast}
            </div>
        )}
      </div>
  );
}