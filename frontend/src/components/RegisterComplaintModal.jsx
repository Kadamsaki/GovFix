import React, { useState } from 'react';
import { X, CheckCircle2, Shield, AlertTriangle, MapPin, Camera } from 'lucide-react';
import { submitComplaint } from '../services/api';

export default function RegisterComplaintModal({
  isOpen,
  onClose,
  initialCategory,
  onComplaintCreated,
  currentUser,
  t,
}) {
  const [category, setCategory] = useState(initialCategory || t.services[2]?.title || 'Roads & Potholes');
  const [ward, setWard] = useState('Ward No. 14 (Shivaji Chowk / Station Road)');
  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState(currentUser?.mobile || '8448005148');
  const [priority, setPriority] = useState('Medium');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [submittedId, setSubmittedId] = useState(null);
  const [submittedComplaint, setSubmittedComplaint] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  // Determine responsible department based on category
  const getResponsibleDept = (cat) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('water') || c.includes('jal') || c.includes('pipeline')) return 'Water Supply Department';
    if (c.includes('road') || c.includes('pothole') || c.includes('footpath') || c.includes('street')) return 'Roads & Public Works Department';
    if (c.includes('light') || c.includes('pole') || c.includes('electr')) return 'Electrical Department';
    if (c.includes('garbage') || c.includes('waste') || c.includes('sanitat') || c.includes('safai') || c.includes('kachra')) return 'Sanitation Department';
    if (c.includes('drain') || c.includes('sewag') || c.includes('gutter') || c.includes('manhole')) return 'Drainage Department';
    return 'Public Works & Grievance Cell';
  };

  // Determine auto-assigned field officer based on problem type
  const getAutoAssignedOfficer = (cat) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('water') || c.includes('jal') || c.includes('pipeline')) {
      return { id: 'officer-1', name: 'Er. Amit Deshmukh', role: 'Executive Engineer (Water Works)', dept: 'Water Supply Department' };
    }
    if (c.includes('road') || c.includes('pothole') || c.includes('footpath') || c.includes('street')) {
      return { id: 'officer-2', name: 'Er. Rajesh Sharma', role: 'Junior Engineer (Roads Maintenance)', dept: 'Roads & Public Works Department' };
    }
    if (c.includes('light') || c.includes('pole') || c.includes('electr')) {
      return { id: 'officer-3', name: 'Er. Sandeep More', role: 'Junior Engineer (Electrical & Lighting)', dept: 'Electrical Department' };
    }
    if (c.includes('garbage') || c.includes('waste') || c.includes('sanitat') || c.includes('safai') || c.includes('kachra')) {
      return { id: 'officer-4', name: 'Er. Ramesh Shinde', role: 'Sanitation Superintendent', dept: 'Sanitation Department' };
    }
    if (c.includes('drain') || c.includes('sewag') || c.includes('gutter') || c.includes('manhole')) {
      return { id: 'officer-5', name: 'Er. Ganesh Jadhav', role: 'Drainage & Sewerage Inspector', dept: 'Drainage Department' };
    }
    return { id: 'officer-2', name: 'Er. Rajesh Sharma', role: 'Field Redressal Officer', dept: 'Public Works & Grievance Cell' };
  };

  const slaMap = {
    Urgent: { hours: 6, label: '6 Hours', color: 'bg-rose-100 text-rose-800 border-rose-300' },
    High: { hours: 24, label: '24 Hours', color: 'bg-amber-100 text-amber-800 border-amber-300' },
    Medium: { hours: 48, label: '48 Hours', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    Low: { hours: 72, label: '72 Hours', color: 'bg-slate-100 text-slate-800 border-slate-300' },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const generatedTitle = title.trim() || `${category} issue near ${location.trim() || 'Ward 14'}`;
    const payload = {
      category: category,
      title: generatedTitle.length < 5 ? `${generatedTitle} - Urgent Repair Needed` : generatedTitle,
      description: description.trim() || `Civic issue reported by citizen regarding ${category} at ${location}.`,
      ward: ward,
      location: location.trim() || 'Station Road, Ward 14',
      landmark: 'Near Municipal junction',
      priority: priority,
      attachment_url: attachmentUrl.trim() || null,
    };

    try {
      const citizenId = currentUser?.id || 'citizen-1';
      const created = await submitComplaint(payload, citizenId);
      setSubmittedId(created.id);
      setSubmittedComplaint(created);
    } catch (err) {
      setError(err.message || 'Failed to submit complaint. Please check fields.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinish = () => {
    if (submittedId && onComplaintCreated) {
      onComplaintCreated(submittedId);
    }
    setSubmittedId(null);
    onClose();
  };

  const handleModalClose = () => {
    if (submittedId && onComplaintCreated) {
      onComplaintCreated(submittedId);
    }
    setSubmittedId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gov-navy text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield size={20} className="text-gov-blue" />
            <h3 className="text-base font-bold">
              {t.modalRegisterTitle}
            </h3>
          </div>
          <button
            onClick={handleModalClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="p-3 mb-4 bg-rose-50 border border-rose-300 rounded-lg text-xs text-rose-900">
              {error}
            </div>
          )}

          {submittedId ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>
              <h4 className="text-xl font-bold text-gov-navy">
                {t.successSubmittedTitle}
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Grievance registered and directly dispatched to the designated field officer. No supervisor manual assignment needed.
              </p>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 max-w-sm mx-auto text-left space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-gov-navy border-b border-slate-200 pb-1.5">
                  <span>{t.successRefLabel}</span>
                  <span className="text-gov-blue">{submittedComplaint?.id || submittedId}</span>
                </div>
                <div className="text-xs text-slate-700 space-y-1.5 pt-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Status:</span>
                    <span className="font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                      ASSIGNED (Direct Dispatch)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Auto-Assigned Officer:</span>
                    <span className="font-bold text-gov-navy">
                      {submittedComplaint?.assigned_officer_name || getAutoAssignedOfficer(category).name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Department:</span>
                    <span className="font-medium text-slate-700">
                      {submittedComplaint?.assigned_department || getResponsibleDept(category)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500">
                {t.successSmsNotice}
              </div>

              <div className="pt-2">
                <button
                  onClick={handleFinish}
                  className="px-6 py-2.5 bg-gov-blue hover:bg-gov-blueHover text-white rounded-lg text-sm font-bold shadow-sm transition-all cursor-pointer"
                >
                  {t.btnTrackNow}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Privacy Notice Banner */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 flex items-start gap-2">
                <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-600" />
                <span>{t.modalNoticeText}</span>
              </div>

              {/* Title / Summary */}
              <div>
                <label className="block text-xs font-bold text-gov-navy mb-1">
                  Brief Issue Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Major water leak near market bus stop"
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-gov-blue font-medium"
                  required
                />
              </div>

              {/* Category & Auto-Routed Department & Auto-Assigned Officer Preview */}
              <div>
                <label className="block text-xs font-bold text-gov-navy mb-1">
                  {t.fieldCategory} <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-gov-blue bg-white font-medium"
                  required
                >
                  {t.services.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                  <option value={t.otherCivicTitle}>{t.otherCivicTitle}</option>
                </select>

                {/* Responsible Department & Auto-Assigned Officer Preview Badges */}
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-md">
                    <span className="text-slate-500">Auto-Routed Municipal Department:</span>
                    <span className="font-bold text-gov-navy flex items-center gap-1">
                      <Shield size={12} className="text-gov-blue" />
                      <span>{getResponsibleDept(category)}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-md text-emerald-950">
                    <span className="text-emerald-700 font-medium">Auto-Assigned Field Officer:</span>
                    <span className="font-bold flex items-center gap-1">
                      <span>{getAutoAssignedOfficer(category).name}</span>
                      <span className="text-[10px] text-emerald-600 font-normal">({getAutoAssignedOfficer(category).role})</span>
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1 px-1">
                    <span>⚡ Direct Dispatch: Officer automatically assigned based on problem category. No supervisor delay.</span>
                  </div>
                </div>
              </div>

              {/* Ward Selector */}
              <div>
                <label className="block text-xs font-bold text-gov-navy mb-1">
                  {t.fieldWard} <span className="text-red-500">*</span>
                </label>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-gov-blue bg-white"
                  required
                >
                  <option value="Ward No. 14 (Shivaji Chowk / Station Road)">
                    Ward No. 14 (Shivaji Chowk / Station Road)
                  </option>
                  <option value="Ward No. 03 (Central Market / Town Hall)">
                    Ward No. 03 (Central Market / Town Hall)
                  </option>
                  <option value="Ward No. 08 (Gandhi Nagar / West Zone)">
                    Ward No. 08 (Gandhi Nagar / West Zone)
                  </option>
                  <option value="Ward No. 22 (Industrial Area / Ring Road)">
                    Ward No. 22 (Industrial Area / Ring Road)
                  </option>
                </select>
              </div>

              {/* Exact Location Landmark */}
              <div>
                <label className="block text-xs font-bold text-gov-navy mb-1">
                  {t.fieldLocation} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={t.fieldLocationPlaceholder}
                    className="w-full text-xs sm:text-sm p-2.5 pl-8 rounded-lg border border-slate-300 focus:outline-none focus:border-gov-blue"
                    required
                  />
                  <MapPin size={15} className="absolute left-2.5 top-3 text-slate-400" />
                </div>
              </div>

              {/* Problem Description */}
              <div>
                <label className="block text-xs font-bold text-gov-navy mb-1">
                  {t.fieldDescription} <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.fieldDescriptionPlaceholder}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-gov-blue"
                  required
                />
              </div>

              {/* Priority & SLA Deadline Target */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gov-navy mb-1">
                    {t.fieldMobile} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.fieldMobilePlaceholder}
                    maxLength={10}
                    className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-gov-blue font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gov-navy mb-1">
                    Grievance Urgency / Priority <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-gov-blue bg-white font-medium"
                  >
                    <option value="Urgent">Urgent (6 Hours Target SLA)</option>
                    <option value="High">High (24 Hours Target SLA)</option>
                    <option value="Medium">Medium (48 Hours Target SLA)</option>
                    <option value="Low">Low (72 Hours Target SLA)</option>
                  </select>
                </div>
              </div>

              {/* SLA Target Timeline Pill */}
              <div className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${slaMap[priority]?.color || 'bg-blue-50 text-blue-900 border-blue-200'}`}>
                <span className="font-semibold">Target Resolution SLA:</span>
                <span className="font-extrabold font-mono">
                  {slaMap[priority]?.label} from complaint registration
                </span>
              </div>

              {/* Supporting Evidence / Photo Attachment */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gov-navy">
                  Supporting Photo Evidence / Document (Optional)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={attachmentUrl}
                    onChange={(e) => setAttachmentUrl(e.target.value)}
                    placeholder="Enter image URL or select a sample photo preset below..."
                    className="w-full text-xs p-2.5 pl-8 rounded-lg border border-slate-300 focus:outline-none focus:border-gov-blue font-mono"
                  />
                  <Camera size={15} className="absolute left-2.5 top-3 text-slate-400" />
                </div>

                {/* Sample Presets for Demo */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Sample Photos:</span>
                  {[
                    { label: '🚰 Water Leak', url: 'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=600&q=80' },
                    { label: '🛣️ Pothole', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80' },
                    { label: '🗑️ Garbage', url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80' },
                    { label: '💡 Streetlight', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80' },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setAttachmentUrl(preset.url)}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                  {attachmentUrl && (
                    <button
                      type="button"
                      onClick={() => setAttachmentUrl('')}
                      className="text-[11px] px-2 py-0.5 rounded text-red-600 hover:bg-red-50 border border-red-200 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Preview Thumbnail */}
                {attachmentUrl && (
                  <div className="mt-2 flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <img
                      src={attachmentUrl}
                      alt="Complaint preview"
                      className="w-14 h-14 object-cover rounded-md border border-slate-300"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="text-[11px] text-slate-600 overflow-hidden">
                      <span className="font-bold block text-gov-navy">Attachment Attached</span>
                      <span className="truncate block font-mono text-[10px] text-slate-400">{attachmentUrl}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  {t.btnCancel}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold text-white bg-gov-blue hover:bg-gov-blueHover shadow-sm cursor-pointer"
                >
                  {submitting ? 'Registering...' : t.btnSubmitGrievance}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
