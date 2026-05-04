import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/Button";
import { ArrowLeft, UploadCloud, FileText, Image, Save, Loader2 } from "lucide-react";

export default function CreateGuide() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [content, setContent] = useState("");
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!category) newErrors.category = "Please select a category.";
    if (!content.trim()) newErrors.content = "Content cannot be empty.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = () => {
    if (!title.trim()) {
      showToast("Please add a title before saving.");
      return;
    }
    showToast("Draft saved successfully!");
  };

  const handlePublish = async () => {
    if (!validate()) {
      showToast("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5050/api/guides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          category,
          difficulty,
          submittedBy: JSON.parse(localStorage.getItem("user") || "{}")?.name || "Unknown",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "Failed to publish guide.");
        return;
      }

      showToast("Guide published successfully!");
      setTimeout(() => navigate("/expert"), 1500);

    } catch (err) {
      showToast("Server error. Make sure backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="text-gray-500 hover:text-gray-900 pl-0 hover:bg-transparent"
      >
        <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
      </Button>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create New Guide</h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={handleSaveDraft} className="text-gray-500 hover:text-gray-900">
                <Save size={18} className="mr-2" /> Save Draft
              </Button>
              <Button
                onClick={handlePublish}
                disabled={isLoading}
                className="bg-[#4CAF50] hover:bg-[#43A047] text-white disabled:bg-gray-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" /> Publishing...
                  </>
                ) : (
                  "Publish Guide"
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Guide Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full p-4 rounded-xl border focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-xl font-medium placeholder:text-gray-400 ${errors.title ? "border-red-500" : "border-gray-200"}`}
                placeholder="e.g., How to Prune Tomato Plants for Better Yields"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full p-3 rounded-lg border focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all bg-white ${errors.category ? "border-red-500" : "border-gray-200"}`}
                >
                  <option value="">Select a category</option>
                  <option value="Vegetable Gardening">Vegetable Gardening</option>
                  <option value="Indoor Plants">Indoor Plants</option>
                  <option value="Flowers & Ornamentals">Flowers & Ornamentals</option>
                  <option value="Pest Control">Pest Control</option>
                  <option value="Soil Health">Soil Health</option>
                </select>
                {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all bg-white"
                >
                  <option value="Beginner">Beginner 🌱</option>
                  <option value="Intermediate">Intermediate 🌿</option>
                  <option value="Advanced">Advanced 🌳</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Guide Content <span className="text-red-500">*</span>
              </label>
              <div className={`border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-green-100 focus-within:border-green-500 transition-all ${errors.content ? "border-red-500" : "border-gray-200"}`}>
                <div className="bg-gray-50 border-b border-gray-200 p-2 flex items-center gap-2">
                  <button onClick={() => setContent((prev) => prev + "**bold**")} className="h-8 w-8 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded flex items-center justify-center font-bold font-serif">B</button>
                  <button onClick={() => setContent((prev) => prev + "*italic*")} className="h-8 w-8 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded flex items-center justify-center italic font-serif">I</button>
                  <button onClick={() => setContent((prev) => prev + "\n- ")} className="h-8 w-8 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded flex items-center justify-center">
                    <FileText size={16} />
                  </button>
                  <button className="h-8 w-8 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded flex items-center justify-center">
                    <Image size={16} />
                  </button>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full min-h-[300px] p-4 resize-y outline-none text-gray-700"
                  placeholder="Start writing your guide here..."
                />
              </div>
              {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}
            </div>

            <label className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-100 transition-colors cursor-pointer group flex flex-col items-center">
              <div className="bg-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-sm group-hover:scale-110 transition-transform">
                <UploadCloud className="text-green-500" />
              </div>
              <p className="text-gray-900 font-medium mb-1">Upload Cover Image</p>
              <p className="text-sm text-gray-500">Drag and drop or click to upload</p>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}