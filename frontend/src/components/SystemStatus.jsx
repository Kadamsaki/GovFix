import React from 'react';
import { Activity, RefreshCw, CheckCircle2, AlertCircle, Terminal } from 'lucide-react';

export default function SystemStatus({
  healthStatus,
  systemInfo,
  isLoading,
  onRefresh,
}) {
  const isOnline = healthStatus && healthStatus.success;

  return (
    <section className="status-card">
      <div className="status-card-header">
        <div className="status-card-title-group">
          <Activity size={20} color="var(--civic-blue)" />
          <h3 className="status-card-title">Backend Gateway Status</h3>
          <span
            className={`status-indicator ${isOnline ? 'connected' : 'disconnected'}`}
          >
            {isOnline ? (
              <>
                <CheckCircle2 size={14} /> Operational
              </>
            ) : (
              <>
                <AlertCircle size={14} /> Standby / Offline
              </>
            )}
          </span>
        </div>

        <button
          className="status-btn"
          onClick={onRefresh}
          disabled={isLoading}
          aria-label="Refresh status check"
        >
          <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
          <span>{isLoading ? 'Checking...' : 'Ping Backend'}</span>
        </button>
      </div>

      <div className="status-grid">
        <div className="status-metric-box">
          <div className="metric-label">Target Endpoint</div>
          <div className="metric-value">
            {healthStatus?.endpoint || 'http://localhost:8000/api/v1/health'}
          </div>
        </div>

        <div className="status-metric-box">
          <div className="metric-label">Connection Latency</div>
          <div className="metric-value">
            {isOnline ? `${healthStatus.latency} ms` : '—'}
          </div>
        </div>

        <div className="status-metric-box">
          <div className="metric-label">Backend Service</div>
          <div className="metric-value">
            {isOnline ? healthStatus.data.service : 'FastAPI (Ready to launch)'}
          </div>
        </div>

        <div className="status-metric-box">
          <div className="metric-label">API Version</div>
          <div className="metric-value">
            {isOnline ? `v${healthStatus.data.version}` : 'v0.1.0'}
          </div>
        </div>
      </div>

      <div className="quick-terminal-note">
        <Terminal size={18} color="var(--civic-blue)" />
        <div>
          Start the backend anytime with:
          <code>cd backend && uvicorn app.main:app --reload</code>
        </div>
      </div>
    </section>
  );
}
