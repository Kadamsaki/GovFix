/**
 * GovFix API Client Service
 * Handles communication between the React frontend and FastAPI backend.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? '/api/v1'
    : 'http://127.0.0.1:8000/api/v1');

function getAuthHeaders(userId) {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  if (userId) {
    headers['X-User-Id'] = userId;
  }
  return headers;
}

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
      headers: { 'Accept': 'application/json' },
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
 * Authenticates user by ID or mobile.
 */
export async function loginUser(mobileOrId, role = null) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mobile_or_id: mobileOrId,
        role: role,
      }),
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || `Login failed (HTTP ${response.status})`);
    }
    return await response.json();
  } catch (err) {
    console.error('Login error:', err);
    throw err;
  }
}

/**
 * Retrieves complaints filtered by the user's role on the backend.
 */
export async function fetchComplaints(userId, { status = '', category = '', search = '' } = {}) {
  try {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status.toUpperCase());
    if (category) params.append('category', category);
    if (search) params.append('search', search);

    const url = `${API_BASE_URL}/complaints${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(userId),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || `Failed to fetch complaints (HTTP ${response.status})`);
    }
    return await response.json();
  } catch (err) {
    console.error('fetchComplaints error:', err);
    throw err;
  }
}

/**
 * Retrieves details for a specific complaint.
 */
export async function fetchComplaintById(complaintId, userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}`, {
      method: 'GET',
      headers: getAuthHeaders(userId),
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || `Failed to fetch complaint details (HTTP ${response.status})`);
    }
    return await response.json();
  } catch (err) {
    console.error('fetchComplaintById error:', err);
    throw err;
  }
}

/**
 * Submits a new citizen complaint to the backend.
 */
export async function submitComplaint(payload, userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/complaints`, {
      method: 'POST',
      headers: getAuthHeaders(userId),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || `Failed to submit complaint (HTTP ${response.status})`);
    }
    return await response.json();
  } catch (err) {
    console.error('submitComplaint error:', err);
    throw err;
  }
}

/**
 * Executes a workflow status transition through the centralized workflow engine.
 */
export async function transitionComplaint(complaintId, transitionPayload, userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/transition`, {
      method: 'POST',
      headers: getAuthHeaders(userId),
      body: JSON.stringify(transitionPayload),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.detail || `Transition rejected (HTTP ${response.status})`);
    }
    return data;
  } catch (err) {
    console.error('transitionComplaint error:', err);
    throw err;
  }
}

/**
 * Fetches the immutable audit trail for a complaint.
 */
export async function fetchAuditLogs(complaintId, userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/audit-logs`, {
      method: 'GET',
      headers: getAuthHeaders(userId),
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || `Failed to fetch audit logs (HTTP ${response.status})`);
    }
    return await response.json();
  } catch (err) {
    console.error('fetchAuditLogs error:', err);
    throw err;
  }
}

/**
 * Fetches list of municipal officers for assignment.
 */
export async function fetchOfficers(userId, department = '') {
  try {
    const url = department
      ? `${API_BASE_URL}/auth/officers?department=${encodeURIComponent(department)}`
      : `${API_BASE_URL}/auth/officers`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(userId),
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.detail || `Failed to fetch officers (HTTP ${response.status})`);
    }
    return await response.json();
  } catch (err) {
    console.error('fetchOfficers error:', err);
    throw err;
  }
}

/**
 * Fetches overall workflow stats for dashboards.
 */
export async function fetchComplaintStats(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/complaints/stats/summary`, {
      method: 'GET',
      headers: getAuthHeaders(userId),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error('fetchComplaintStats error:', err);
    return null;
  }
}

/**
 * Fetches all users (Admin oversight).
 */
export async function fetchAllUsers(userId, role = '') {
  try {
    const url = role ? `${API_BASE_URL}/auth/users?role=${role}` : `${API_BASE_URL}/auth/users`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(userId),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error('fetchAllUsers error:', err);
    return [];
  }
}
