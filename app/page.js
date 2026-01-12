"use client";
import { useState, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Home() {
  const [userData, setUserData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    loadUsers();
    loadTeams();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await fetch("/api/v1/users");
      const data = await res.json();
      setUserData(data.userDB);
    } catch { }
    finally { setLoading(false); }
  };

  const loadTeams = async () => {
    try {
      const res = await fetch("/api/v1/teams");
      const data = await res.json();
      setTeamData(data.TeamDB);
    } catch { }
  };

  // Filter logic
  const filteredUsers = useMemo(() => {
    return userData.filter((user) => {
      const matchSearch =
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.user_name.toLowerCase().includes(search.toLowerCase());
      const matchTeam = teamFilter === "all" || user.team_id === Number(teamFilter);
      const matchRole = roleFilter === "all" || user.roleName === roleFilter;
      return matchSearch && matchTeam && matchRole;
    });
  }, [userData, search, teamFilter, roleFilter]);

  const roles = [...new Set(userData.map((u) => u.roleName))];

  // Export Excel
  const exportExcel = () => {
    if (filteredUsers.length === 0) return alert("ไม่มีข้อมูลให้ export");

    // สร้าง sheet
    const ws = XLSX.utils.json_to_sheet(
      filteredUsers.map((u) => ({
        DiscordName: u.username,
        Name: u.user_name,
        Team: u.team_name,
        Role: u.roleName,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");

    // แปลงเป็น blob และ save
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, "UserList.xlsx");
  };

  return (
    <div className="w-screen min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-zinc-800 dark:text-white">
          👥 รายชื่อผู้ใช้งาน
        </h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
          <input
            type="text"
            placeholder="ค้นหา Discord / ชื่อ"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:outline-none"
          />
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          >
            <option value="all">ทุกทีม</option>
            {teamData.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          >
            <option value="all">ทุกตำแหน่ง</option>
            {roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <button
            onClick={() => {
              setSearch("");
              setTeamFilter("all");
              setRoleFilter("all");
            }}
            className="px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
          >
            ล้างตัวกรอง
          </button>
          <button
            onClick={exportExcel}
            className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition"
          >
            Export Excel
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-center text-zinc-500">กำลังโหลดข้อมูล...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[600px] border-collapse w-full">
              <thead className="hidden sm:table-header-group">
                <tr className="bg-zinc-100 dark:bg-zinc-800 text-left">
                  <th className="p-2 sm:p-3 text-sm font-semibold">DiscordName</th>
                  <th className="p-2 sm:p-3 text-sm font-semibold">ชื่อ-นามสกุล</th>
                  <th className="p-2 sm:p-3 text-sm font-semibold">ชื่อทีม</th>
                  <th className="p-2 sm:p-3 text-sm font-semibold">ตำแหน่งทีม</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center p-6 text-zinc-500">
                      ไม่พบข้อมูล
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-zinc-200 dark:border-zinc-700 sm:hover:bg-zinc-50 dark:sm:hover:bg-zinc-800 transition block sm:table-row"
                    >
                      {/* Mobile-friendly labels */}
                      <td className="p-2 sm:p-3 text-sm block sm:table-cell">
                        <span className="sm:hidden font-semibold">Discord:</span> {user.username}
                      </td>
                      <td className="p-2 sm:p-3 text-sm block sm:table-cell">
                        <span className="sm:hidden font-semibold">Name:</span> {user.user_name}
                      </td>
                      <td className="p-2 sm:p-3 text-sm block sm:table-cell">
                        <span className="sm:hidden font-semibold">Team:</span> {user.team_name}
                      </td>
                      <td className="p-2 sm:p-3 text-sm block sm:table-cell">
                        <span className="sm:hidden font-semibold">Role:</span>
                        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium ml-1 sm:ml-0">
                          {user.roleName}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
