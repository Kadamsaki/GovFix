/**
 * GovFix API Client Service
 * Handles communication between the React frontend and FastAPI backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

/**
 * Checks backend health status and measures network latency.
 */
export async function checkBackendHealth() {
  const startTime = performance.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const latency = Math.round(performance.now() - startTime);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
      latency,
      endpoint: `${API_BASE_URL}/health`,
    };
  } catch (error) {
    const latency = Math.round(performance.now() - startTime);
    return {
      success: false,
      error: error.name === 'AbortError' ? 'Connection timed out' : error.message,
      latency,
      endpoint: `${API_BASE_URL}/health`,
    };
  }
}

/**
 * Retrieves system metadata and module readiness from the backend.
 */
export async function fetchSystemInfo() {
  try {
    const response = await fetch(`${API_BASE_URL}/system-info`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return null;
  }
}
