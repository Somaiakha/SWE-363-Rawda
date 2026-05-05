import { useEffect, useState } from "react";
import { AlertTriangle, Eye, Trash2, CheckCircle } from "lucide-react";

export default function ForumModeration() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5050/api"}/forum`);
      const data = await res.json();

      const formatted = data.map((post) => ({
        id: post._id,
        title: post.title,
        author: post.author || "Anonymous",
        date: post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "N/A",
        reports: post.reports,
        status: post.status,
        content: post.content,
      }));

      setPosts(formatted);
    } catch {
      console.error("Failed to fetch posts");
    }
  };

  const deletePost = async (postId) => {
    await fetch(`http://localhost:5050/api/forum/${postId}`, {
      method: "DELETE",
    });

    fetchPosts();
    showToast("Post removed");
  };

  const markSafe = async (postId) => {
    await fetch(`http://localhost:5050/api/forum/${postId}/resolve`, {
      method: "PUT",
    });

    fetchPosts();
    showToast("Post marked as safe");
  };

  const warnUser = async () => {
    showToast("Warning sent");
  };

  const handleViewPost = (post) => {
    setSelectedPost(post);
    setShowDetailModal(true);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forum Moderation</h1>
          <p className="text-gray-600">Review reported posts and manage community content</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left">Post Title</th>
              <th className="p-4 text-left">Author</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Reports</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
            </thead>

            <tbody>
            {posts.map((post) => (
                <tr key={post.id} className="border-t">
                  <td className="p-4">{post.title}</td>
                  <td className="p-4">{post.author}</td>
                  <td className="p-4">{post.date}</td>
                  <td className="p-4">
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full">
                    {post.reports}
                  </span>
                  </td>
                  <td className="p-4">
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">
                    {post.status}
                  </span>
                  </td>
                  <td className="p-4 flex gap-3">
                    <button onClick={() => handleViewPost(post)} title="View">
                      <Eye className="text-black" />
                    </button>

                    <button onClick={() => deletePost(post.id)} title="Delete">
                      <Trash2 className="text-red-600" />
                    </button>

                    <button onClick={() => markSafe(post.id)} title="Mark Safe">
                      <CheckCircle className="text-green-600" />
                    </button>

                    <button onClick={warnUser} title="Warn User">
                      <AlertTriangle className="text-orange-600" />
                    </button>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        {showDetailModal && selectedPost && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-xl w-[500px]">
                <h2 className="text-xl font-bold mb-2">{selectedPost.title}</h2>
                <p className="text-sm text-gray-500 mb-2">
                  By {selectedPost.author} • {selectedPost.date}
                </p>
                <p>{selectedPost.content}</p>

                <button
                    onClick={() => setShowDetailModal(false)}
                    className="mt-4 px-4 py-2 border rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
        )}

        {toast && (
            <div className="fixed bottom-8 right-8 bg-black text-white px-4 py-2 rounded">
              {toast}
            </div>
        )}
      </div>
  );
}