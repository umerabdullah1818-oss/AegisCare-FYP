import api from './api';

/**
 * Google Fit Integration Service — Frontend API calls.
 * Communicates with AegisCare backend which proxies to Google Fit.
 */

// ── Google Fit Connection ──────────────────────────────────────

/** Check if user has Google Fit connected */
export const getGoogleFitStatus = () => api.get('/vitals/google/status');

/** Get Google Fit auth URL and redirect user to connect */
export const connectGoogleFit = async () => {
  const res = await api.get('/vitals/google/connect');
  if (res.data.authUrl) {
    window.location.href = res.data.authUrl;
  }
};

/** Disconnect Google Fit from user's account */
export const disconnectGoogleFit = () => api.post('/vitals/google/disconnect');

// ── Vitals Data ────────────────────────────────────────────────

/**
 * Sync latest vitals from Google Fit (triggers a fresh fetch from Google's API).
 * @param {number} hours - How many hours of history to fetch (default 24)
 */
export const syncVitals = (hours = 24) =>
  api.post(`/vitals/sync?hours=${hours}`);

/**
 * Get latest vitals (auto-syncs from Google Fit if connected).
 * @param {number} hours - How many hours of history to fetch (default 24)
 */
export const getLatestVitals = (hours = 24) =>
  api.get(`/vitals/latest?hours=${hours}`);
