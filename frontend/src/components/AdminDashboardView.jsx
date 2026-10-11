import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  FileText,
  Activity,
  Layers,
  ArrowLeft,
  LogOut,
  Clock,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Building,
} from 'lucide-react';
import WorkflowTracker from './WorkflowTracker';
import AuditTrailModal from './AuditTrailModal';
import {
  fetchComplaints,
  fetchComplaintStats,
  fetchAllUsers,
  fetchAuditLogs,
  transitionComplaint,
} from '../services/api';

export default function AdminDashboardView({
  adminUser,
  onBackToPortal,
  onSignOut,
  t,
}) {
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('complaints'); // complaints | users | security
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [simMessage, setSimMessage] = useState(null);
  const [simLoading, setSimLoading] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [compData, usersData, statsData] = await Promise.all([
        fetchComplaints(adminUser.id),
        fetchAllUsers(adminUser.id),
        fetchComplaintStats(adminUser.id),
      ]);
      setComplaints(compData);
      setUsers(usersData);
      setStats(statsData);
      if (compData.length > 0 && !selectedId) {
        setSelectedId(compData[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [adminUser.id]);

  const selectedComplaint = complaints.find((c) => c.id === selectedId) || complaints[0];

  useEffect(() => {
    if (selectedComplaint) {
      fetchAuditLogs(selectedComplaint.id, adminUser.id)
        .then(setAudits)
        .catch(() => setAudits([]));
    }
  }, [selectedComplaint?.id, adminUser.id]);



  const filteredComplaints = complaints.filter((c) => {
    const matchesStatus = statusFilter === 'all' ? true : c.status === statusFilter.toUpperCase();
    const matchesSearch =
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      c.ward.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gov-bg flex flex-col font-sans">
      {/* Header */}
      <header className="bg-gov-navy text-white border-b-4 border-rose-600 shadow-md sticky top-0 z-30">
        <div className="gov-tricolor-bar w-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold shadow">
              <Building size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight">
                  Gov<span className="text-rose-400">Fix</span>
                </span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-400/40 px-2 py-0.5 rounded font-mono uppercase font-bold">
                  Municipal Administrator Central
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                HQ Commissionerate • Full Governance & RBAC Authority
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="font-bold text-white block leading-tight">{adminUser.name}</span>
              <span className="text-[10px] text-slate-400 font-mono">Role: ADMIN (Full Access)</span>
            </div>
            <button
              onClick={onBackToPortal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer border border-slate-700 font-semibold"
            >
              <ArrowLeft size={14} />
              <span>Public Portal</span>
            </button>
            <button
              onClick={onSignOut}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-200 transition-colors cursor-pointer border border-red-800 font-semibold"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            {[
              { key: 'complaints', label: 'All Municipal Complaints', icon: FileText },
              { key: 'users', label: 'RBAC Users & Officers Directory', icon: Users },
              { key: 'security', label: 'Workflow Engine & RBAC Validator', icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveSection(tab.key)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    activeSection === tab.key
                      ? 'bg-gov-navy text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={loadAll}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-gov-navy text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw size={12} />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Global Metric Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Total Files</span>
              <span className="text-lg font-extrabold text-gov-navy">{stats.total}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-500 block font-bold uppercase">Submitted</span>
              <span className="text-lg font-bold text-slate-700">{stats.by_status?.SUBMITTED || 0}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] text-purple-600 block font-bold uppercase">Under Review</span>
              <span className="text-lg font-bold text-purple-700">{stats.by_status?.UNDER_REVIEW || 0}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] text-blue-600 block font-bold uppercase">Assigned</span>
              <span className="text-lg font-bold text-gov-blue">{stats.by_status?.ASSIGNED || 0}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] text-amber-600 block font-bold uppercase">In Progress</span>
              <span className="text-lg font-bold text-amber-600">{stats.by_status?.IN_PROGRESS || 0}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] text-teal-600 block font-bold uppercase">Resolved</span>
              <span className="text-lg font-bold text-teal-700">{stats.by_status?.RESOLVED || 0}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] text-emerald-600 block font-bold uppercase">Closed</span>
              <span className="text-lg font-bold text-emerald-700">{stats.by_status?.CLOSED || 0}</span>
            </div>
          </div>
        )}

        {/* SECTION 1: ALL COMPLAINTS OVERVIEW */}
        {activeSection === 'complaints' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Complaint Directory */}
            <div className="lg:col-span-5 space-y-3">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search all municipal grievances..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full text-xs p-2 pl-9 rounded-lg border border-slate-300 focus:outline-none focus:border-rose-600"
                  />
                </div>

                <div className="flex gap-1 overflow-x-auto pb-1 text-xs">
                  {['all', 'SUBMITTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors whitespace-nowrap cursor-pointer ${
                        statusFilter === st
                          ? 'bg-gov-navy text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                {filteredComplaints.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs ${
                      item.id === selectedComplaint?.id
                        ? 'bg-rose-50/70 border-rose-500 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-gov-navy">{item.id}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'CLOSED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'RESOLVED'
                            ? 'bg-teal-100 text-teal-800'
                            : item.status === 'IN_PROGRESS'
                            ? 'bg-amber-100 text-amber-800'
                            : item.status === 'ASSIGNED'
                            ? 'bg-blue-100 text-gov-blue'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-800 line-clamp-1 mb-1">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{item.ward}</p>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Citizen: {item.citizen_name}</span>
                      <span>Officer: {item.assigned_officer_name || 'Unassigned'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Selected Complaint Detail */}
            <div className="lg:col-span-7 space-y-4">
              {selectedComplaint && (
                <>
                  <WorkflowTracker
                    currentStatus={selectedComplaint.status}
                    audits={audits}
                    assignedOfficer={selectedComplaint.assigned_officer_name}
                  />

                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                          Administrative Audit View
                        </span>
                        <h2 className="text-base font-extrabold text-gov-navy">{selectedComplaint.id}</h2>
                      </div>
                      <button
                        onClick={() => setIsAuditModalOpen(true)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Clock size={13} />
                        <span>Inspect Full Audit Trail ({audits.length})</span>
                      </button>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-800 mb-1">{selectedComplaint.title}</h3>
                      <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                        {selectedComplaint.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Department & Officer</span>
                        <strong className="text-slate-800 block mt-0.5">
                          {selectedComplaint.assigned_department || 'General'} • {selectedComplaint.assigned_officer_name || 'None'}
                        </strong>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Complainant Contact</span>
                        <strong className="text-slate-800 block mt-0.5">
                          {selectedComplaint.citizen_name} (+91 {selectedComplaint.citizen_mobile})
                        </strong>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        )}

        {/* SECTION 2: USERS & RBAC DIRECTORY */}
        {activeSection === 'users' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gov-navy">Registered System Accounts by Role</h3>
                <p className="text-xs text-slate-500">
                  Enforces strict server-side RBAC validation for all four municipal user roles.
                </p>
              </div>
              <span className="text-xs bg-slate-100 text-slate-700 font-mono px-2.5 py-1 rounded font-bold">
                {users.length} registered accounts
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">User ID</th>
                    <th className="p-3">Full Name</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Mobile</th>
                    <th className="p-3">Department / Ward</th>
                    <th className="p-3">Designation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70">
                      <td className="p-3 font-mono font-bold text-gov-navy">{u.id}</td>
                      <td className="p-3 font-bold text-slate-800">{u.name}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            u.role === 'admin'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : u.role === 'supervisor'
                              ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                              : u.role === 'officer'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-blue-100 text-gov-blue border border-blue-300'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-600">+91 {u.mobile}</td>
                      <td className="p-3 text-slate-600">
                        {u.department ? `${u.department} • ` : ''}
                        {u.ward || 'Municipal HQ'}
                      </td>
                      <td className="p-3 text-slate-500">{u.designation || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 3: SYSTEM AUDIT LOG & WORKFLOW COMPLIANCE */}
        {activeSection === 'security' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} className="text-emerald-600" />
                  <div>
                    <h3 className="text-sm font-bold text-gov-navy">
                      Municipal Audit & Compliance Oversight
                    </h3>
                    <p className="text-xs text-slate-500">
                      Immutable journal of all status transitions, officer actions, and access control checks.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Inspecting complaint:</span>
                  <select
                    value={selectedComplaint?.id || ''}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="p-1.5 rounded-lg border border-slate-300 font-mono font-bold text-xs text-gov-navy focus:outline-none focus:border-gov-blue"
                  >
                    {complaints.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.id} - {c.category} ({c.status})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-gov-navy block">
                    Selected Grievance: <span className="font-mono text-gov-blue">{selectedComplaint?.id}</span> — {selectedComplaint?.title}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Ward: {selectedComplaint?.ward} • Current Status: <strong>{selectedComplaint?.status}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-1 rounded border border-emerald-200">
                    Accepted Actions: {audits.filter((a) => a.is_accepted).length}
                  </span>
                  <span className="bg-rose-100 text-rose-800 text-[11px] font-bold px-2 py-1 rounded border border-rose-200">
                    Blocked / Rejected: {audits.filter((a) => !a.is_accepted).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Audit Log Stream */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} className="text-gov-blue" />
                  <span>Real-Time Audit Records for {selectedComplaint?.id}</span>
                </h4>
                <span className="text-[11px] text-slate-500 font-mono">
                  {audits.length} events journaled
                </span>
              </div>

              <div className="space-y-2 max-h-[350px] overflow-y-auto">
                {audits.map((a) => (
                  <div
                    key={a.id}
                    className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-3 ${
                      a.is_accepted
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-rose-50/60 border-rose-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                          a.is_accepted ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                        }`}
                      >
                        {a.is_accepted ? 'ACCEPTED' : 'REJECTED'}
                      </span>
                      <strong className="text-slate-800 font-mono">{a.action}</strong>
                      <span className="text-slate-500 text-[11px]">
                        by {a.user_role} ({a.user_name})
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-600 block line-clamp-1 max-w-xs font-medium">
                        {a.reason || 'Transition recorded'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(a.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Audit Modal */}
      <AuditTrailModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        complaintId={selectedComplaint?.id}
        audits={audits}
        t={t}
      />

    </div>
  );
}
