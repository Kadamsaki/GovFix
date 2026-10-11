import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import SystemStatus from './components/SystemStatus';
import RoadmapPreview from './components/RoadmapPreview';
import { checkBackendHealth, fetchSystemInfo } from './services/api';
import './App.css';

export default function App() {
  const [healthStatus, setHealthStatus] = useState(null);
  const [systemInfo, setSystemInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const performHealthCheck = useCallback(async () => {
    setIsLoading(true);
    const health = await checkBackendHealth();
    setHealthStatus(health);

    if (health.success) {
      const info = await fetchSystemInfo();
      setSystemInfo(info);
    } else {
      setSystemInfo(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    performHealthCheck();
  }, [performHealthCheck]);

  return (
    <div className="app-container">
      <Navbar isBackendOnline={Boolean(healthStatus?.success)} />

      <main className="main-content">
        <HeroBanner />
        <SystemStatus
          healthStatus={healthStatus}
          systemInfo={systemInfo}
          isLoading={isLoading}
          onRefresh={performHealthCheck}
        />
        <RoadmapPreview />
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-credits">
            <strong>GovFix</strong> – AI-Powered Municipal Grievance Management System
          </div>
          <div className="footer-meta">
            <span>Initial Setup • v0.1.0</span>
            <span>•</span>
            <span>FastAPI &amp; React (Vite)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
