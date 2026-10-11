import React, { useState } from 'react';
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
} from 'lucide-react';
import { mockComplaintsData } from '../data/mockComplaints';

const categoryIcons = {
  'Water Supply': Droplets,
  'Streetlights': Lightbulb,
  'Roads & Potholes': AlertTriangle,
};

export default function CitizenDashboardView({
  citizenUser,
  onBackToPortal,
  onSignOut,
  onOpenRegister,
  t,
}) {
  const [selectedComplaintId, setSelectedComplaintId] = useState(mockComplaintsData[0].id);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'in_progress' | 'assigned' | 'resolved'
  const [searchQuery, setSearchQuery] = useState('');

  // Find currently selected complaint
  const activeComplaint =
    mockComplaintsData.find((c) => c.id === selectedComplaintId) || mockComplaintsData[0];

  // Filtering complaints
  const filteredComplaints = mockComplaintsData.filter((c) => {
    const matchesFilter =
      activeFilter === 'all' ? true : c.status === activeFilter;
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const countInProgress = mockComplaintsData.filter((c) => c.status === 'in_progress').length;
  const countAssigned = mockComplaintsData.filter((c) => c.status === 'assigned').length;
  const countResolved = mockComplaintsData.filter((c) => c.status === 'resolved').length;

  return (
    <div className="min-h-screen bg-gov-bg flex flex-col">
      
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
                  Citizen Portal
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

            {/* Back to Public Website */}
            <button
              onClick={onBackToPortal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer border border-slate-700 font-semibold"
            >
              <ArrowLeft size={14} />
              <span>Public Homepage</span>
            </button>

            {/* Sign Out */}
            <button
              onClick={onSignOut}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-200 transition-colors cursor-pointer border border-red-800/60 font-semibold"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>

          </div>

        </div>
      </header>

      {/* 2. Main Dashboard Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Banner & Register CTA */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-blue bg-blue-50 px-2.5 py-0.5 rounded">
              <CheckCircle2 size={13} />
              <span>Verified Resident Citizen</span>
            </div>
            <h1 className="text-2xl font-black text-gov-navy tracking-tight">
              Welcome, {citizenUser?.name || 'Aarav Sharma'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5">
              <MapPin size={14} className="text-slate-400" />
              <span>Assigned Ward: <strong>{citizenUser?.ward || 'Ward No. 14 (Shivaji Chowk - Station Road)'}</strong></span>
              <span className="text-slate-300">•</span>
              <span className="font-mono text-slate-500">Citizen ID: CTZ-8448-WD14</span>
            </p>
          </div>

          <button
            onClick={onOpenRegister}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gov-blue hover:bg-gov-blueHover text-white text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
          >
            <Plus size={18} />
            <span>File a New Grievance</span>
          </button>
        </div>

        {/* 3. Four Status Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total */}
          <div
            onClick={() => setActiveFilter('all')}
            className={`p-4 rounded-xl border bg-white shadow-sm cursor-pointer transition-all ${
              activeFilter === 'all' ? 'border-gov-blue ring-2 ring-gov-blue/20' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
              <span>Total Grievances</span>
              <FileText size={16} className="text-slate-400" />
            </div>
            <div className="text-2xl font-black text-gov-navy font-mono">
              {mockComplaintsData.length}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Registered by your mobile number
            </span>
          </div>

          {/* Card 2: In Progress */}
          <div
            onClick={() => setActiveFilter('in_progress')}
            className={`p-4 rounded-xl border bg-white shadow-sm cursor-pointer transition-all ${
              activeFilter === 'in_progress' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-amber-700 font-semibold mb-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping inline-block" />
                In Progress (Active)
              </span>
              <Activity size={16} className="text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-900 font-mono">
              {countInProgress}
            </div>
            <span className="text-[11px] text-amber-700 font-medium">
              Ground repair gang deployed
            </span>
          </div>

          {/* Card 3: Assigned / Inspection */}
          <div
            onClick={() => setActiveFilter('assigned')}
            className={`p-4 rounded-xl border bg-white shadow-sm cursor-pointer transition-all ${
              activeFilter === 'assigned' ? 'border-sky-500 ring-2 ring-sky-500/20' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-sky-700 font-semibold mb-1">
              <span>Under Inspection</span>
              <Clock size={16} className="text-sky-500" />
            </div>
            <div className="text-2xl font-black text-sky-900 font-mono">
              {countAssigned}
            </div>
            <span className="text-[11px] text-sky-700 font-medium">
              Engineer assigned for review
            </span>
          </div>

          {/* Card 4: Resolved */}
          <div
            onClick={() => setActiveFilter('resolved')}
            className={`p-4 rounded-xl border bg-white shadow-sm cursor-pointer transition-all ${
              activeFilter === 'resolved' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold mb-1">
              <span>Resolved &amp; Closed</span>
              <CheckCircle2 size={16} className="text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-900 font-mono">
              {countResolved}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">
              Verified with citizen feedback
            </span>
          </div>

        </div>

        {/* 4. Split Dashboard Grid: Left Complaint List | Right Dynamic Timeline Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Complaint Directory & Filter Tabs */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Filter Tabs & Search Header */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gov-navy flex items-center gap-2">
                  <Layers size={16} className="text-gov-blue" />
                  <span>My Complaints Directory ({filteredComplaints.length})</span>
                </h3>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ID, Category, or Landmark..."
                  className="w-full text-xs p-2 pl-9 rounded-lg border border-slate-300 focus:outline-none focus:border-gov-blue"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                    activeFilter === 'all' ? 'bg-gov-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({mockComplaintsData.length})
                </button>
                <button
                  onClick={() => setActiveFilter('in_progress')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                    activeFilter === 'in_progress' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  In Progress ({countInProgress})
                </button>
                <button
                  onClick={() => setActiveFilter('assigned')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                    activeFilter === 'assigned' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Under Inspection ({countAssigned})
                </button>
                <button
                  onClick={() => setActiveFilter('resolved')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                    activeFilter === 'resolved' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Resolved ({countResolved})
                </button>
              </div>
            </div>

            {/* Complaints Cards List */}
            <div className="space-y-3">
              {filteredComplaints.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
                  No grievances found matching the current filter.
                </div>
              ) : (
                filteredComplaints.map((item) => {
                  const Icon = categoryIcons[item.category] || FileText;
                  const isSelected = item.id === selectedComplaintId;

                  // Status style
                  const statusBadgeStyle =
                    item.status === 'in_progress'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : item.status === 'assigned'
                      ? 'bg-sky-100 text-sky-800 border-sky-300'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300';

                  // Priority style
                  const priorityStyle =
                    item.priority === 'Urgent'
                      ? 'bg-red-100 text-red-800'
                      : item.priority === 'High'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-slate-100 text-slate-700';

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
                            {item.statusLabel}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${priorityStyle}`}>
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

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">
                          Submitted: {item.submittedAt}
                        </span>
                        <span className="font-semibold text-gov-blue flex items-center gap-1">
                          <Eye size={12} />
                          <span>{isSelected ? 'Viewing Timeline' : 'Click to View'}</span>
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* Right Column: Dynamic Timeline & Action History Inspector */}
          <div className="lg:col-span-6 bg-white rounded-2xl border-2 border-slate-300 p-6 shadow-sm space-y-6">
            
            {/* Active Ticket Header */}
            <div className="border-b border-slate-200 pb-5 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-black text-gov-blue bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  <span>{activeComplaint.id}</span>
                  <span>•</span>
                  <span>{activeComplaint.categoryCode}</span>
                </div>

                {/* Status Badge */}
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    activeComplaint.status === 'in_progress'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : activeComplaint.status === 'assigned'
                      ? 'bg-sky-100 text-sky-800 border-sky-300'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}
                >
                  {activeComplaint.statusLabel}
                </span>
              </div>

              <h2 className="text-lg font-black text-gov-navy">
                {activeComplaint.title}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed">
                {activeComplaint.description}
              </p>

              {/* Meta details strip */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Department</span>
                  <span className="font-bold text-gov-navy">{activeComplaint.assignedDepartment}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Responsible Officer</span>
                  <span className="font-bold text-gov-navy">
                    {activeComplaint.assignedOfficer} ({activeComplaint.officerDesignation})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">SLA Performance</span>
                  <span className="font-bold text-emerald-700">{activeComplaint.slaStatusText}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Officer Direct Helpline</span>
                  <span className="font-mono text-gov-blue font-bold">{activeComplaint.officerContact}</span>
                </div>
              </div>
            </div>

            {/* Stepper Progress Bar (Step 1 to Step 5) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-gov-navy">
                <span className="flex items-center gap-1.5">
                  <Activity size={14} className="text-gov-blue" />
                  Live Redressal Progress
                </span>
                <span className="font-mono text-slate-500">
                  Step {activeComplaint.currentStepIndex + 1} of 5
                </span>
              </div>

              {/* 5-Step Stepper Line */}
              <div className="relative pt-2 pb-2">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
                <div
                  className="absolute top-1/2 left-0 h-1 bg-gov-blue -translate-y-1/2 z-0 transition-all duration-500"
                  style={{
                    width: `${(activeComplaint.currentStepIndex / 4) * 100}%`,
                  }}
                />

                <div className="flex justify-between items-center relative z-10">
                  {[0, 1, 2, 3, 4].map((stepIdx) => {
                    const isDone = stepIdx < activeComplaint.currentStepIndex || activeComplaint.status === 'resolved';
                    const isCurrent = stepIdx === activeComplaint.currentStepIndex && activeComplaint.status !== 'resolved';

                    return (
                      <div
                        key={stepIdx}
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-all ${
                          isDone
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : isCurrent
                            ? 'bg-amber-500 text-white ring-4 ring-amber-200 animate-pulse'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                        title={`Step ${stepIdx + 1}`}
                      >
                        {isDone ? '✓' : stepIdx + 1}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Detailed Timeline Events */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Audit Trail &amp; Action Log
              </h4>

              <div className="space-y-3 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {activeComplaint.timeline.map((step, idx) => {
                  const isDone = step.completed;
                  const isCurrent = step.isActive;

                  return (
                    <div key={idx} className="relative flex items-start gap-3.5 pl-8">
                      {/* Status Icon */}
                      <div
                        className={`absolute left-1.5 top-1 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isDone
                            ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-500'
                            : isCurrent
                            ? 'bg-amber-100 text-amber-800 border-2 border-amber-500 animate-ping-short'
                            : 'bg-slate-100 text-slate-400 border border-slate-300'
                        }`}
                      >
                        {isDone ? '✓' : idx + 1}
                      </div>

                      {/* Content Card */}
                      <div
                        className={`flex-1 p-3.5 rounded-xl border text-xs space-y-1 ${
                          isCurrent
                            ? 'bg-amber-50/70 border-amber-300'
                            : isDone
                            ? 'bg-white border-slate-200'
                            : 'bg-slate-50/50 border-slate-200/60 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-gov-navy">
                            {step.title}
                          </h5>
                          <span className="font-mono text-[10px] text-slate-400 font-bold">
                            {step.time}
                          </span>
                        </div>

                        <p className="text-slate-600 leading-relaxed">
                          {step.detail}
                        </p>

                        <div className="pt-1 text-[11px] text-slate-400 font-medium">
                          Handled by: <strong className="text-slate-700">{step.officer}</strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Resolution Proof Card (If Resolved) */}
            {activeComplaint.status === 'resolved' && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    Verified Resolution Evidence
                  </span>
                  <span className="text-emerald-800 font-semibold font-mono text-[11px]">
                    Citizen Rating: 5/5 ★
                  </span>
                </div>
                <p className="text-emerald-800 text-[11px]">
                  Pothole patchwork completed using hot mix asphalt. Geo-fenced verification coordinates: 19.0760° N, 72.8777° E. Verified by citizen via SMS confirmation.
                </p>
              </div>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}
