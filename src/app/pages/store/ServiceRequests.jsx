import { useState, useEffect } from "react";
import axios from "axios";
import {
  CheckCircle,
  XCircle,
  Eye
} from "lucide-react";

export default function ServiceRequests() {
  const [activeTab, setActiveTab] =
    useState("Pending");

  const [selectedRequest,
    setSelectedRequest] =
    useState(null);

  const [showDetailModal,
    setShowDetailModal] =
    useState(false);

  const [showActionModal,
    setShowActionModal] =
    useState(false);

  const [actionType,
    setActionType] =
    useState("accept");

  const [rejectionNote,
    setRejectionNote] =
    useState("");

  const [toast, setToast] =
    useState(null);

  const [requests,
    setRequests] =
    useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests =
  async () => {
    const res =
    await axios.get(
      "http://localhost:5050/api/service-requests"
    );

    setRequests(res.data);
  };

  const showToast = (msg) => {
    setToast(msg);

    setTimeout(() =>
      setToast(null), 3000
    );
  };

  const handleViewDetails =
  (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const handleAction =
  (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setShowDetailModal(false);
    setShowActionModal(true);
  };

  const confirmAction =
  async () => {

    const status =
      actionType === "accept"
        ? "Accepted"
        : "Declined";

    await axios.put(
      `http://localhost:5050/api/service-requests/${selectedRequest._id}`,
      {
        status,
        rejectionNote
      }
    );

    fetchRequests();

    showToast(
      status === "Accepted"
        ? "Request approved successfully."
        : "Request declined."
    );

    setShowActionModal(false);
    setSelectedRequest(null);
    setRejectionNote("");
  };

  const filteredRequests =
    requests.filter(
      (r) =>
        r.status === activeTab
    );

  return (
    <div className="max-w-7xl mx-auto">

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Service Requests</h1>
        <p className="text-gray-600">Manage incoming requests</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="flex border-b">
          {["Pending", "Accepted", "Declined", "Completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-medium ${
                activeTab === tab
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-600"
              }`}
            >
              {tab} ({requests.filter((r) => r.status === tab).length})
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center text-gray-600">No requests found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-left">Service</th>
                <th className="px-6 py-4 text-left">Dates</th>
                <th className="px-6 py-4 text-left">Plants</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request._id} className="border-t">
                  <td className="px-6 py-4">{request.customerName}</td>
                  <td className="px-6 py-4">{request.service}</td>
                  <td className="px-6 py-4">{request.dates}</td>
                  <td className="px-6 py-4">{request.plantCount}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleViewDetails(request)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {request.status === "Pending" && (
                      <>
                        <button
                          onClick={() => handleAction(request, "accept")}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Accept"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleAction(request, "reject")}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Decline"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-3">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Request Details</h3>
            <p><span className="font-medium">Customer:</span> {selectedRequest.customerName}</p>
            <p><span className="font-medium">Service:</span> {selectedRequest.service}</p>
            <p><span className="font-medium">Dates:</span> {selectedRequest.dates}</p>
            <p><span className="font-medium">Plants:</span> {selectedRequest.plantCount}</p>
            {selectedRequest.address && (
              <p><span className="font-medium">Address:</span> {selectedRequest.address}</p>
            )}
            {selectedRequest.contact && (
              <p><span className="font-medium">Contact:</span> {selectedRequest.contact}</p>
            )}
            <p>
              <span className="font-medium">Status:</span>{" "}
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                selectedRequest.status === "Accepted" ? "bg-green-100 text-green-700" :
                selectedRequest.status === "Declined" ? "bg-red-100 text-red-700" :
                selectedRequest.status === "Completed" ? "bg-blue-100 text-blue-700" :
                "bg-yellow-100 text-yellow-700"
              }`}>
                {selectedRequest.status}
              </span>
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              {selectedRequest.status === "Pending" && (
                <>
                  <button
                    onClick={() => handleAction(selectedRequest, "reject")}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleAction(selectedRequest, "accept")}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Accept
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Confirmation Modal */}
      {showActionModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {actionType === "accept" ? "Accept Request" : "Decline Request"}
            </h3>
            <p className="text-gray-600 mb-4">
              {actionType === "accept"
                ? `Accept the service request from ${selectedRequest.customerName}?`
                : `Decline the service request from ${selectedRequest.customerName}?`}
            </p>
            {actionType === "reject" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason (Optional)
                </label>
                <textarea
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  rows={3}
                  placeholder="Provide a reason for declining..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setShowActionModal(false); setRejectionNote(""); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`flex-1 px-4 py-2 text-white rounded-lg ${
                  actionType === "accept"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}