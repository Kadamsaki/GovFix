import React, { useState } from 'react';
import { X, Upload, CheckCircle2, Shield, AlertTriangle, MapPin, Camera } from 'lucide-react';

export default function RegisterComplaintModal({
  isOpen,
  onClose,
  initialCategory,
  onComplaintCreated,
}) {
  const [category, setCategory] = useState(initialCategory || 'Roads & Potholes');
  const [ward, setWard] = useState('Ward No. 14 (Shivaji Chowk / Station Road)');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [submittedId, setSubmittedId] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `GFX-2026-${randomNum}`;
    setSubmittedId(newId);
  };

  const handleFinish = () => {
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
              Citizen Grievance Registration
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {submittedId ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>
              <h4 className="text-xl font-bold text-gov-navy">
                Grievance Submitted Successfully!
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Your civic complaint has been registered and forwarded to the AI triage engine for ward engineer assignment.
              </p>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 inline-block font-mono text-sm font-bold text-gov-navy">
                Reference ID: <span className="text-gov-blue">{submittedId}</span>
              </div>

              <div className="text-xs text-slate-500">
                An SMS confirmation has been sent to your registered mobile number.
              </div>

              <div className="pt-4">
                <button
                  onClick={handleFinish}
                  className="px-6 py-2.5 bg-gov-blue hover:bg-gov-blueHover text-white rounded-lg text-sm font-bold shadow-sm transition-all"
                >
                  Track This Complaint Now
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Privacy Notice Banner */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 flex items-start gap-2">
                <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-600" />
                <span>Notice: Do NOT enter sensitive personal information such as Aadhaar or bank account numbers.</span>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-gov-navy mb-1">
                  Civic Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-gov-blue bg-white"
                  required
                >
                  <option value="Garbage & Sanitation">Garbage & Sanitation</option>
                  <option value="Water Supply">Water Supply</option>
                  <option value="Roads & Potholes">Roads & Potholes</option>
                  <option value="Streetlights">Streetlights</option>
                  <option value="Drainage & Sewage">Drainage & Sewage</option>
                  <option value="Other Civic Matters">Other Civic Matters</option>
                </select>
              </div>

              {/* Ward Selector */}
              <div>
                <label className="block text-xs font-bold text-gov-navy mb-1">
                  Municipal Ward / Zone <span className="text-red-500">*</span>
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
                  Location / Nearest Landmark <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Opposite State Bank, Near Pillar No. 42"
                    className="w-full text-xs sm:text-sm p-2.5 pl-8 rounded-lg border border-slate-300 focus:outline-none focus:border-gov-blue"
                    required
                  />
                  <MapPin size={15} className="absolute left-2.5 top-3 text-slate-400" />
                </div>
              </div>

              {/* Problem Description */}
              <div>
                <label className="block text-xs font-bold text-gov-navy mb-1">
                  Problem Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue clearly (e.g. size of pothole, frequency of water disruption)"
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-gov-blue"
                  required
                />
              </div>

              {/* Photo Upload Mockup */}
              <div>
                <label className="block text-xs font-bold text-gov-navy mb-1">
                  Attach Photo / Video Proof (Optional)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-3 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center gap-2 text-xs text-slate-500">
                  <Camera size={16} className="text-gov-blue" />
                  <span>Click to select image or drag &amp; drop (Max 5MB)</span>
                </div>
              </div>

              {/* Citizen Contact */}
              <div>
                <label className="block text-xs font-bold text-gov-navy mb-1">
                  Citizen Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number for SMS tracking updates"
                  maxLength={10}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-gov-blue font-mono"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold text-white bg-gov-blue hover:bg-gov-blueHover shadow-sm"
                >
                  Submit Grievance
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
