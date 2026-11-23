/**
 * services/api.ts — Typed Axios client
 *
 * Automatically attaches:
 *  - Authorization: Bearer <JWT>
 *  - X-Org-Id: <current tenant org ID>
 *  - Content-Type: application/json
 *
 * On 401 responses, clears local auth state and redirects to /login.
 */

import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api/v1';

// ── Token helpers ─────────────────────────────────────────────────────────────

export const tokenStore = {
  getToken: (): string | null => localStorage.getItem('lvall_access_token'),
  setToken: (token: string): void => { localStorage.setItem('lvall_access_token', token); },
  clearToken: (): void => { localStorage.removeItem('lvall_access_token'); },

  getOrgId: (): string | null => localStorage.getItem('lvall_org_id'),
  setOrgId: (orgId: string): void => { localStorage.setItem('lvall_org_id', orgId); },
  clearOrgId: (): void => { localStorage.removeItem('lvall_org_id'); },

  clear: (): void => {
    localStorage.removeItem('lvall_access_token');
    localStorage.removeItem('lvall_org_id');
  },
};

// ── Axios instance ────────────────────────────────────────────────────────────

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
});

// ── Request interceptor — attach auth headers ─────────────────────────────────

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.getToken();
  const orgId = tokenStore.getOrgId();

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  if (orgId) {
    config.headers.set('X-Org-Id', orgId);
  }

  return config;
});

// ── Response interceptor — handle 401 ────────────────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStore.clear();
      // Redirect to login — avoids circular import with router
      window.location.replace('/login');
    }
    return Promise.reject(error);
  },
);

export default apiClient;
