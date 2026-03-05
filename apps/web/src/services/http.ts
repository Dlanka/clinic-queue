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
