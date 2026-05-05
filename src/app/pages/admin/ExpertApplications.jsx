import { useEffect, useState } from "react";
import { Eye, CheckCircle, XCircle, FileText, Trash2 } from "lucide-react";

export default function ExpertApplications() {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch(
          `http://localhost:5050/api/experts?t=${Date.now()}`,
          { cache: "no-store" }
      );

      const data = await res.json();
      console.log("FETCH DATA:", data);

      const formatted = data.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        yearsExperience: user.yearsExperience || 0,
        status: user.expertStatus || "Pending", // ✅ correct field
        bio: user.bio,
        certificates: user.certificates || [],
      }));

      setApplications(formatted);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(
          `http://localhost:5050/api/experts/${id}/status`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ expertStatus: newStatus }),
          }
      );

      const data = await res.json();
      console.log("UPDATE RESPONSE:", data);

      if (!res.ok) {
        showToast(data.message || "Error updating status");
        return;
      }

      await fetchApplications(); // 🔥 force refresh
      showToast(`Application ${newStatus}`);
    } catch (error) {
      console.error(error);
      showToast("Error updating status");
    }
  };

  const deleteExpert = async (id) => {
    try {
      const res = await fetch(
          `http://localhost:5050/api/experts/${id}`,
          {
            method: "DELETE",
          }
      );

      if (!res.ok) {
        showToast("Delete failed");
        return;
      }

      await fetchApplications(); // 🔥 force refresh
      showToast("Expert deleted");
    } catch (error) {
      console.error(error);
      showToast("Error deleting expert");
    }
  };

  const handleViewDetails = (app) => {
    setSelectedApplication(app);
    setShowDetailModal(true);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const pendingCount = applications.filter(
      (app) => app.status === "Pending"
  ).length;

  return (
      <div className="max-w-7xl mx-auto">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Expert Applications
          </h1>
          <p className="text-gray-600">
            Review and approve expert registrations • {pendingCount} pending
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Experience</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
            </thead>

            <tbody>
            {applications.map((app) => (
                <tr key={app.id} className="border-t">
                  <td className="p-4">{app.name}</td>
                  <td className="p-4">{app.email}</td>
                  <td className="p-4">{app.yearsExperience} years</td>

                  <td className="p-4">
                  <span
                      className={`px-3 py-1 rounded-full text-sm ${
                          app.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : app.status === "Rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {app.status}
                  </span>
                  </td>

                  <td className="p-4">
                    <div className="flex gap-3 items-center">

                      <button onClick={() => handleViewDetails(app)}>
                        <Eye />
                      </button>

                      {app.status === "Pending" && (
                          <>
                            <button
                                onClick={() =>
                                    updateStatus(app.id, "Approved")
                                }
                            >
                              <CheckCircle className="text-green-600" />
                            </button>

                            <button
                                onClick={() =>
                                    updateStatus(app.id, "Rejected")
                                }
                            >
                              <XCircle className="text-red-600" />
                            </button>
                          </>
                      )}

                      <button onClick={() => deleteExpert(app.id)}>
                        <Trash2 className="text-red-600" />
                      </button>

                    </div>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        {showDetailModal && selectedApplication && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-xl w-[500px]">
                <h2 className="text-xl font-bold mb-4">
                  {selectedApplication.name}
                </h2>

                <p className="mb-2">{selectedApplication.email}</p>
                <p className="mb-2">
                  {selectedApplication.yearsExperience} years experience
                </p>

                {selectedApplication.bio && (
                    <p className="mb-4">{selectedApplication.bio}</p>
                )}

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
            <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-lg">
              {toast}
            </div>
        )}
      </div>
  );
}
