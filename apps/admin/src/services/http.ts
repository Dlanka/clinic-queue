import axios from "axios";

const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_HEADER = "x-csrf-token";

function readCookie(name: string) {
  const tokenPrefix = `${name}=`;
  const chunks = document.cookie.split(";").map((part) => part.trim());
  const chunk = chunks.find((part) => part.startsWith(tokenPrefix));
  return chunk ? decodeURIComponent(chunk.slice(tokenPrefix.length)) : "";
}

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  withCredentials: true
});

const REFRESH_ENDPOINT = "/auth/refresh";
let isRefreshing = false;
let refreshQueue: Array<{ resolve: () => void; reject: (error: unknown) => void }> = [];

function flushRefreshQueue(error?: unknown) {
  refreshQueue.forEach((item) => {
    if (error) {
      item.reject(error);
      return;
    }

    item.resolve();
  });
  refreshQueue = [];
}

async function refreshSession() {
  await axios.post(`${import.meta.env.VITE_API_BASE_URL || "/api"}${REFRESH_ENDPOINT}`, {}, {
    withCredentials: true
  });
}

http.interceptors.request.use((config) => {
  const method = (config.method || "get").toUpperCase();
  if (method === "POST" || method === "PATCH" || method === "DELETE") {
    const csrfToken = readCookie(CSRF_COOKIE_NAME);
    if (csrfToken) {
      config.headers[CSRF_HEADER] = csrfToken;
    }
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url || "";
    const isAuthBootstrapRequest =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/select-tenant") ||
      requestUrl.includes("/auth/logout");

    if (
      status !== 401 ||
      !originalRequest ||
      (originalRequest as { _retry?: boolean })._retry ||
      requestUrl.includes(REFRESH_ENDPOINT) ||
      isAuthBootstrapRequest
    ) {
      return Promise.reject(error);
    }

    (originalRequest as { _retry?: boolean })._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({
          resolve: () => resolve(http(originalRequest)),
          reject
        });
      });
    }

    isRefreshing = true;

    try {
      await refreshSession();
      flushRefreshQueue();
      return http(originalRequest);
    } catch (refreshError) {
      flushRefreshQueue(refreshError);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
