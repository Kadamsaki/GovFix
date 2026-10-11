import React, { useState, useEffect } from 'react';
import {
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  FileText,
  Search,
  ArrowLeft,
  LogOut,
  Upload,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Check,
  RotateCcw,
} from 'lucide-react';
import WorkflowTracker from './WorkflowTracker';
import AuditTrailModal from './AuditTrailModal';
import {
  fetchComplaints,
  transitionComplaint,
  fetchAuditLogs,
} from '../services/api';

export default function OfficerDashboardView({
  officerUser,
  onBackToPortal,
  onSignOut,
  t,
}) {
  const [complaints, setComplaints] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, assigned, in_progress, resolved
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Resolution modal state
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [resolutionRemarks, setResolutionRemarks] = useState('');
  const [resolutionProof, setResolutionProof] = useState(
    'https://images.unsplash.com/photo-1584463699039-4448558eb8d5?auto=format&fit=crop&w=400&q=80'
  );

  // Audit modal state
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchComplaints(officerUser.id);
      setComplaints(data);
      if (data.length > 0 && !selectedId) {
        setSelectedId(data[0].id);
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [officerUser.id]);

  const selectedComplaint = complaints.find((c) => c.id === selectedId) || complaints[0];

  useEffect(() => {
    if (selectedComplaint) {
      fetchAuditLogs(selectedComplaint.id, officerUser.id)
        .then((res) => setAudits(res))
        .catch(() => setAudits([]));
    }
  }, [selectedComplaint?.id, officerUser.id]);

  const handleStartWork = async () => {
    if (!selectedComplaint) return;
    setActionLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await transitionComplaint(
        selectedComplaint.id,
        { action: 'START_WORK', remarks: 'Field officer arrived on site and commenced repairs' },
        officerUser.id
      );
      setSuccessMessage(`Complaint ${selectedComplaint.id} is now IN PROGRESS.`);
      await loadData();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenResolveModal = () => {
    setResolutionRemarks(
      `Maintenance and repair completed at ${selectedComplaint.location}. Materials inspected and tested.`
    );
    setIsResolveModalOpen(true);
  };

  const handleSubmitResolve = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    setActionLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await transitionComplaint(
        selectedComplaint.id,
        {
          action: 'RESOLVE',
          resolution_remarks: resolutionRemarks,
          resolution_proof_url: resolutionProof,
        },
        officerUser.id
      );
      setSuccessMessage(`Complaint ${selectedComplaint.id} successfully marked as RESOLVED and submitted for Supervisor closure approval!`);
      setIsResolveModalOpen(false);
      await loadData();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };



  const filterTabs = [
    { key: 'all', label: 'All Assigned' },
    { key: 'urgent', label: '⚡ Urgent' },
    { key: 'high', label: '🔥 High' },
    { key: 'medium', label: 'Medium' },
    { key: 'low', label: 'Low' },
    { key: 'due_soon', label: '⏳ Due Soon' },
    { key: 'overdue', label: '⚠️ Overdue' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'resolved', label: 'Resolved' },
  ];

  const filtered = complaints.filter((c) => {
    let matchesFilter = true;
    switch (filter) {
      case 'urgent':
        matchesFilter = (c.priority || '').toLowerCase() === 'urgent';
        break;
      case 'high':
        matchesFilter = (c.priority || '').toLowerCase() === 'high';
        break;
      case 'medium':
        matchesFilter = (c.priority || '').toLowerCase() === 'medium';
        break;
      case 'low':
        matchesFilter = (c.priority || '').toLowerCase() === 'low';
        break;
      case 'due_soon':
        matchesFilter =
          !c.is_overdue &&
          c.status !== 'RESOLVED' &&
          c.status !== 'CLOSED' &&
          c.time_remaining_seconds > 0 &&
          c.time_remaining_seconds <= 6 * 3600;
        break;
      case 'overdue':
        matchesFilter = Boolean(c.is_overdue) && c.status !== 'RESOLVED' && c.status !== 'CLOSED';
        break;
      case 'in_progress':
        matchesFilter = c.status === 'IN_PROGRESS';
        break;
      case 'resolved':
        matchesFilter = c.status === 'RESOLVED';
        break;
      case 'assigned':
        matchesFilter = c.status === 'ASSIGNED';
        break;
      case 'all':
      default:
        matchesFilter = true;
        break;
    }

    const matchesSearch =
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(search.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  // Sort urgent and overdue complaints prominently
  const sortedComplaints = [...filtered].sort((a, b) => {
    const aOverdue = a.is_overdue && a.status !== 'RESOLVED' && a.status !== 'CLOSED';
    const bOverdue = b.is_overdue && b.status !== 'RESOLVED' && b.status !== 'CLOSED';
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;

    const priorityRanks = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
    const aP = priorityRanks[a.priority] || 0;
    const bP = priorityRanks[b.priority] || 0;
    if (aP !== bP) return bP - aP;

    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <div className="min-h-screen bg-gov-bg flex flex-col font-sans">
      {/* Header */}
      <header className="bg-gov-navy text-white border-b-4 border-amber-500 shadow-md sticky top-0 z-30">
        <div className="gov-tricolor-bar w-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500 text-slate-900 flex items-center justify-center font-bold shadow">
              <Wrench size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight">
                  Gov<span className="text-amber-400">Fix</span>
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded font-mono uppercase font-bold">
                  Municipal Officer Console
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Department: {officerUser.department || 'Municipal Grievances'} • {officerUser.designation}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="font-bold text-white block leading-tight">{officerUser.name}</span>
              <span className="text-[10px] text-slate-400 font-mono">ID: {officerUser.id}</span>
            </div>

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
        
        {/* Banner Alert for Messages */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-300 text-rose-900 px-4 py-3 rounded-xl text-xs flex items-center justify-between shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <ShieldAlert size={18} className="text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-rose-700 font-bold ml-4">
              ✕
            </button>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl text-xs flex items-center justify-between shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="text-emerald-700 font-bold ml-4">
              ✕
            </button>
          </div>
        )}

        {/* Top Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] text-slate-500 block">Total Assigned Orders</span>
            <span className="text-xl font-bold text-gov-navy">{complaints.length}</span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] text-rose-600 font-bold block">Overdue SLA Breaches</span>
            <span className="text-xl font-bold text-rose-600">
              {complaints.filter((c) => c.is_overdue && c.status !== 'RESOLVED' && c.status !== 'CLOSED').length}
            </span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] text-amber-600 font-bold block">Active In Progress</span>
            <span className="text-xl font-bold text-amber-600">
              {complaints.filter((c) => c.status === 'IN_PROGRESS').length}
            </span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] text-emerald-600 font-bold block">Resolved (Pending Approval)</span>
            <span className="text-xl font-bold text-emerald-600">
              {complaints.filter((c) => c.status === 'RESOLVED').length}
            </span>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Assigned List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gov-navy flex items-center gap-1.5">
                  <FileText size={16} className="text-amber-500" />
                  <span>My Assigned Tasks</span>
                </h3>
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                  {sortedComplaints.length} items
                </span>
              </div>

              {/* Search & Filter */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by ID, title, keyword, or ward..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full text-xs p-2 pl-9 rounded-lg border border-slate-300 focus:outline-none focus:border-gov-blue"
                />
              </div>

              <div className="flex gap-1 overflow-x-auto pb-1 text-xs">
                {filterTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                      filter === tab.key
                        ? 'bg-gov-navy text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {loading ? (
                <div className="text-center py-10 text-slate-400 text-xs">Loading work orders...</div>
              ) : sortedComplaints.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-xl border border-slate-200 p-4 text-xs text-slate-500">
                  No work orders found for selected criteria.
                </div>
              ) : (
                sortedComplaints.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs ${
                      item.id === selectedComplaint?.id
                        ? 'bg-blue-50/80 border-gov-blue shadow-sm ring-1 ring-gov-blue/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-gov-navy">{item.id}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                            item.priority === 'Urgent'
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : item.priority === 'High'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : item.priority === 'Low'
                              ? 'bg-slate-100 text-slate-700 border-slate-300'
                              : 'bg-blue-100 text-blue-800 border-blue-300'
                          }`}
                        >
                          {item.priority}
                        </span>
                        {item.attachment_url && (
                          <span className="text-[9px] bg-slate-100 text-slate-600 px-1 py-0.5 rounded border border-slate-200">
                            📷 Photo
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'IN_PROGRESS'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-gov-blue'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-800 line-clamp-1 mb-1">{item.title}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mb-2">
                      {item.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 space-y-1 text-[10px]">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="flex items-center gap-1 text-slate-700 font-medium">
                          <MapPin size={11} className="text-red-500 shrink-0" />
                          <span className="truncate max-w-[180px]">{item.location}</span>
                        </span>
                        <span className="font-medium text-gov-navy">{item.assigned_department || item.category}</span>
                      </div>

                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-slate-400 font-mono">
                          Assigned: {item.assigned_at ? new Date(item.assigned_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recorded'}
                        </span>
                        {item.is_overdue && item.status !== 'RESOLVED' && item.status !== 'CLOSED' ? (
                          <span className="text-rose-700 font-bold bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                            ⚠️ Overdue
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-mono font-bold">
                            ⏱️ {item.time_remaining_text || 'Active SLA'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Active Task Detail & Officer Action Controls */}
          <div className="lg:col-span-7 space-y-4">
            {selectedComplaint ? (
              <>
                {/* 6-Stage Workflow Tracker */}
                <WorkflowTracker
                  currentStatus={selectedComplaint.status}
                  audits={audits}
                  assignedDepartment={selectedComplaint.assigned_department}
                  assignedOfficer={selectedComplaint.assigned_officer_name}
                />

                {/* Complaint Details Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                          Work Order Reference
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                            selectedComplaint.priority === 'Urgent'
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : selectedComplaint.priority === 'High'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : selectedComplaint.priority === 'Low'
                              ? 'bg-slate-100 text-slate-700 border-slate-300'
                              : 'bg-blue-100 text-blue-800 border-blue-300'
                          }`}
                        >
                          {selectedComplaint.priority} Priority
                        </span>
                      </div>
                      <h2 className="text-base font-extrabold text-gov-navy">{selectedComplaint.id}</h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsAuditModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Clock size={13} />
                        <span>Audit Log ({audits.length})</span>
                      </button>
                    </div>
                  </div>

                  {/* Overdue alert banner if complaint is overdue */}
                  {selectedComplaint.is_overdue && selectedComplaint.status !== 'RESOLVED' && selectedComplaint.status !== 'CLOSED' && (
                    <div className="bg-rose-50 border border-rose-300 text-rose-900 p-3.5 rounded-xl text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold">
                        <ShieldAlert size={18} className="text-rose-600 shrink-0" />
                        <span>SLA TARGET BREACH: This complaint is overdue. Immediate resolution required.</span>
                      </div>
                      <span className="font-mono text-xs font-bold bg-rose-200 text-rose-900 px-2 py-0.5 rounded">
                        {selectedComplaint.time_remaining_text}
                      </span>
                    </div>
                  )}

                  {/* SLA Target Resolution Deadline Box */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Submission Time</span>
                      <strong className="text-slate-700 block mt-0.5 font-mono text-[11px]">
                        {new Date(selectedComplaint.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Assigned Time</span>
                      <strong className="text-slate-700 block mt-0.5 font-mono text-[11px]">
                        {selectedComplaint.assigned_at ? new Date(selectedComplaint.assigned_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recorded'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Resolution Deadline</span>
                      <strong className="text-slate-800 block mt-0.5 font-mono text-[11px]">
                        {selectedComplaint.resolution_deadline ? new Date(selectedComplaint.resolution_deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Pending'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Time Remaining</span>
                      <strong className={`block mt-0.5 font-mono text-[11px] ${selectedComplaint.is_overdue ? 'text-rose-600 font-extrabold' : 'text-emerald-700 font-bold'}`}>
                        {selectedComplaint.time_remaining_text || 'Active'}
                      </strong>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-1">{selectedComplaint.title}</h3>
                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200 font-medium">
                      {selectedComplaint.description}
                    </p>
                  </div>

                  {/* Supporting Photographic Evidence Registered by Citizen */}
                  {selectedComplaint.attachment_url && (
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                      <span className="font-bold text-gov-navy flex items-center gap-1.5">
                        <FileText size={15} className="text-gov-blue" />
                        <span>Citizen Supporting Photo Evidence (Site Defect):</span>
                      </span>
                      <div className="flex items-center gap-3">
                        <img
                          src={selectedComplaint.attachment_url}
                          alt="Citizen Proof"
                          className="w-24 h-24 object-cover rounded-lg border border-slate-300 shadow-sm"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <div className="space-y-1">
                          <p className="text-[11px] text-slate-600">Photographic proof provided during citizen grievance registration.</p>
                          <a
                            href={selectedComplaint.attachment_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-gov-blue hover:underline font-bold"
                          >
                            <span>Inspect Full Size Image</span>
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Location & Ward</span>
                      <strong className="text-slate-800 flex items-center gap-1 mt-0.5">
                        <MapPin size={13} className="text-red-500 shrink-0" />
                        <span>{selectedComplaint.location}</span>
                      </strong>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{selectedComplaint.ward}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Citizen Contact</span>
                      <strong className="text-slate-800 block mt-0.5">
                        {selectedComplaint.citizen_name}
                      </strong>
                      <span className="text-[11px] text-gov-navy font-mono block mt-0.5">
                        +91 {selectedComplaint.citizen_mobile}
                      </span>
                    </div>
                  </div>

                  {/* Existing Resolution Remarks if already resolved */}
                  {selectedComplaint.resolution_remarks && (
                    <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs space-y-2">
                      <span className="font-bold text-emerald-900 block flex items-center gap-1">
                        <CheckCircle2 size={15} />
                        <span>Submitted Resolution Details:</span>
                      </span>
                      <p className="text-emerald-800">{selectedComplaint.resolution_remarks}</p>
                      {selectedComplaint.resolution_proof_url && (
                        <div className="text-[11px] text-emerald-700 flex items-center gap-1">
                          <ExternalLink size={12} />
                          <a
                            href={selectedComplaint.resolution_proof_url}
                            target="_blank"
                            rel="noreferrer"
                            className="underline font-semibold"
                          >
                            View Supporting Photographic Evidence
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Rejection notice if supervisor rejected closure previously */}
                  {selectedComplaint.rejection_reason && (
                    <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-amber-900 flex items-center gap-1">
                        <RotateCcw size={14} />
                        <span>Supervisor Rework Note (Returned for Action):</span>
                      </span>
                      <p className="text-amber-800">{selectedComplaint.rejection_reason}</p>
                    </div>
                  )}

                  {/* Officer Action Bar: Natural next valid step */}
                  <div className="pt-3 border-t border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Available Action
                    </span>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Action 1: If ASSIGNED -> Start Working */}
                      {selectedComplaint.status === 'ASSIGNED' && (
                        <button
                          onClick={handleStartWork}
                          disabled={actionLoading}
                          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-all"
                        >
                          <Wrench size={14} />
                          <span>Start Working</span>
                        </button>
                      )}

                      {/* Action 2: If IN_PROGRESS -> Submit Resolution */}
                      {selectedComplaint.status === 'IN_PROGRESS' && (
                        <button
                          onClick={handleOpenResolveModal}
                          disabled={actionLoading}
                          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-all"
                        >
                          <CheckCircle2 size={14} />
                          <span>Submit Resolution</span>
                        </button>
                      )}

                      {/* If RESOLVED -> Waiting for supervisor approval */}
                      {selectedComplaint.status === 'RESOLVED' && (
                        <div className="text-xs bg-emerald-50 text-emerald-800 px-3.5 py-2.5 rounded-lg border border-emerald-200 flex items-center gap-2">
                          <Clock size={14} className="text-emerald-600" />
                          <span className="font-medium">Resolution Submitted — Awaiting Supervisor Review & Closure</span>
                        </div>
                      )}

                      {/* If CLOSED -> Work order completed */}
                      {selectedComplaint.status === 'CLOSED' && (
                        <div className="text-xs bg-slate-100 text-slate-700 px-3.5 py-2.5 rounded-lg border border-slate-200 flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-emerald-600" />
                          <span className="font-semibold">Work Order Closed and Verified by Municipal Supervisor</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
                Select a work order from the list to view lifecycle details.
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Officer Resolution Modal (Step 1) */}
      {isResolveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="bg-emerald-700 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} />
                <h3 className="text-sm font-bold">Step 1: Submit Work Resolution & Evidence</h3>
              </div>
              <button
                onClick={() => setIsResolveModalOpen(false)}
                className="text-emerald-200 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitResolve} className="p-6 space-y-4 text-xs">
              <div className="bg-blue-50 border border-blue-200 text-blue-900 p-3 rounded-lg">
                Municipal Protocol: Resolution remarks and photographic proof are strictly mandatory before transitioning to RESOLVED status.
              </div>

              <div>
                <label className="block font-bold text-gov-navy mb-1">
                  Resolution Remarks & Actions Taken *
                </label>
                <textarea
                  rows={3}
                  value={resolutionRemarks}
                  onChange={(e) => setResolutionRemarks(e.target.value)}
                  placeholder="Detail the technical repair work, materials replaced, and test checks performed..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gov-navy mb-1">
                  Supporting Proof / Photo Evidence URL *
                </label>
                <input
                  type="text"
                  value={resolutionProof}
                  onChange={(e) => setResolutionProof(e.target.value)}
                  placeholder="Paste URL or upload image reference..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-600 font-mono text-[11px]"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsResolveModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Check size={14} />
                  <span>Submit for Supervisor Approval</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Audit Log Modal */}
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
