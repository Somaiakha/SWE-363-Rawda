import { useEffect, useState } from "react";
import { Edit, Award, Trash2 } from "lucide-react";

export default function BadgesSystem() {
  const [badgeRules, setBadgeRules] = useState([]);
  const [experts, setExperts] = useState([]);
  const [toast, setToast] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);

  useEffect(() => {
    fetchBadgeData();
  }, []);

  const fetchBadgeData = async () => {
    try {
      const rulesRes = await fetch("http://localhost:5050/api/badges/rules");
      const rulesData = await rulesRes.json();

      const expertsRes = await fetch("http://localhost:5050/api/badges/experts");
      const expertsData = await expertsRes.json();

      setBadgeRules(rulesData);

      const formattedExperts = expertsData.map((expert) => ({
        id: expert._id,
        expertName: expert.name,
        currentBadge: expert.currentBadge || "None",
        badgeColor: expert.badgeColor || "bg-gray-300",
        answers: expert.answers || 0,
        verifiedAnswers: expert.verifiedAnswers || 0,
        expertStatus: expert.expertStatus || "Pending", // ✅ FIXED
      }));

      setExperts(formattedExperts);
    } catch (error) {
      console.error("Failed to fetch badge data", error);
    }
  };

  const handleAssignBadge = (expert) => {
    setSelectedExpert(expert);
    setShowAssignModal(true);
  };

  const confirmAssignment = async (badgeName, badgeColor) => {
    if (!selectedExpert) return;

    await fetch(
        `http://localhost:5050/api/badges/experts/${selectedExpert.id}/assign`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentBadge: badgeName,
            badgeColor,
          }),
        }
    );

    await fetchBadgeData();
    setShowAssignModal(false);
    setSelectedExpert(null);
    showToast("Badge assigned successfully");
  };

  const removeBadge = async (expertId) => {
    await fetch(`http://localhost:5050/api/badges/experts/${expertId}/remove`, {
      method: "PUT",
    });

    await fetchBadgeData();
    showToast("Badge removed");
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  return (
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Badge System
          </h1>
          <p className="text-gray-600">
            Manage expert badges and achievement levels
          </p>
        </div>

        {/* Badge Rules */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Badge Levels & Requirements
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {badgeRules.map((badge) => (
                <div
                    key={badge._id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-gray-900"
                >
                  <div
                      className={`w-12 h-12 ${badge.color} rounded-full flex items-center justify-center mb-3`}
                  >
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{badge.name}</h3>
                  <p className="text-sm text-gray-600">{badge.requirement}</p>
                </div>
            ))}
          </div>
        </div>

        {/* Experts Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Expert Badge Management
            </h2>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Badge</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Answers</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Verified</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
            </tr>
            </thead>

            <tbody className="divide-y">
            {experts.map((expert) => (
                <tr key={expert.id} className="hover:bg-gray-50">

                  <td className="px-6 py-4 font-medium">
                    {expert.expertName}
                  </td>

                  <td className="px-6 py-4 flex items-center gap-2">
                    <div className={`w-8 h-8 ${expert.badgeColor} rounded-full flex items-center justify-center`}>
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    {expert.currentBadge}
                  </td>

                  <td className="px-6 py-4">{expert.answers}</td>
                  <td className="px-6 py-4">{expert.verifiedAnswers}</td>

                  <td className="px-6 py-4 flex gap-2">

                    {/* Assign */}
                    <button
                        onClick={() => handleAssignBadge(expert)}
                        disabled={expert.expertStatus !== "Approved"}
                        className={`p-2 rounded-lg ${
                            expert.expertStatus !== "Approved"
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "text-blue-600 hover:bg-blue-50"
                        }`}
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {/* Remove */}
                    <button
                        onClick={() => removeBadge(expert.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showAssignModal && selectedExpert && (
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md">

                <h3 className="text-xl font-semibold mb-4">
                  Assign Badge
                </h3>

                <div className="space-y-2">
                  {badgeRules.map((badge) => (
                      <button
                          key={badge._id}
                          onClick={() => confirmAssignment(badge.name, badge.color)}
                          className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div className={`w-10 h-10 ${badge.color} rounded-full flex items-center justify-center`}>
                          <Award className="text-white w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium">{badge.name}</div>
                          <div className="text-sm text-gray-500">{badge.requirement}</div>
                        </div>
                      </button>
                  ))}
                </div>

                <button
                    onClick={() => setShowAssignModal(false)}
                    className="w-full mt-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>

              </div>
            </div>
        )}

        {/* Toast */}
        {toast && (
            <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-lg">
              {toast}
            </div>
        )}
      </div>
  );
}