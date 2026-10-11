import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Wrench,
  Search,
  ArrowLeft,
  LogOut,
  MapPin,
  ExternalLink,
  ShieldAlert,
  FileText,
  UserPlus,
  Check,
  XCircle,
} from 'lucide-react';
import WorkflowTracker from './WorkflowTracker';
import AuditTrailModal from './AuditTrailModal';
import {
  fetchComplaints,
  transitionComplaint,
  fetchAuditLogs,
  fetchOfficers,
} from '../services/api';

export default function SupervisorDashboardView({
  supervisorUser,
  onBackToPortal,
  onSignOut,
  t,
}) {
  const [complaints, setComplaints] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabFilter, setTabFilter] = useState('all'); // all | submitted | under_review | resolved | closed
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Assignment Modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedOfficerId, setSelectedOfficerId] = useState('');
  const [assignRemarks, setAssignRemarks] = useState('');

  // Rejection Modal (Supervisor rejects closure -> returns to IN_PROGRESS)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Audit modal
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [complaintsData, officersData] = await Promise.all([
        fetchComplaints(supervisorUser.id),
        fetchOfficers(supervisorUser.id),
      ]);
      setComplaints(complaintsData);
      setOfficers(officersData);
      if (complaintsData.length > 0 && !selectedId) {
        setSelectedId(complaintsData[0].id);
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [supervisorUser.id]);

  const selectedComplaint = complaints.find((c) => c.id === selectedId) || complaints[0];

  useEffect(() => {
    if (selectedComplaint) {
      fetchAuditLogs(selectedComplaint.id, supervisorUser.id)
        .then(setAudits)
        .catch(() => setAudits([]));
    }
  }, [selectedComplaint?.id, supervisorUser.id]);

  // Transition: Move SUBMITTED -> UNDER_REVIEW
  const handleReviewComplaint = async () => {
    if (!selectedComplaint) return;
    setActionLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await transitionComplaint(
        selectedComplaint.id,
        { action: 'REVIEW', remarks: 'Supervisor verified grievance validity and location.' },
        supervisorUser.id
      );
      setSuccessMessage(`Complaint ${selectedComplaint.id} is now UNDER_REVIEW.`);
      await loadData();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Transition: Assign Officer (UNDER_REVIEW -> ASSIGNED or Reassign)
  const handleOpenAssignModal = () => {
    if (officers.length > 0) {
      setSelectedOfficerId(officers[0].id);
    }
    setAssignRemarks(`Assigned to ward zonal engineer for immediate inspection.`);
    setIsAssignModalOpen(true);
  };

  const handleConfirmAssignment = async (e) => {
    e.preventDefault();
    if (!selectedComplaint || !selectedOfficerId) return;
    setActionLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const isReassign = selectedComplaint.status === 'ASSIGNED';
      await transitionComplaint(
        selectedComplaint.id,
        {
          action: isReassign ? 'REASSIGN' : 'ASSIGN',
          assigned_officer_id: selectedOfficerId,
          remarks: assignRemarks,
        },
        supervisorUser.id
      );
      setSuccessMessage(`Officer successfully assigned to ${selectedComplaint.id}!`);
      setIsAssignModalOpen(false);
      await loadData();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Transition: Step 2 Supervisor Approve Closure (RESOLVED -> CLOSED)
  const handleApproveClosure = async () => {
    if (!selectedComplaint) return;
    setActionLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await transitionComplaint(
        selectedComplaint.id,
        {
          action: 'APPROVE_CLOSURE',
          remarks: 'Supervisor inspected resolution evidence and citizen satisfaction. Closure approved.',
        },
        supervisorUser.id
      );
      setSuccessMessage(`Complaint ${selectedComplaint.id} APPROVED and CLOSED. Lifecycle complete.`);
      await loadData();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Transition: Step 2 Supervisor Reject Closure (RESOLVED -> IN_PROGRESS)
  const handleOpenRejectModal = () => {
    setRejectionReason(
      'Workmanship unsatisfactory or photographic proof incomplete. Requires further ground remediation.'
    );
    setIsRejectModalOpen(true);
  };

  const handleConfirmRejection = async (e) => {
    e.preventDefault();
    if (!selectedComplaint || !rejectionReason.trim()) return;
    setActionLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await transitionComplaint(
        selectedComplaint.id,
        {
          action: 'REJECT_CLOSURE',
          rejection_reason: rejectionReason,
        },
        supervisorUser.id
      );
      setSuccessMessage(`Closure rejected. Complaint ${selectedComplaint.id} returned to IN_PROGRESS for rework.`);
      setIsRejectModalOpen(false);
      await loadData();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };



  const filtered = complaints.filter((c) => {
    const matchesTab =
      tabFilter === 'all'
        ? true
        : tabFilter === 'pending_review'
        ? c.status === 'SUBMITTED'
        : tabFilter === 'awaiting_assign'
        ? c.status === 'UNDER_REVIEW'
        : tabFilter === 'awaiting_approval'
        ? c.status === 'RESOLVED'
        : c.status.toLowerCase() === tabFilter;

    const matchesSearch =
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gov-bg flex flex-col font-sans">
      {/* Header */}
      <header className="bg-gov-navy text-white border-b-4 border-indigo-500 shadow-md sticky top-0 z-30">
        <div className="gov-tricolor-bar w-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow">
              <UserCheck size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight">
                  Gov<span className="text-indigo-400">Fix</span>
                </span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 px-2 py-0.5 rounded font-mono uppercase font-bold">
                  Supervisor Command Desk
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Jurisdiction: {supervisorUser.ward} • {supervisorUser.department}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="font-bold text-white block leading-tight">{supervisorUser.name}</span>
              <span className="text-[10px] text-slate-400 font-mono">ID: {supervisorUser.id}</span>
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
        
        {/* Banner Alert Messages */}
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

        {/* Supervisor Action Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] text-slate-500 block">Total In Jurisdiction</span>
            <span className="text-xl font-bold text-gov-navy">{complaints.length}</span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] text-purple-600 font-bold block">1. Awaiting Review</span>
            <span className="text-xl font-bold text-purple-700">
              {complaints.filter((c) => c.status === 'SUBMITTED').length}
            </span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] text-blue-600 font-bold block">2. Needs Officer Assigned</span>
            <span className="text-xl font-bold text-gov-blue">
              {complaints.filter((c) => c.status === 'UNDER_REVIEW').length}
            </span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] text-amber-600 font-bold block">3. In Field Repair</span>
            <span className="text-xl font-bold text-amber-600">
              {complaints.filter((c) => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length}
            </span>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] text-emerald-600 font-bold block">4. Awaiting Closure Approval</span>
            <span className="text-xl font-bold text-emerald-700">
              {complaints.filter((c) => c.status === 'RESOLVED').length}
            </span>
          </div>
        </div>

        {/* Workflow Master-Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Complaint Stream */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gov-navy flex items-center gap-1.5">
                  <FileText size={16} className="text-indigo-600" />
                  <span>Supervisory Queue</span>
                </h3>
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                  {filtered.length} grievances
                </span>
              </div>

              {/* Search */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search grievance ID or keyword..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full text-xs p-2 pl-9 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-600"
                />
              </div>

              {/* Tab Filters */}
              <div className="flex gap-1 overflow-x-auto pb-1 text-xs">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'pending_review', label: 'New Submitted' },
                  { key: 'awaiting_assign', label: 'Under Review' },
                  { key: 'awaiting_approval', label: 'Needs Closure' },
                  { key: 'closed', label: 'Closed' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setTabFilter(tab.key)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                      tabFilter === tab.key
                        ? 'bg-gov-navy text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Complaint List */}
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {loading ? (
                <div className="text-center py-10 text-slate-400 text-xs">Loading queue...</div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-xl border border-slate-200 p-4 text-xs text-slate-500">
                  No complaints in this queue view.
                </div>
              ) : (
                filtered.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs ${
                      item.id === selectedComplaint?.id
                        ? 'bg-indigo-50/70 border-indigo-500 shadow-sm'
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
                            : item.status === 'UNDER_REVIEW'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-800 line-clamp-1 mb-1">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{item.location}</p>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{item.category}</span>
                      <span>
                        {item.assigned_officer_name
                          ? `Officer: ${item.assigned_officer_name.split(' ')[1] || item.assigned_officer_name}`
                          : 'Unassigned'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Supervision Action Station */}
          <div className="lg:col-span-7 space-y-4">
            {selectedComplaint ? (
              <>
                {/* 6-Stage Workflow Tracker */}
                <WorkflowTracker
                  currentStatus={selectedComplaint.status}
                  audits={audits}
                  assignedOfficer={selectedComplaint.assigned_officer_name}
                />

                {/* Complaint Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                        Supervision File Ref
                      </span>
                      <h2 className="text-base font-extrabold text-gov-navy">{selectedComplaint.id}</h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsAuditModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Clock size={13} />
                        <span>Audit Trail ({audits.length})</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-1">{selectedComplaint.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                      {selectedComplaint.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Category & Ward</span>
                      <strong className="text-slate-800 block mt-0.5">
                        {selectedComplaint.category} • {selectedComplaint.ward}
                      </strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Officer</span>
                      <strong className="text-slate-800 block mt-0.5">
                        {selectedComplaint.assigned_officer_name || 'None (Awaiting Assignment)'}
                      </strong>
                    </div>
                  </div>

                  {/* Resolution Proof Review Section (For Step 2 Approval) */}
                  {selectedComplaint.resolution_remarks && (
                    <div className="bg-teal-50 border border-teal-200 p-4 rounded-xl text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-teal-900 flex items-center gap-1.5">
                          <CheckCircle2 size={16} className="text-teal-700" />
                          <span>Submitted Officer Resolution & Evidence (Step 1 Complete)</span>
                        </span>
                        <span className="text-[10px] bg-teal-200 text-teal-900 px-2 py-0.5 rounded font-mono font-bold">
                          Awaiting Step 2 Supervisor Decision
                        </span>
                      </div>
                      <p className="text-teal-900 font-medium">{selectedComplaint.resolution_remarks}</p>
                      {selectedComplaint.resolution_proof_url && (
                        <div className="pt-1 flex items-center gap-2">
                          <ExternalLink size={13} className="text-teal-700" />
                          <a
                            href={selectedComplaint.resolution_proof_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-teal-800 underline font-bold"
                          >
                            Inspect Photographic Proof
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Previous rejection reason if returned */}
                  {selectedComplaint.rejection_reason && (
                    <div className="bg-amber-50 border border-amber-300 p-3 rounded-lg text-xs space-y-1">
                      <strong className="text-amber-900 block">Active Rejection Reason on Record:</strong>
                      <p className="text-amber-800">{selectedComplaint.rejection_reason}</p>
                    </div>
                  )}

                  {/* Supervisor Action Bar: Next valid supervisory decision */}
                  <div className="pt-3 border-t border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Supervisor Action
                    </span>

                    <div className="flex flex-wrap items-center gap-3">
                      
                      {/* Action A: SUBMITTED -> UNDER_REVIEW */}
                      {selectedComplaint.status === 'SUBMITTED' && (
                        <button
                          onClick={handleReviewComplaint}
                          disabled={actionLoading}
                          className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Clock size={14} />
                          <span>Review & Triage</span>
                        </button>
                      )}

                      {/* Action B: UNDER_REVIEW -> ASSIGNED */}
                      {selectedComplaint.status === 'UNDER_REVIEW' && (
                        <button
                          onClick={handleOpenAssignModal}
                          disabled={actionLoading}
                          className="px-4 py-2 bg-gov-blue hover:bg-gov-blueHover text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <UserPlus size={14} />
                          <span>Assign Officer</span>
                        </button>
                      )}

                      {/* Action C: Reassign Officer (if ASSIGNED) */}
                      {selectedComplaint.status === 'ASSIGNED' && (
                        <button
                          onClick={handleOpenAssignModal}
                          disabled={actionLoading}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg border border-slate-300 flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <RotateCcw size={13} />
                          <span>Reassign Officer</span>
                        </button>
                      )}

                      {/* If IN_PROGRESS -> Show active work status */}
                      {selectedComplaint.status === 'IN_PROGRESS' && (
                        <div className="text-xs bg-amber-50 text-amber-900 border border-amber-200 px-3.5 py-2 rounded-lg font-medium flex items-center gap-2">
                          <Wrench size={14} className="text-amber-700" />
                          <span>Field Work in Progress ({selectedComplaint.assigned_officer_name || 'Assigned Officer'})</span>
                        </div>
                      )}

                      {/* Action D: Review Resolution on RESOLVED */}
                      {selectedComplaint.status === 'RESOLVED' && (
                        <div className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-gov-navy">Review Resolution:</span>
                            <span className="text-[11px] text-slate-500">Examine work proof above before making a decision</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2.5 pt-1">
                            <button
                              onClick={handleApproveClosure}
                              disabled={actionLoading}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors"
                            >
                              <CheckCircle2 size={15} />
                              <span>Approve Closure</span>
                            </button>

                            <button
                              onClick={handleOpenRejectModal}
                              disabled={actionLoading}
                              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors"
                            >
                              <XCircle size={15} />
                              <span>Send Back for Rework</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Status is CLOSED */}
                      {selectedComplaint.status === 'CLOSED' && (
                        <div className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-2 rounded-lg font-bold flex items-center gap-1.5">
                          <ShieldCheck size={16} />
                          <span>Complaint is Closed and Verified.</span>
                        </div>
                      )}

                    </div>
                  </div>

                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
                Select a grievance to manage supervisory decisions.
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Assignment Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="bg-gov-navy text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus size={18} />
                <h3 className="text-sm font-bold">Assign Grievance to Municipal Officer</h3>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmAssignment} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gov-navy mb-1">
                  Select Department Officer *
                </label>
                <select
                  value={selectedOfficerId}
                  onChange={(e) => setSelectedOfficerId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-gov-blue text-xs font-medium"
                  required
                >
                  {officers.map((off) => (
                    <option key={off.id} value={off.id}>
                      {off.name} • {off.department} ({off.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gov-navy mb-1">
                  Supervisory Dispatch Instructions
                </label>
                <textarea
                  rows={2}
                  value={assignRemarks}
                  onChange={(e) => setAssignRemarks(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-gov-blue"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-lg bg-gov-blue hover:bg-gov-blueHover text-white font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Check size={14} />
                  <span>Confirm Assignment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supervisor Rejection Modal (Returns to IN_PROGRESS) */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="bg-rose-700 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle size={18} />
                <h3 className="text-sm font-bold">Reject Closure Request</h3>
              </div>
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="text-rose-200 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmRejection} className="p-6 space-y-4 text-xs">
              <div className="bg-rose-50 border border-rose-200 text-rose-900 p-3 rounded-lg">
                Municipal Governance Rule: Rejection returns the grievance from RESOLVED back to IN_PROGRESS. A detailed reason is mandatory and will be logged in the permanent audit trail.
              </div>

              <div>
                <label className="block font-bold text-gov-navy mb-1">
                  Mandatory Rejection Reason *
                </label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Specify why the resolution was unsatisfactory or what corrective work is needed..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-rose-600"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Return to IN_PROGRESS</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
