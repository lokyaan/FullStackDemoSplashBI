import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { logout } from "../api/auth";
import TopBar from '../components/TopBar'

export default function ManagerDashboard() {
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [approvedAdmins, setApprovedAdmins] = useState([]);
  const navigate = useNavigate();
  const fullName = localStorage.getItem("fullName") || "Default Manager";

  // 🔹 Fetch all pending & approved admins
  useEffect(() => {
    async function loadData() {
      try {
        const [pendingRes, approvedRes] = await Promise.all([
          api.get("/manager/pending-admins"),
          api.get("/manager/approved-admins"),
        ]);

        setPendingAdmins(pendingRes.data);
        setApprovedAdmins(approvedRes.data);
      } catch (err) {
        console.error("Error loading data", err);
      }
    }
    loadData();
  }, []);

  // ✅ Approve admin
  async function approve(id) {
    try {
      await api.put(`/manager/approve/${id}`);
      setPendingAdmins((prev) => prev.filter((u) => u.id !== id));
      const res = await api.get("/manager/approved-admins");
      setApprovedAdmins(res.data);
      alert("Admin approved successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Approval failed ❌");
    }
  }

  // ❌ Reject admin
  async function reject(id) {
    try {
      await api.delete(`/manager/reject/${id}`);
      setPendingAdmins((prev) => prev.filter((u) => u.id !== id));
      alert("Admin rejected ❌");
    } catch (err) {
      console.error(err);
      alert("Rejection failed");
    }
  }

  // 🗑️ Remove approved admin
  async function removeAdmin(id) {
    try {
      await api.delete(`/manager/remove-admin/${id}`);
      setApprovedAdmins((prev) => prev.filter((u) => u.id !== id));
      alert("Admin removed successfully 🗑️");
    } catch (err) {
      console.error(err);
      alert("Failed to remove admin");
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div
      className="min-h-dvh p-6"
      style={{
        background: "linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #6366f1 100%)",
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold text-white drop-shadow">
            Manager Dashboard — {fullName}
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="mt-3 sm:mt-0 rounded-xl border border-white/60 bg-white/70 hover:bg-white text-black px-4 py-2 font-semibold shadow"
        >
          Logout
        </button>
      </div>

      {/* 🧾 Pending Admin Approvals */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">
          Pending Admin Approvals
        </h2>
        {pendingAdmins.length === 0 ? (
          <p className="text-white/90">No pending admins </p>
        ) : (
          <ul className="space-y-3">
            {pendingAdmins.map((u) => (
              <li
                key={u.id}
                className="flex justify-between items-center border border-white/40 bg-white/20 backdrop-blur-lg p-4 rounded-xl shadow"
              >
                <div>
                  <strong className="text-white text-lg">{u.fullName}</strong>
                  <p className="text-sm text-white/80">{u.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => approve(u.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-medium"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => reject(u.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-medium"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ✅ Approved Admins */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Approved Admins</h2>
        {approvedAdmins.length === 0 ? (
          <p className="text-white/90">No approved admins yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {approvedAdmins.map((admin) => (
              <div
                key={admin.id}
                className="border border-white/30 bg-white/25 backdrop-blur-xl p-4 rounded-2xl shadow-lg"
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {admin.fullName}
                </h3>
                <p className="text-sm text-slate-800 dark:text-slate-200 mb-2">
                  {admin.email}
                </p>

                <button
                  onClick={() => removeAdmin(admin.id)}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-medium w-full"
                >
                  Remove Admin
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
