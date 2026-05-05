import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import StatCard from "../components/dashboard/StatCard";
import QuestionCard from "../components/dashboard/QuestionCard";
import ReviewCard from "../components/dashboard/ReviewCard";
import { MessageSquare, CheckCircle2, Award, ArrowUpRight, Loader2 } from "lucide-react";
import { Button } from "../components/ui/Button";

export default function DashboardHome() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [guides, setGuides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [questionsRes, guidesRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5050/api"}/questions`),
        fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5050/api"}/guides`),
      ]);

      const questionsData = await questionsRes.json();
      const guidesData = await guidesRes.json();

      if (questionsRes.ok) setQuestions(questionsData);
      if (guidesRes.ok) setGuides(guidesData);
    } catch (err) {
      console.error("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  const totalAnswers = questions.reduce((acc, q) => acc + (q.answers?.length || 0), 0);
  const verifiedAnswers = questions.reduce(
    (acc, q) => acc + (q.answers?.filter((a) => a.isVerified)?.length || 0), 0
  );
  const myGuides = guides.filter((g) => g.author?._id === user._id || g.author === user._id);
  const pendingGuides = myGuides.filter((g) => g.status === "Pending");

  const stats = [
    { label: "Total Answers", value: totalAnswers.toString(), icon: MessageSquare, trend: { value: 12, isUp: true } },
    { label: "Verified Answers", value: verifiedAnswers.toString(), icon: CheckCircle2, trend: { value: 5, isUp: true } },
    { label: "My Guides", value: myGuides.length.toString(), icon: Award, trend: { value: 2, isUp: true } },
  ];

  const recentQuestions = questions.slice(0, 3).map((q) => ({
    id: q._id,
    title: q.title,
    excerpt: q.content,
    tags: q.tags,
    postedAt: new Date(q.createdAt).toLocaleDateString(),
    likes: q.likes,
    comments: q.answers?.length || 0,
    author: {
      name: q.author?.name || "Unknown",
      level: "Gardener",
    },
  }));

  const pendingReviews = pendingGuides.slice(0, 3).map((g) => ({
    id: g._id,
    title: g.title,
    status: g.status,
    submittedAt: new Date(g.createdAt).toLocaleDateString(),
    type: "Guide",
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.name || "Expert"}! 🌿
          </h1>
          <p className="text-gray-500 mt-1">Here's what's happening in your garden community today.</p>
        </div>
        <Button
          className="bg-[#4CAF50] text-white hover:bg-[#43A047]"
          onClick={() => navigate("/expert/create-guide")}
        >
          <span className="mr-2">+</span> Create New Guide
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-green-600" size={32} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Recent Questions</h2>
                <Button
                  variant="ghost"
                  className="text-green-600 hover:text-green-700 hover:bg-green-50 text-sm"
                  onClick={() => navigate("/expert/answer")}
                >
                  View All <ArrowUpRight size={16} className="ml-1" />
                </Button>
              </div>
              <div className="space-y-4">
                {recentQuestions.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                    <p className="text-gray-500">No questions yet.</p>
                  </div>
                ) : (
                  recentQuestions.map((q) => (
                    <QuestionCard key={q.id} question={q} />
                  ))
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Pending Reviews</h2>
                <Button
                  variant="ghost"
                  className="text-green-600 hover:text-green-700 hover:bg-green-50 text-sm"
                  onClick={() => navigate("/expert/review")}
                >
                  See All
                </Button>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-1">
                <div className="divide-y divide-gray-50">
                  {pendingReviews.length === 0 ? (
                    <p className="text-center text-gray-500 py-6 text-sm">No pending reviews.</p>
                  ) : (
                    pendingReviews.map((review) => (
                      <div key={review.id} className="p-2">
                        <ReviewCard review={review} />
                      </div>
                    ))
                  )}
                </div>
                <div className="p-4 text-center border-t border-gray-50">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-gray-500 hover:text-gray-700"
                    onClick={() => navigate("/expert/review")}
                  >
                    View all pending items
                  </Button>
                </div>
              </div>

              <div className="bg-[#E8F5E9] rounded-xl p-6 border border-[#C8E6C9]">
                <h3 className="font-bold text-[#2E7D32] mb-2">Weekly Challenge 🏆</h3>
                <p className="text-sm text-[#388E3C] mb-4">
                  Answer 10 questions about "Spring Planting" to earn the Seasonal Expert badge!
                </p>
                <div className="w-full bg-white/50 rounded-full h-2 mb-2 overflow-hidden">
                  <div
                    className="bg-[#4CAF50] h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((totalAnswers / 10) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-[#388E3C] font-medium">
                  <span>{Math.min(totalAnswers, 10)}/10 Answered</span>
                  <span>{Math.max(10 - totalAnswers, 0)} to go!</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}