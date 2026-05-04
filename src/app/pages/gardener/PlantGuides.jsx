// src/app/pages/gardener/PlantGuides.jsx
import { useState } from "react";
import { ArrowLeft, Filter, Bookmark, Search, X } from "lucide-react";
import { Link } from "react-router";

export default function PlantGuides() {
  const [searchQuery, setSearchQuery]         = useState("");
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [toast, setToast]                     = useState(null);

  const filterOptions = [
    { id: "indoor",       label: "Indoor Plants" },
    { id: "outdoor",      label: "Outdoor Plants" },
    { id: "beginner",     label: "Beginner Friendly" },
    { id: "pest-control", label: "Pest Control" },
    { id: "watering",     label: "Watering Tips" },
    { id: "propagation",  label: "Propagation" },
  ];

  const [guides, setGuides] = useState([
    {
      id: "1",
      title: "Complete Guide to Indoor Plant Care",
      description: "Everything you need to know about caring for indoor plants, from lighting to watering schedules.",
      category: ["indoor", "beginner"],
      imageUrl: "https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400&h=300&fit=crop",
      readTime: "8 min read",
      isSaved: false,
    },
    {
      id: "2",
      title: "Natural Pest Control Methods",
      description: "Organic and eco-friendly ways to protect your plants from common pests without harsh chemicals.",
      category: ["pest-control", "outdoor"],
      imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
      readTime: "6 min read",
      isSaved: true,
    },
    {
      id: "3",
      title: "Mastering Plant Watering",
      description: "Learn the art of watering - how much, when, and what signs to look for in your plants.",
      category: ["watering", "beginner"],
      imageUrl: "https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=400&h=300&fit=crop",
      readTime: "5 min read",
      isSaved: false,
    },
    {
      id: "4",
      title: "Propagation 101: Growing New Plants",
      description: "Step-by-step guide to propagating your favorite plants through cuttings and division.",
      category: ["propagation", "indoor"],
      imageUrl: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=300&fit=crop",
      readTime: "10 min read",
      isSaved: false,
    },
    {
      id: "5",
      title: "Creating a Thriving Outdoor Garden",
      description: "Design and maintain a beautiful outdoor garden with seasonal planting tips and layout ideas.",
      category: ["outdoor", "beginner"],
      imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=300&fit=crop",
      readTime: "12 min read",
      isSaved: false,
    },
    {
      id: "6",
      title: "Succulent Care Made Simple",
      description: "The ultimate guide to keeping your succulents happy and healthy with minimal effort.",
      category: ["indoor", "beginner", "watering"],
      imageUrl: "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=400&h=300&fit=crop",
      readTime: "7 min read",
      isSaved: true,
    },
  ]);

  const toggleFilter = (filterId) => {
    setSelectedFilters((prev) =>
        prev.includes(filterId) ? prev.filter((f) => f !== filterId) : [...prev, filterId]
    );
  };

  const clearFilters = () => setSelectedFilters([]);

  const handleSave = (guideId) => {
    setGuides((prev) =>
        prev.map((g) => (g.id === guideId ? { ...g, isSaved: !g.isSaved } : g))
    );
    const guide = guides.find((g) => g.id === guideId);
    showToast(guide?.isSaved ? "Removed from Saved Guides." : "Added to Saved Guides.");
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredGuides = guides.filter((guide) => {
    const matchesSearch =
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilters =
        selectedFilters.length === 0 ||
        selectedFilters.some((filter) => guide.category.includes(filter));
    return matchesSearch && matchesFilters;
  });

  const recommendedGuides = guides.slice(0, 3);

  const GuideCard = ({ guide, showCategories = false }) => (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative h-48">
          <img src={guide.imageUrl} alt={guide.title} className="w-full h-full object-cover" />
          <button
              onClick={() => handleSave(guide.id)}
              className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors ${
                  guide.isSaved ? "bg-[#4CAF50] text-white" : "bg-white/80 text-gray-600 hover:bg-white"
              }`}
          >
            <Bookmark className="w-5 h-5" fill={guide.isSaved ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="p-4">
          {showCategories && (
              <div className="flex flex-wrap gap-1 mb-2">
                {guide.category.slice(0, 2).map((cat) => (
                    <span key={cat} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{cat}</span>
                ))}
              </div>
          )}
          <h3 className="font-semibold text-gray-900 mb-2">{guide.title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{guide.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{guide.readTime}</span>
            <Link
                to={`/gardener/guides/${guide.id}`}
                className="text-sm text-[#4CAF50] hover:text-[#45a049] font-medium"
            >
              Read Guide →
            </Link>
          </div>
        </div>
      </div>
  );

  return (
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/gardener" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Plant Guides & Care Tips</h1>
              <p className="text-sm text-gray-600">Learn from expert guides and improve your gardening skills</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search guides..." value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent" />
            </div>
            <button onClick={() => setShowFilterDrawer(true)}
                    className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5" /><span>Filters</span>
              {selectedFilters.length > 0 && (
                  <span className="px-2 py-0.5 bg-[#4CAF50] text-white text-xs rounded-full">{selectedFilters.length}</span>
              )}
            </button>
          </div>
          {selectedFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedFilters.map((filterId) => {
                  const filter = filterOptions.find((f) => f.id === filterId);
                  return (
                      <span key={filterId} className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                  {filter?.label}
                        <button onClick={() => toggleFilter(filterId)}><X className="w-3 h-3" /></button>
                </span>
                  );
                })}
                <button onClick={clearFilters} className="text-sm text-gray-600 hover:text-gray-900 underline">Clear all</button>
              </div>
          )}
        </div>

        {/* Recommended */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedGuides.map((guide) => <GuideCard key={guide.id} guide={guide} />)}
          </div>
        </div>

        {/* All Guides */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            All Guides {filteredGuides.length < guides.length && `(${filteredGuides.length})`}
          </h2>
          {filteredGuides.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <p className="text-gray-600">No guides found for this filter.</p>
                <button onClick={clearFilters} className="mt-4 text-[#4CAF50] hover:text-[#45a049] font-medium">Clear filters</button>
              </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGuides.map((guide) => <GuideCard key={guide.id} guide={guide} showCategories />)}
              </div>
          )}
        </div>

        {/* Filter Drawer */}
        {showFilterDrawer && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center md:justify-center">
              <div className="bg-white w-full md:w-96 md:rounded-xl p-6 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Filter Guides</h3>
                  <button onClick={() => setShowFilterDrawer(false)} className="text-gray-600 hover:text-gray-900">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-3">
                  {filterOptions.map((filter) => (
                      <label key={filter.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" checked={selectedFilters.includes(filter.id)} onChange={() => toggleFilter(filter.id)}
                               className="w-5 h-5 text-[#4CAF50] border-gray-300 rounded focus:ring-[#4CAF50]" />
                        <span className="text-gray-900">{filter.label}</span>
                      </label>
                  ))}
                </div>
                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button onClick={clearFilters} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Clear All</button>
                  <button onClick={() => setShowFilterDrawer(false)} className="flex-1 px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors">Apply Filters</button>
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