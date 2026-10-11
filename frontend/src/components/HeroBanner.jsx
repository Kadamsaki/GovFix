import React from 'react';
import { Sparkles, Layers, Cpu, Database } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section className="hero-section">
      <div className="hero-pill">
        <Sparkles size={14} />
        <span>Initial Project Scaffold • Step 1</span>
      </div>

      <h2 className="hero-title">
        AI-Powered Municipal Grievance{' '}
        <span className="hero-title-highlight">Management System</span>
      </h2>

      <p className="hero-desc">
        GovFix streamlines citizen grievance reporting and municipal resolution through automated
        triage, intelligent department routing, SLA monitoring, and transparent civic governance.
      </p>

      <div className="hero-specs">
        <div className="spec-chip">
          <Layers size={16} color="var(--civic-blue)" />
          <span>Frontend: <strong>React 18 + Vite</strong></span>
        </div>
        <div className="spec-chip">
          <Cpu size={16} color="var(--ai-purple)" />
          <span>Backend: <strong>FastAPI (Python)</strong></span>
        </div>
        <div className="spec-chip">
          <Database size={16} color="var(--status-emerald)" />
          <span>Architecture: <strong>Decoupled REST API</strong></span>
        </div>
      </div>
    </section>
  );
}
