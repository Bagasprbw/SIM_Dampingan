import React, { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  Clock,
  ChevronDown,
  Calendar,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useLogs } from "../../hooks/queries/useLogQuery";
import { getUser } from "../../utils/storage";
import { ROLES, ROLE_LABELS } from "../../constants/roles";

const AKSI_OPTIONS = [
  { value: "", label: "Semua Aksi" },
  { value: "LOGIN", label: "Login" },
  { value: "LOGOUT", label: "Logout" },
  { value: "CREATE", label: "Create" },
  { value: "UPDATE", label: "Update" },
  { value: "DELETE", label: "Delete" },
  { value: "VIEW", label: "View" },
  { value: "VERIFIKASI", label: "Verifikasi" },
];

const LogAktifitasPage = () => {
  const user = getUser();
  const isSuperadmin = user?.role === ROLES.SUPERADMIN;
  const [aksiFilter, setAksiFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");
  const [showAksiDropdown, setShowAksiDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [page, setPage] = useState(1);

  const {
    data: logData,
    isLoading,
    isError,
    refetch,
  } = useLogs({
    page,
    ...(aksiFilter && { aksi: aksiFilter }),
    ...(isSuperadmin && roleFilter && { role: roleFilter }),
    ...(tanggalMulai && { tanggal_mulai: tanggalMulai }),
    ...(tanggalAkhir && { tanggal_akhir: tanggalAkhir }),
  });

  // BE response: { status, data: { data: [...], current_page, last_page, total, from, to } }
  const pagination = logData?.data || {};
  const logs = pagination?.data || [];
  const meta = {
    total: pagination?.total || 0,
    from: pagination?.from || 0,
    to: pagination?.to || 0,
    current_page: pagination?.current_page || 1,
    last_page: pagination?.last_page || 1,
  };

  const toWibDate = (dateString) => {
    if (!dateString) return null;
    const hasTimezone = /[zZ]|[+-]\d{2}:?\d{2}$/.test(dateString);
    if (hasTimezone) {
      return new Date(dateString);
    }
    // Backend kirim tanpa timezone (anggap UTC), konversi ke WIB saat format
    return new Date(dateString.replace(" ", "T") + "Z");
  };

  const formatTime = (dateString) => {
    const date = toWibDate(dateString);
    if (!date || Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    });
  };

  const getAksiStyles = (aksi) => {
    switch (aksi?.toUpperCase()) {
      case "LOGIN":
        return {
          bg: "bg-[#DBEAFE]",
          text: "text-[#0080C5]",
          dot: "bg-[#0080C5]",
        };
      case "LOGOUT":
        return {
          bg: "bg-slate-100",
          text: "text-slate-600",
          dot: "bg-slate-400",
        };
      case "CREATE":
        return {
          bg: "bg-[#DCFCE7]",
          text: "text-[#16A34A]",
          dot: "bg-[#16A34A]",
        };
      case "UPDATE":
        return {
          bg: "bg-[#FFF7ED]",
          text: "text-[#C2410C]",
          dot: "bg-[#F97316]",
        };
      case "DELETE":
        return {
          bg: "bg-[#FEE2E2]",
          text: "text-[#DC2626]",
          dot: "bg-[#DC2626]",
        };
      case "VERIFIKASI":
        return {
          bg: "bg-[#EDE9FE]",
          text: "text-[#7C3AED]",
          dot: "bg-[#7C3AED]",
        };
      default:
        return { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
    }
  };

  const ROLE_OPTIONS = [
    { value: "", label: "Semua Role" },
    { value: ROLES.SUPERADMIN, label: ROLE_LABELS[ROLES.SUPERADMIN] },
    { value: ROLES.ADMIN_PROVINSI, label: ROLE_LABELS[ROLES.ADMIN_PROVINSI] },
    { value: ROLES.ADMIN_KABUPATEN, label: ROLE_LABELS[ROLES.ADMIN_KABUPATEN] },
    { value: ROLES.ADMIN_KECAMATAN, label: ROLE_LABELS[ROLES.ADMIN_KECAMATAN] },
    { value: ROLES.FASILITATOR, label: ROLE_LABELS[ROLES.FASILITATOR] },
    { value: ROLES.PJ_DAMPINGAN, label: ROLE_LABELS[ROLES.PJ_DAMPINGAN] },
  ];

  const selectedAksiLabel =
    AKSI_OPTIONS.find((o) => o.value === aksiFilter)?.label || "Semua Aksi";
  const selectedRoleLabel =
    ROLE_OPTIONS.find((o) => o.value === roleFilter)?.label || "Semua Role";

  return (
    <AdminLayout title="Log Aktifitas">
      <div className="p-8 font-['Poppins'] bg-[#F0F2F8] min-h-screen text-left">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="px-8 py-4 border-b border-slate-100 flex justify-between items-center flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#0080C5]/10 rounded-full flex items-center justify-center text-[#0080C5]">
                <Clock size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-950 tracking-tight">
                  Log Aktifitas
                </h3>
                <p className="text-xs text-slate-400">
                  Riwayat seluruh aktifitas pengguna sistem
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Filter tanggal mulai - akhir */}
              <div className="flex items-center gap-2">
                <div className="h-10 px-3 bg-white border border-slate-200 rounded-xl flex items-center gap-2">
                  <Calendar size={13} className="text-slate-400" />
                  <input
                    type="date"
                    value={tanggalMulai}
                    onChange={(e) => {
                      setTanggalMulai(e.target.value);
                      setPage(1);
                    }}
                    className="text-[11px] font-medium text-slate-700 outline-none bg-transparent"
                  />
                </div>
                <span className="text-slate-400 text-xs">–</span>
                <div className="h-10 px-3 bg-white border border-slate-200 rounded-xl flex items-center gap-2">
                  <Calendar size={13} className="text-slate-400" />
                  <input
                    type="date"
                    value={tanggalAkhir}
                    onChange={(e) => {
                      setTanggalAkhir(e.target.value);
                      setPage(1);
                    }}
                    className="text-[11px] font-medium text-slate-700 outline-none bg-transparent"
                  />
                </div>
              </div>
              {/* Filter role (superadmin) */}
              {isSuperadmin && (
                <div className="relative">
                  <button
                    onClick={() => setShowRoleDropdown((v) => !v)}
                    className="h-10 px-4 min-w-[150px] bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 hover:bg-slate-50 transition-all"
                  >
                    <span className="text-[11px] font-semibold text-slate-700">
                      {selectedRoleLabel}
                    </span>
                    <ChevronDown
                      size={13}
                      className={`text-slate-400 transition-transform ${showRoleDropdown ? "rotate-180" : ""}`}
                    />
                  </button>
                  {showRoleDropdown && (
                    <div className="absolute top-full right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-lg z-50 min-w-full">
                      {ROLE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setRoleFilter(opt.value);
                            setShowRoleDropdown(false);
                            setPage(1);
                          }}
                          className={`block w-full text-left px-4 py-2.5 text-[11px] font-medium hover:bg-sky-50 transition-colors ${roleFilter === opt.value ? "text-[#0080C5] font-semibold" : "text-[#0A0F1E]"}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {/* Filter aksi */}
              <div className="relative">
                <button
                  onClick={() => setShowAksiDropdown((v) => !v)}
                  className="h-10 px-4 min-w-[140px] bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 hover:bg-slate-50 transition-all"
                >
                  <span className="text-[11px] font-semibold text-slate-700">
                    {selectedAksiLabel}
                  </span>
                  <ChevronDown
                    size={13}
                    className={`text-slate-400 transition-transform ${showAksiDropdown ? "rotate-180" : ""}`}
                  />
                </button>
                {showAksiDropdown && (
                  <div className="absolute top-full right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-lg z-50 min-w-full">
                    {AKSI_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setAksiFilter(opt.value);
                          setShowAksiDropdown(false);
                          setPage(1);
                        }}
                        className={`block w-full text-left px-4 py-2.5 text-[11px] font-medium hover:bg-sky-50 transition-colors ${aksiFilter === opt.value ? "text-[#0080C5] font-semibold" : "text-[#0A0F1E]"}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabel */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-[#0080C5]" size={40} />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-red-500 mb-4">Gagal memuat log aktivitas.</p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-[#0080C5] text-white rounded-lg"
              >
                Coba Lagi
              </button>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-slate-500">Tidak ada log aktivitas.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#FAFBFD] border-b border-slate-100">
                    <th className="py-4 px-6 text-left text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      AKSI
                    </th>
                    <th className="py-4 px-6 text-left text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      MODUL
                    </th>
                    <th className="py-4 px-6 text-left text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      NAMA
                    </th>
                    <th className="py-4 px-6 text-left text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      ROLE
                    </th>
                    <th className="py-4 px-6 text-left text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      DESKRIPSI
                    </th>
                    <th className="py-4 px-6 text-left text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      WAKTU
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {logs.map((log, index) => {
                    const aksi = log.aksi || "Unknown";
                    const style = getAksiStyles(aksi);
                    const initial = log.user?.name
                      ? log.user.name.substring(0, 2).toUpperCase()
                      : "??";
                    const roleName = log.user?.role?.name || "-";
                    return (
                      <tr
                        key={log.id_log || index}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="py-3.5 px-6">
                          <div
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${style.bg} ${style.text} rounded-full`}
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${style.dot}`}
                            />
                            <span className="text-[10px] font-bold">
                              {aksi}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-6 text-[11px] font-semibold text-slate-600">
                          {log.modul || "-"}
                        </td>
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-8 h-8 ${style.bg} ${style.text} rounded-full flex items-center justify-center text-[10px] font-bold shrink-0`}
                            >
                              {initial}
                            </div>
                            <div>
                              <div className="text-[11px] font-semibold text-slate-950">
                                {log.user?.name || "-"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-6 text-[11px] text-slate-500 capitalize">
                          {roleName.replace(/_/g, " ")}
                        </td>
                        <td className="py-3.5 px-6">
                          <div className="flex items-start gap-2">
                            <CheckSquare
                              size={13}
                              className="text-[#00BC7D] shrink-0 mt-0.5"
                            />
                            <span className="text-xs text-slate-600 line-clamp-2">
                              {log.deskripsi || "-"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-6 text-[11px] text-slate-400 font-medium whitespace-nowrap">
                          {formatTime(log.created_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {meta.total > 0 && (
            <div className="px-8 py-4 border-t border-slate-100 flex justify-between items-center">
              <p className="text-xs text-slate-400">
                Menampilkan{" "}
                <span className="font-bold text-slate-950">
                  {meta.from}–{meta.to}
                </span>{" "}
                dari{" "}
                <span className="font-bold text-slate-950">{meta.total}</span>{" "}
                aktivitas
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-50"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="h-7 px-3 bg-[#0080C5] text-white rounded-lg flex items-center text-xs font-bold">
                  {page}
                </span>
                <button
                  onClick={() =>
                    setPage((p) => (p < meta.last_page ? p + 1 : p))
                  }
                  disabled={page === meta.last_page}
                  className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-50"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default LogAktifitasPage;
