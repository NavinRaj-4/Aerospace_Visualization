import {
  AEROSPACE_FACILITIES,
  AEROSPACE_MODELS,
  INITIAL_TEST_RUNS,
  calculateAerodynamics,
  getInterpolatedPressureProfile
} from '../mockData/aerospaceData';

const API_BASE = '/api';

// Helper to get auth header
function getAuthHeaders() {
  const token = localStorage.getItem('aero_auth_token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// In-memory client fallback store if backend is offline
let localRunsStore = [...INITIAL_TEST_RUNS];
let localFacilities = JSON.parse(JSON.stringify(AEROSPACE_FACILITIES));
let localModels = JSON.parse(JSON.stringify(AEROSPACE_MODELS));

export const AeroApi = {
  // --- AUTHENTICATION & SESSIONS ---
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }
    if (data.token) {
      localStorage.setItem('aero_auth_token', data.token);
      localStorage.setItem('aero_auth_user', JSON.stringify(data.user));
    }
    return data;
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    if (data.token) {
      localStorage.setItem('aero_auth_token', data.token);
      localStorage.setItem('aero_auth_user', JSON.stringify(data.user));
    }
    return data;
  },

  async getMe() {
    const token = localStorage.getItem('aero_auth_token');
    if (!token) return null;

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        return data.user;
      }
    } catch (e) {
      console.warn('[AeroApi] Me check failed, using cached session');
    }
    const cached = localStorage.getItem('aero_auth_user');
    return cached ? JSON.parse(cached) : null;
  },

  async logout() {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
    } catch (e) {
      // Ignore
    } finally {
      localStorage.removeItem('aero_auth_token');
      localStorage.removeItem('aero_auth_user');
    }
  },

  async getDemoAccounts() {
    try {
      const res = await fetch(`${API_BASE}/auth/demo-accounts`);
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch (e) {
      // Fallback
    }
    return [
      {
        role: 'admin',
        name: 'Dr. Elena Vance',
        title: 'Flight Test Director',
        callsign: 'VORTEX-LEAD',
        email: 'director@aerospace.gov',
        password: 'director123',
        department: 'Flight Test Directorate',
        badge: 'CLEARANCE LEVEL 5 [DIRECTOR]'
      },
      {
        role: 'engineer',
        name: 'Marcus Thorne',
        title: 'Senior Aerodynamicist',
        callsign: 'MACH-CHIEF',
        email: 'engineer@aerospace.gov',
        password: 'engineer123',
        department: 'Aero Calibration Division',
        badge: 'CLEARANCE LEVEL 4 [ENGINEER]'
      },
      {
        role: 'operator',
        name: 'Sarah Jenkins',
        title: 'Wind Tunnel Operator',
        callsign: 'CHAMBER-ONE',
        email: 'operator@aerospace.gov',
        password: 'operator123',
        department: 'Tunnel Operations Control',
        badge: 'CLEARANCE LEVEL 3 [OPERATOR]'
      },
      {
        role: 'viewer',
        name: 'Cadet Alex Chen',
        title: 'Research Analyst',
        callsign: 'CADET-ALPHA',
        email: 'guest@aerospace.gov',
        password: 'viewer123',
        department: 'Aerospace Academy & Research',
        badge: 'CLEARANCE LEVEL 1 [VIEWER]'
      }
    ];
  },

  // --- ADMIN PERSONNEL & AUDIT ---
  async getUsers() {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch personnel');
    return data.data;
  },

  async updateUserRole(userId, role) {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update personnel role');
    return data.data;
  },

  async getAuditLogs(limit = 100) {
    const res = await fetch(`${API_BASE}/admin/audit-logs?limit=${limit}`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch audit logs');
    return data.data;
  },

  async getDatabaseStatus() {
    try {
      const res = await fetch(`${API_BASE}/database/status`);
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch (e) {
      // Fallback
    }
    return {
      connected: true,
      engine: 'MongoDB Server v9.0 (Mongoose ODM)',
      uri: 'mongodb://127.0.0.1:27017/aerospace',
      databaseName: 'aerospace',
      collections: { users: 4, facilities: 3, models: 3, testRuns: 20, auditLogs: 1 }
    };
  },

  async reseedDatabase() {
    const res = await fetch(`${API_BASE}/admin/database-seed`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to reseed database');
    return data.data;
  },

  // --- FACILITIES & TUNNEL CONTROLS ---
  async getFacilities() {
    try {
      const res = await fetch(`${API_BASE}/facilities`);
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch (e) {
      console.warn('[AeroApi] Using client in-memory facilities fallback');
    }
    return localFacilities;
  },

  async updateFacility(facilityId, updates) {
    const res = await fetch(`${API_BASE}/facilities/${facilityId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update facility parameters');
    return data.data;
  },

  async emergencyScramFacility(facilityId, reason = 'Operator Manual Scram Triggered') {
    const res = await fetch(`${API_BASE}/facilities/${facilityId}/emergency-stop`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to trigger emergency scram');
    return data.data;
  },

  // --- AEROSPACE MODELS ---
  async getModels() {
    try {
      const res = await fetch(`${API_BASE}/models`);
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch (e) {
      console.warn('[AeroApi] Using client in-memory models fallback');
    }
    return localModels;
  },

  async getModelById(id) {
    try {
      const res = await fetch(`${API_BASE}/models/${id}`);
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch (e) {
      console.warn(`[AeroApi] Using fallback for model ${id}`);
    }
    return localModels.find(m => m.id === id) || localModels[0];
  },

  async createModel(modelData) {
    const res = await fetch(`${API_BASE}/models`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(modelData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to register aerospace model');
    return data.data;
  },

  async deleteModel(modelId) {
    const res = await fetch(`${API_BASE}/models/${modelId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete model');
    return true;
  },

  // --- TEST RUNS & TELEMETRY ---
  async getTestRuns(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.regime && filters.regime !== 'ALL') params.append('regime', filters.regime);
      if (filters.modelId && filters.modelId !== 'ALL') params.append('modelId', filters.modelId);
      if (filters.stallOnly) params.append('stallOnly', 'true');

      const res = await fetch(`${API_BASE}/runs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch (e) {
      console.warn('[AeroApi] Using client in-memory runs fallback');
    }

    // Client fallback
    let filtered = [...localRunsStore];
    if (filters.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter(r => 
        r.runId.toLowerCase().includes(s) ||
        r.modelName.toLowerCase().includes(s) ||
        (r.testedBy && r.testedBy.toLowerCase().includes(s))
      );
    }
    if (filters.regime && filters.regime !== 'ALL') {
      filtered = filtered.filter(r => r.regime.toUpperCase() === filters.regime.toUpperCase());
    }
    if (filters.modelId && filters.modelId !== 'ALL') {
      filtered = filtered.filter(r => r.modelId === filters.modelId);
    }
    if (filters.stallOnly) {
      filtered = filtered.filter(r => r.stallFlag === true);
    }
    return filtered;
  },

  async addTestRun(runData) {
    const res = await fetch(`${API_BASE}/runs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(runData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to record test run');
    return data.data;
  },

  async deleteTestRun(runId) {
    const res = await fetch(`${API_BASE}/runs/${runId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete test run');
    return true;
  },

  async uploadRuns(runsArray) {
    const res = await fetch(`${API_BASE}/upload-dataset`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ runs: runsArray })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to upload flight dataset');
    return data.data;
  },

  async computeLivePoint(modelId, aoa, mach = null) {
    try {
      const params = new URLSearchParams({ modelId, aoa: aoa.toString() });
      if (mach) params.append('mach', mach.toString());
      const res = await fetch(`${API_BASE}/telemetry/live-point?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch (e) {
      // Fallback
    }
    return calculateAerodynamics(modelId, aoa, mach);
  },

  async getSweep(modelId, startAoA = -4, endAoA = 20, step = 0.5) {
    try {
      const params = new URLSearchParams({
        modelId,
        startAoA: startAoA.toString(),
        endAoA: endAoA.toString(),
        step: step.toString()
      });
      const res = await fetch(`${API_BASE}/telemetry/sweep?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch (e) {
      // Fallback
    }
    const sweep = [];
    for (let a = startAoA; a <= endAoA + 0.001; a += step) {
      sweep.push(calculateAerodynamics(modelId, a));
    }
    return sweep;
  },

  getPressureProfile(modelId, aoa) {
    return getInterpolatedPressureProfile(modelId, aoa);
  }
};
