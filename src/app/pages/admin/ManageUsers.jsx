import { useEffect, useState } from "react";
import { Search, Filter, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";

export default function ManageUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editRole, setEditRole] = useState("");
  const [toast, setToast] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5050/api"}/users`);
      const data = await res.json();

      const formattedUsers = data.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdDate: user.createdAt
            ? new Date(user.createdAt).toLocaleDateString()
            : "N/A",
        status: user.status || "Active",
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditRole(user.role);
    setShowEditModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmEdit = async () => {
    if (!selectedUser || !editRole) return;

    try {
      await fetch(`http://localhost:5050/api/users/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: editRole }),
      });

      await fetchUsers();
      showToast("User updated successfully");
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (error) {
      showToast("Error updating user");
    }
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    try {
      await fetch(`http://localhost:5050/api/users/${selectedUser.id}`, {
        method: "DELETE",
      });

      await fetchUsers();
      showToast("User deleted successfully");
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      showToast("Error deleting user");
    }
  };

  const toggleUserStatus = async (user) => {
    const newStatus = user.status === "Active" ? "Inactive" : "Active";

    try {
      await fetch(`http://localhost:5050/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      await fetchUsers();
      showToast("User status updated");
    } catch (error) {
      showToast("Error updating status");
    }
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const getRoleStyle = (role) => {
    if (role === "admin") return "bg-purple-100 text-purple-700";
    if (role === "expert") return "bg-green-100 text-green-700";
    if (role === "store") return "bg-orange-100 text-orange-700";
    return "bg-blue-100 text-blue-700";
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Users</h1>
          <p className="text-gray-600">View and manage all user accounts</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 appearance-none bg-white"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="expert">Expert</option>
                <option value="gardener">Gardener</option>
                <option value="store">Store</option>
              </select>
            </div>

            <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredUsers.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-600">No users found</p>
              </div>
          ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Created Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                        <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleStyle(user.role)}`}>
                        {user.role}
                      </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{user.createdDate}</td>
                        <td className="px-6 py-4">
                      <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                              user.status === "Active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {user.status}
                      </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleEditUser(user)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit Role"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                                onClick={() => toggleUserStatus(user)}
                                className={`p-2 rounded-lg transition-colors ${
                                    user.status === "Active"
                                        ? "text-orange-600 hover:bg-orange-50"
                                        : "text-green-600 hover:bg-green-50"
                                }`}
                                title={user.status === "Active" ? "Deactivate" : "Activate"}
                            >
                              {user.status === "Active" ? (
                                  <XCircle className="w-4 h-4" />
                              ) : (
                                  <CheckCircle className="w-4 h-4" />
                              )}
                            </button>

                            <button
                                onClick={() => handleDeleteUser(user)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}
        </div>

        {showEditModal && selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Edit User Role</h3>
                <p className="text-gray-600 mb-4">
                  Change role for <span className="font-medium">{selectedUser.name}</span>
                </p>

                <div className="space-y-2 mb-6">
                  {["admin", "expert", "gardener", "store"].map((role) => (
                      <label
                          key={role}
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                            type="radio"
                            name="role"
                            value={role}
                            checked={editRole === role}
                            onChange={(e) => setEditRole(e.target.value)}
                            className="w-4 h-4 text-gray-900 focus:ring-gray-900"
                        />
                        <span className="font-medium capitalize">{role}</span>
                      </label>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={confirmEdit}
                      className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
        )}

        {showDeleteModal && selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Delete User</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete{" "}
                  <span className="font-medium">{selectedUser.name}</span>? This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                      onClick={() => setShowDeleteModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={confirmDelete}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete User
                  </button>
                </div>
              </div>
            </div>
        )}

        {toast && (
            <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50">
              {toast}
            </div>
        )}
      </div>
  );
}