import { useState, useEffect } from "react";
import QuestionCard from "../components/dashboard/QuestionCard";
import { Button } from "../components/ui/Button";
import { Search, Filter, SlidersHorizontal, Loader2 } from "lucide-react";

export default function AnswerQuestions() {
  const [filter, setFilter] = useState("Recommended");
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5050/api"}/questions`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setQuestions(data);
    } catch (err) {
      setError("Failed to load questions. Make sure backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === "No Answers") return matchesSearch && q.answers?.length === 0;
    if (filter === "Newest") return matchesSearch;
    return matchesSearch;
  }).sort((a, b) => {
    if (filter === "Newest") return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Answer Questions</h1>
          <p className="text-gray-500 mt-1">Help the community by sharing your expertise.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search topics..."
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

      <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto pb-1">
        {["Recommended", "Newest", "No Answers", "Urgent", "My Topics"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              filter === tab
                ? "border-[#4CAF50] text-[#2E7D32]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-green-600" size={32} />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-600">{error}</p>
              <button onClick={fetchQuestions} className="mt-4 text-sm text-red-600 underline">
                Try again
              </button>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <p className="text-gray-500">No questions found.</p>
            </div>
          ) : (
            filteredQuestions.map((q) => (
              <QuestionCard
                key={q._id}
                question={{
                  id: q._id,
                  _id: q._id,
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
                }}
              />
            ))
          )}

          {!isLoading && !error && filteredQuestions.length > 0 && (
            <Button variant="ghost" className="w-full text-green-600 hover:bg-green-50 py-4 mt-4">
              Load More Questions
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-[#E8F5E9] rounded-xl p-6 border border-[#C8E6C9]">
            <h3 className="font-bold text-[#2E7D32] mb-2 flex items-center gap-2">
              <SlidersHorizontal size={18} />
              Your Expertise
            </h3>
            <p className="text-sm text-[#388E3C] mb-4">
              We recommend questions based on your selected tags.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Vegetables", "Pest Control", "Soil Health", "Indoor Plants"].map((tag) => (
                <span key={tag} className="bg-white/60 text-[#2E7D32] px-2 py-1 rounded text-xs font-medium border border-[#A5D6A7]">
                  {tag}
                </span>
              ))}
              <button className="bg-white/60 text-[#2E7D32] px-2 py-1 rounded text-xs font-medium border border-dashed border-[#A5D6A7] hover:bg-white transition-colors">
                + Add Tag
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Top Contributors this Week</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs text-gray-600">
                    {i}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                    <img
                      src={`https://images.unsplash.com/photo-${i === 1 ? "1535713875002-d1d0cf377fde" : i === 2 ? "1580489944761-15a19d654956" : "1531123897727-8f129e1688ce"}?auto=format&fit=crop&w=100&q=80`}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">Gardener {i}</p>
                    <p className="text-xs text-gray-500">{50 - i * 5} Answers</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}