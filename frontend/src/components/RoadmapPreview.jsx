import React from 'react';
import { Send, Brain, Users, BarChart3 } from 'lucide-react';

const roadmapSteps = [
  {
    step: 'Commit 1 • Initial Setup',
    title: 'Project Architecture & Gateway',
    desc: 'Clean decoupled frontend and backend project structure with FastAPI health probes, Pydantic settings, and React Vite starter.',
    icon: Brain,
    features: ['FastAPI REST framework', 'React 18 + Vite UI', 'Modern Civic Design System'],
  },
  {
    step: 'Commit 2 • Planned',
    title: 'Citizen Grievance Submission',
    desc: 'Citizen reporting form with image upload, geolocation tagging, ward detection, and grievance ticket generation.',
    icon: Send,
    features: ['Category picker & media upload', 'Ward GPS tagging', 'Ticket reference tracking'],
  },
  {
    step: 'Commit 3 • Planned',
    title: 'AI Classification & Triage',
    desc: 'Automated complaint analysis for priority scoring, duplicate detection, and department auto-assignment.',
    icon: Brain,
    features: ['Multi-class complaint classifier', 'Urgency & hazard scoring', 'Automated municipal dispatch'],
  },
  {
    step: 'Commit 4 • Planned',
    title: 'Officer Portal & SLA Resolution',
    desc: 'Municipal officer dashboard with status workflows, resolution proof upload, SLA escalations, and citizen notifications.',
    icon: Users,
    features: ['Officer task Kanban', 'SLA breach timer & escalations', 'Resolution verification flow'],
  },
];

export default function RoadmapPreview() {
  return (
    <section>
      <div className="section-header">
        <span className="section-badge">Iterative Development</span>
        <h3 className="section-title">Implementation Roadmap</h3>
      </div>

      <div className="roadmap-grid">
        {roadmapSteps.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="roadmap-card">
              <span className="roadmap-step">{item.step}</span>
              <div className="roadmap-icon-box">
                <Icon size={22} />
              </div>
              <h4 className="roadmap-title">{item.title}</h4>
              <p className="roadmap-desc">{item.desc}</p>
              <ul className="roadmap-features-list">
                {item.features.map((feat, i) => (
                  <li key={i}>{feat}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
