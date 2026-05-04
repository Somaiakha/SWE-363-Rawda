import { useEffect, useState } from "react";
import { Eye, CheckCircle, Edit, XCircle } from "lucide-react";

export default function ContentApproval() {
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState("approve");
  const [feedbackNote, setFeedbackNote] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const res = await fetch("http://localhost:5050/api/guides");
      const data = await res.json();

      const formatted = data.map((g) => ({
        id: g._id,
        title: g.title,
        submittedBy: g.submittedBy,
        date: g.createdAt ? new Date(g.createdAt).toLocaleDateString() : "N/A",
        status: g.approvalStatus,
        content: g.content,
        references: g.references || [],
        feedbackNote: g.feedbackNote || "",
      }));

      setGuides(formatted);
    } catch {
      console.error("Failed to fetch guides");
    }
  };

  const handleViewGuide = (guide) => {
    setSelectedGuide(guide);
    setShowDetailModal(true);
  };

  const handleAction = (guide, type) => {
    setSelectedGuide(guide);
    setActionType(type);
    setFeedbackNote("");
    setShowDetailModal(false);
    setShowActionModal(true);
  };

  const confirmAction = async () => {
    if (!selectedGuide) return;

    const newStatus =
        actionType === "approve"
            ? "Approved"
            : actionType === "revision"
                ? "Revision"
                : "Rejected";

    await fetch(`http://localhost:5050/api/guides/${selectedGuide.id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approvalStatus: newStatus, feedbackNote }),
    });

    await fetchGuides();
    setShowActionModal(false);
    setSelectedGuide(null);
    setFeedbackNote("");
    showToast(`Guide ${newStatus}`);
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const pendingCount = guides.filter((g) => g.status === "Pending").length;

  return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Approval</h1>
          <p className="text-gray-600">
            Review expert-submitted plant guides • {pendingCount} pending
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Submitted By</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
            </thead>

            <tbody>
            {guides.map((guide) => (
                <tr key={guide.id} className="border-t">
                  <td className="p-4 font-medium">{guide.title}</td>
                  <td className="p-4">{guide.submittedBy}</td>
                  <td className="p-4">{guide.date}</td>

                  <td className="p-4">
                  <span
                      className={`px-3 py-1 rounded-full text-sm ${
                          guide.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : guide.status === "Approved"
                                  ? "bg-green-100 text-green-700"
                                  : guide.status === "Revision"
                                      ? "bg-orange-100 text-orange-700"
                                      : "bg-red-100 text-red-700"
                      }`}
                  >
                    {guide.status}
                  </span>
                  </td>

                  <td className="p-4">
                    <div className="flex gap-3">
                      <button onClick={() => handleViewGuide(guide)} title="View">
                        <Eye className="w-5 h-5 text-blue-600" />
                      </button>

                      {guide.status === "Pending" && (
                          <>
                            <button onClick={() => handleAction(guide, "approve")} title="Approve">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            </button>

                            <button onClick={() => handleAction(guide, "revision")} title="Revision">
                              <Edit className="w-5 h-5 text-orange-600" />
                            </button>

                            <button onClick={() => handleAction(guide, "reject")} title="Reject">
                              <XCircle className="w-5 h-5 text-red-600" />
                            </button>
                          </>
                      )}
                    </div>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        {showDetailModal && selectedGuide && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
              <div className="bg-white p-6 rounded-xl max-w-2xl w-full">
                <h2 className="text-xl font-bold mb-2">{selectedGuide.title}</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Submitted by {selectedGuide.submittedBy} • {selectedGuide.date}
                </p>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p>{selectedGuide.content}</p>
                </div>

                {selectedGuide.references.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">References</h3>
                      <ul className="list-disc list-inside">
                        {selectedGuide.references.map((ref, index) => (
                            <li key={index}>{ref}</li>
                        ))}
                      </ul>
                    </div>
                )}

                <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-4 py-2 border rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
        )}

        {showActionModal && selectedGuide && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
              <div className="bg-white p-6 rounded-xl max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">
                  {actionType === "approve"
                      ? "Approve Guide"
                      : actionType === "revision"
                          ? "Request Revision"
                          : "Reject Guide"}
                </h2>

                {(actionType === "revision" || actionType === "reject") && (
                    <textarea
                        value={feedbackNote}
                        onChange={(e) => setFeedbackNote(e.target.value)}
                        placeholder="Write feedback note..."
                        className="w-full border rounded-lg p-3 mb-4"
                        rows={4}
                    />
                )}

                <div className="flex gap-3">
                  <button
                      onClick={() => setShowActionModal(false)}
                      className="flex-1 border rounded-lg py-2"
                  >
                    Cancel
                  </button>

                  <button
                      onClick={confirmAction}
                      className="flex-1 bg-gray-900 text-white rounded-lg py-2"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
        )}

        {toast && (
            <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-lg">
              {toast}
            </div>
        )}
      </div>
  );
}
