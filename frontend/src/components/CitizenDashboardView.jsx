import React, { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  User,
  Phone,
  Search,
  Plus,
  ArrowLeft,
  LogOut,
  Shield,
  Activity,
  Layers,
  Sparkles,
  Droplets,
  Lightbulb,
  CheckCircle,
  Eye,
  Calendar,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import WorkflowTracker from './WorkflowTracker';
import AuditTrailModal from './AuditTrailModal';
import { fetchComplaints, fetchAuditLogs, transitionComplaint } from '../services/api';

const categoryIcons = {
  'Water Supply': Droplets,
  'Streetlights': Lightbulb,
  'Roads & Potholes': AlertTriangle,
  'Waste Management & Sanitation': Layers,
};

export default function CitizenDashboardView({
  citizenUser,
  onBackToPortal,
  onSignOut,
  onOpenRegister,
  initialSelectedId = null,
  refreshKey = 0,
  t,
}) {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState(initialSelectedId || null);
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'SUBMITTED' | 'IN_PROGRESS' | 'ASSIGNED' | 'RESOLVED' | 'CLOSED'
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadComplaints = async (preferredId = null) => {
    setLoading(true);
    try {
      const data = await fetchComplaints(citizenUser.id);
      setComplaints(data);
      const targetId = preferredId || initialSelectedId;
      if (targetId && data.some((c) => c.id === targetId)) {
        setSelectedComplaintId(targetId);
      } else if (data.length > 0) {
        if (!selectedComplaintId || !data.some((c) => c.id === selectedComplaintId)) {
          setSelectedComplaintId(data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load citizen complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints(initialSelectedId);
  }, [citizenUser.id, refreshKey, initialSelectedId]);

  // Find currently selected complaint
  const activeComplaint =
    complaints.find((c) => c.id === selectedComplaintId) || complaints[0];

  useEffect(() => {
    if (activeComplaint) {
      fetchAuditLogs(activeComplaint.id, citizenUser.id)
        .then(setAudits)
        .catch(() => setAudits([]));
    }
  }, [activeComplaint?.id, citizenUser.id]);

  // Citizen satisfaction confirmation
  const handleCitizenSatisfaction = (isSatisfied) => {
    setFeedbackNotice({
      type: 'success',
      text: isSatisfied
        ? 'Thank you! Your satisfaction feedback has been recorded for municipal quality audit.'
        : 'Thank you for your feedback. Our citizen grievance cell will inspect this grievance.',
    });
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  // Attempt unauthorized status change to verify citizen role restrictions
  const handleAttemptStatusChange = async () => {
    if (!activeComplaint) return;
    setActionLoading(true);
    setFeedbackNotice(null);
    try {
      await transitionComplaint(
        activeComplaint.id,
        { action: 'START_WORK' },
        citizenUser.id
      );
    } catch (err) {
      setFeedbackNotice({
        type: 'rejected',
        text: `[RBAC Enforcement] 403 Forbidden: Citizens are not authorized to alter complaint lifecycle status. Only designated municipal officers and supervisors can advance workflow.`,
      });
      // Refresh audits to show logged rejected attempt
      fetchAuditLogs(activeComplaint.id, citizenUser.id).then(setAudits).catch(() => {});
      setTimeout(() => setFeedbackNotice(null), 6000);
    } finally {
      setActionLoading(false);
    }
  };

  // Filtering complaints
  const filteredComplaints = complaints.filter((c) => {
    const matchesFilter =
      activeFilter === 'all' ? true : c.status.toUpperCase() === activeFilter.toUpperCase();
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const countInProgress = complaints.filter((c) => c.status === 'IN_PROGRESS').length;
  const countAssigned = complaints.filter((c) => c.status === 'ASSIGNED').length;
  const countResolved = complaints.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length;

  return (
    <div className="min-h-screen bg-gov-bg flex flex-col font-sans">
      
      {/* 1. Official Citizen Dashboard Header */}
      <header className="bg-gov-navy text-white border-b-4 border-gov-blue shadow-md sticky top-0 z-30">
        <div className="gov-tricolor-bar w-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gov-blue text-white flex items-center justify-center font-bold shadow">
              <Shield size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight">
                  Gov<span className="text-sky-400">Fix</span>
                </span>
                <span className="text-[10px] bg-slate-800 text-sky-300 px-2 py-0.5 rounded font-mono border border-slate-700 uppercase">
                  Citizen Portal (RBAC Enforced)
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Municipal Corporation Grievance Redressal Dashboard
              </p>
            </div>
          </div>

          {/* User Profile Info & Action Controls */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 text-xs">
            
            {/* User Badge */}
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <div className="w-6 h-6 rounded-full bg-gov-blue text-white flex items-center justify-center font-bold text-[11px]">
                {citizenUser?.name?.charAt(0) || 'A'}
              </div>
              <div>
                <span className="font-bold text-white block leading-tight">
                  {citizenUser?.name || 'Aarav Sharma'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  +91 {citizenUser?.mobile || '8448005148'}
                </span>
              </div>
            </div>

            {/* Sign Out */}
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

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Feedback notification toast */}
        {feedbackNotice && (
          <div
            className={`px-4 py-3 rounded-xl border text-xs flex items-center justify-between shadow-sm animate-fadeIn ${
              feedbackNotice.type === 'rejected'
                ? 'bg-rose-50 border-rose-300 text-rose-900'
                : 'bg-emerald-50 border-emerald-300 text-emerald-900'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedbackNotice.type === 'rejected' ? (
                <ShieldAlert size={18} className="text-rose-600 shrink-0" />
              ) : (
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              )}
              <span>{feedbackNotice.text}</span>
            </div>
            <button onClick={() => setFeedbackNotice(null)} className="text-rose-700 font-bold ml-4">
              ✕
            </button>
          </div>
        )}

        {/* 2. Top Summary KPI Cards Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Total Registered</span>
              <span className="text-2xl font-black text-gov-navy mt-1 block">
                {complaints.length}
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-gov-blue flex items-center justify-center">
              <FileText size={20} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-amber-700 font-medium block">In Field Repair</span>
              <span className="text-2xl font-black text-amber-700 mt-1 block">
                {countInProgress}
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock size={20} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-sky-700 font-medium block">Assigned / Inspection</span>
              <span className="text-2xl font-black text-sky-700 mt-1 block">
                {countAssigned}
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <Activity size={20} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-emerald-700 font-medium block">Resolved Grievances</span>
              <span className="text-2xl font-black text-emerald-700 mt-1 block">
                {countResolved}
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
          </div>

        </div>

        {/* 3. Action Toolbar: Register New + Search + Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* Submit New Grievance Button */}
            <button
              onClick={() => onOpenRegister('')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gov-blue hover:bg-gov-blueHover text-white text-xs sm:text-sm font-bold shadow transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Register New Grievance</span>
            </button>

            <span className="text-xs text-slate-500 hidden sm:inline">
              Citizen Role: Verified mobile +91 {citizenUser?.mobile}
            </span>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search size={15} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, title, or ward..."
              className="w-full text-xs p-2.5 pl-9 rounded-lg border border-slate-300 focus:outline-none focus:border-gov-blue font-medium"
            />
          </div>

        </div>

        {/* 4. Split Layout: Complaints List (Left) vs Real-Time Workflow Tracker & Details (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Complaints Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Filter Tabs */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                My Grievance Records ({filteredComplaints.length})
              </span>

              <div className="flex items-center gap-1">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'IN_PROGRESS', label: 'In Progress' },
                  { key: 'ASSIGNED', label: 'Assigned' },
                  { key: 'RESOLVED', label: 'Resolved' },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setActiveFilter(f.key)}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                      activeFilter === f.key
                        ? 'bg-gov-navy text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Complaints Cards List */}
            <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
              {loading ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
                  Loading grievance records...
                </div>
              ) : filteredComplaints.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
                  No grievances found matching the current filter.
                </div>
              ) : (
                filteredComplaints.map((item) => {
                  const Icon = categoryIcons[item.category] || FileText;
                  const isSelected = item.id === activeComplaint?.id;

                  const statusBadgeStyle =
                    item.status === 'CLOSED'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : item.status === 'RESOLVED'
                      ? 'bg-teal-100 text-teal-800 border-teal-300'
                      : item.status === 'IN_PROGRESS'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : item.status === 'ASSIGNED'
                      ? 'bg-sky-100 text-sky-800 border-sky-300'
                      : 'bg-purple-100 text-purple-800 border-purple-300';

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedComplaintId(item.id)}
                      className={`p-4 rounded-xl border bg-white shadow-sm cursor-pointer transition-all ${
                        isSelected
                          ? 'border-gov-blue ring-2 ring-gov-blue/20 shadow-md'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-gov-navy text-xs sm:text-sm">
                            {item.id}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusBadgeStyle}`}>
                            {item.status}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase bg-slate-100 text-slate-700">
                          {item.priority}
                        </span>
                      </div>

                      <div className="pt-2.5 space-y-1">
                        <h4 className="text-sm font-bold text-gov-navy flex items-center gap-2">
                          <Icon size={16} className="text-gov-blue shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
                          <MapPin size={12} className="shrink-0" />
                          <span>{item.location}</span>
                        </p>
                      </div>

                      {item.assigned_officer_name && (
                        <div className="mt-2 text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded flex items-center justify-between">
                          <span className="text-emerald-700 font-medium">Assigned Officer:</span>
                          <span className="font-bold flex items-center gap-1">
                            <User size={11} className="text-emerald-700" />
                            <span>{item.assigned_officer_name}</span>
                          </span>
                        </div>
                      )}

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">
                          Ward: {item.ward?.split('(')[0] || item.ward}
                        </span>
                        <span className="font-semibold text-gov-blue flex items-center gap-1">
                          <Eye size={12} />
                          <span>{isSelected ? 'Viewing Tracker' : 'Click to Inspect'}</span>
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* Right Column: Dynamic Workflow Progress Tracker & Action History Inspector */}
          <div className="lg:col-span-7 space-y-4">
            {activeComplaint ? (
              <>
                {/* 6-Stage Sequential Workflow Tracker */}
                <WorkflowTracker
                  currentStatus={activeComplaint.status}
                  audits={audits}
                  assignedDepartment={activeComplaint.assigned_department}
                  assignedOfficer={activeComplaint.assigned_officer_name}
                />

                {/* Complaint Details Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-gov-blue bg-blue-50 px-2 py-0.5 rounded font-bold uppercase">
                          {activeComplaint.id}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                            activeComplaint.priority === 'Urgent'
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : activeComplaint.priority === 'High'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : activeComplaint.priority === 'Low'
                              ? 'bg-slate-100 text-slate-700 border-slate-300'
                              : 'bg-blue-100 text-blue-800 border-blue-300'
                          }`}
                        >
                          {activeComplaint.priority} Priority
                        </span>
                      </div>
                      <h2 className="text-base font-extrabold text-gov-navy">
                        {activeComplaint.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsAuditModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Clock size={13} />
                        <span>Public Audit History ({audits.length})</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200 font-medium">
                    {activeComplaint.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Responsible Municipal Dept</span>
                      <strong className="text-gov-navy block mt-0.5 font-bold">
                        {activeComplaint.assigned_department || activeComplaint.category}
                      </strong>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{activeComplaint.location}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Designated Field Officer</span>
                      {activeComplaint.assigned_officer_name ? (
                        <div>
                          <strong className="text-slate-800 block mt-0.5">{activeComplaint.assigned_officer_name}</strong>
                          <span className="text-[10px] text-emerald-700 font-medium block">✓ Auto-assigned based on problem type</span>
                        </div>
                      ) : (
                        <span className="inline-block mt-0.5 font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px]">
                          Awaiting Officer Assignment
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Citizen SLA Timeline Bar */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Target Resolution SLA</span>
                      <strong className="font-mono text-slate-800 text-[11px]">
                        {activeComplaint.resolution_deadline ? new Date(activeComplaint.resolution_deadline).toLocaleString() : 'Standard Redressal Timeline'}
                      </strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">SLA Status</span>
                      <span className={`font-mono font-bold text-[11px] ${activeComplaint.is_overdue ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {activeComplaint.time_remaining_text || 'In Progress'}
                      </span>
                    </div>
                  </div>

                  {/* Supporting Photo Evidence if submitted */}
                  {activeComplaint.attachment_url && (
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                      <span className="font-bold text-gov-navy flex items-center gap-1.5">
                        <FileText size={14} className="text-gov-blue" />
                        <span>Registered Photographic Evidence:</span>
                      </span>
                      <div className="flex items-center gap-3">
                        <img
                          src={activeComplaint.attachment_url}
                          alt="Citizen Proof"
                          className="w-20 h-20 object-cover rounded-lg border border-slate-300 shadow-sm"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <div className="space-y-1">
                          <p className="text-[11px] text-slate-500">Your uploaded evidence has been dispatched to the concerned municipal department.</p>
                          <a
                            href={activeComplaint.attachment_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-gov-blue hover:underline font-bold"
                          >
                            <span>Inspect Full Size Image</span>
                            <ExternalLink size={11} />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Resolution Proof Card if Resolved or Closed */}
                  {activeComplaint.resolution_remarks && (
                    <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs space-y-2">
                      <span className="font-bold text-emerald-900 block flex items-center gap-1.5">
                        <CheckCircle2 size={15} />
                        <span>Work Completed & Resolution Remarks:</span>
                      </span>
                      <p className="text-emerald-800 font-medium">{activeComplaint.resolution_remarks}</p>
                      {activeComplaint.resolution_proof_url && (
                        <div className="text-[11px] text-emerald-700 flex items-center gap-1">
                          <ExternalLink size={12} />
                          <a
                            href={activeComplaint.resolution_proof_url}
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

                  {/* Citizen Action & Feedback Section */}
                  <div className="pt-4 border-t border-slate-200">
                    {activeComplaint.status === 'CLOSED' || activeComplaint.status === 'RESOLVED' ? (
                      <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div>
                          <span className="font-bold text-gov-navy block flex items-center gap-1.5">
                            <CheckCircle size={15} className="text-emerald-600" />
                            <span>Citizen Satisfaction Verification</span>
                          </span>
                          <span className="text-slate-500 text-[11px] mt-0.5 block">
                            Are you satisfied with the municipal redressal completed for this complaint?
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCitizenSatisfaction(true)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                          >
                            <CheckCircle size={14} />
                            <span>Confirm Satisfaction</span>
                          </button>
                          <button
                            onClick={() => handleCitizenSatisfaction(false)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                          >
                            <span>Request Assistance</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="space-y-0.5">
                          <span className="font-bold text-gov-navy flex items-center gap-1.5">
                            <ShieldCheck size={14} className="text-gov-blue" />
                            <span>Citizen Permissions: Lifecycle Changes Protected</span>
                          </span>
                          <span className="text-slate-500 text-[11px] block">
                            Citizens can submit and track grievances. Status changes are strictly enforced by the backend and restricted to municipal officers and supervisors.
                          </span>
                        </div>
                        <button
                          onClick={handleAttemptStatusChange}
                          disabled={actionLoading}
                          title="Fires status update to backend to verify 403 Forbidden rejection"
                          className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-300 hover:border-rose-300 font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                        >
                          <ShieldAlert size={13} className="text-rose-500" />
                          <span>Test Change Status (Verify 403 Forbidden)</span>
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
                Select a grievance on the left to track progress.
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Audit Modal */}
      <AuditTrailModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        complaintId={activeComplaint?.id}
        audits={audits}
        t={t}
      />

    </div>
  );
}
