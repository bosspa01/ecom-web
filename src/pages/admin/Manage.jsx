import React, { useEffect, useState } from "react";
import useEcomStore from "../../store/ecom-store";
import {
  listUsersAdmin,
  changeUserRole,
  changeUserStatus,
} from "../../api/User";

const Manage = () => {
  const token = useEcomStore((state) => state.token);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await listUsersAdmin(token);
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (user) => {
    try {
      const newRole = user.role === "admin" ? "user" : "admin";
      await changeUserRole(token, user.id, newRole);
      // update local state
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)));
    } catch (error) {
      console.error("Failed to change role", error);
    }
  };

  const handleToggleEnabled = async (user) => {
    try {
      const newEnabled = !user.enabled;
      await changeUserStatus(token, user.id, newEnabled);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, enabled: newEnabled } : u)));
    } catch (error) {
      console.error("Failed to change status", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6 ">Manage Users</h2>
      {loading ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">Loading users...</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700">
          {users.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg">No users found</p>
            </div>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full">
                <thead className="bg-gray-700 text-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Created At</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Enabled</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="px-4 py-3 text-gray-300 text-sm">{user.id}</td>
                      <td className="px-4 py-3 text-gray-400 text-sm">{user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}</td>
                      <td className="px-4 py-3 text-gray-300 text-sm">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${
                          user.role === 'admin' 
                            ? 'bg-purple-900/50 text-purple-400 border-purple-800' 
                            : 'bg-blue-900/50 text-blue-400 border-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${
                          user.enabled 
                            ? 'bg-green-900/50 text-green-400 border-green-800' 
                            : 'bg-red-900/50 text-red-400 border-red-800'
                        }`}>
                          {user.enabled ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleAdmin(user)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
                          >
                            {user.role === "admin" ? "Revoke Admin" : "Make Admin"}
                          </button>
                          <button
                            onClick={() => handleToggleEnabled(user)}
                            className={`${
                              user.enabled 
                                ? "bg-red-500 hover:bg-red-600" 
                                : "bg-green-500 hover:bg-green-600"
                            } text-white px-3 py-1.5 rounded text-sm font-medium transition-colors`}
                          >
                            {user.enabled ? "Disable" : "Enable"}
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
      )}
    </div>
  );
};

export default Manage;