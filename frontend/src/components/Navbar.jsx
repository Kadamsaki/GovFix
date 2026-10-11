import React from 'react';
import { Shield, GitCommit, ExternalLink } from 'lucide-react';

export default function Navbar({ isBackendOnline }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="brand-wrapper">
          <div className="brand-icon-shield">
            <Shield size={22} strokeWidth={2.4} />
          </div>
          <div>
            <h1 className="brand-title">GovFix</h1>
            <p className="brand-subtitle">Municipal Grievance System</p>
          </div>
        </div>

        <div className="nav-actions">
          <div className="badge-tag">
            <span
              className="badge-dot"
              style={{
                backgroundColor: isBackendOnline ? 'var(--status-emerald)' : 'var(--status-amber)',
                boxShadow: isBackendOnline
                  ? '0 0 8px var(--status-emerald)'
                  : '0 0 8px var(--status-amber)',
              }}
            />
            <span>{isBackendOnline ? 'Backend Online' : 'FastAPI Ready'}</span>
          </div>

          <div className="badge-tag" title="First Git commit initialization">
            <GitCommit size={14} color="var(--civic-blue)" />
            <span>Init Commit Setup</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
