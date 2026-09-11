export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ApiRequestConfig extends RequestInit {
  /** Set false for endpoints such as sign-in that do not accept a bearer token. */
  authenticate?: boolean;
}

type RequestInterceptor = (url: string, config: ApiRequestConfig) => Promise<ApiRequestConfig> | ApiRequestConfig;
type ResponseInterceptor = (response: Response) => Promise<Response> | Response;
type LoadingListener = (isLoading: boolean) => void;

const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor[] = [];
const loadingListeners = new Set<LoadingListener>();
let activeRequests = 0;

const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(/\/$/, "");

function notifyLoading() {
  loadingListeners.forEach(listener => listener(activeRequests > 0));
}

function toUrl(path: string) {
  return /^https?:\/\//.test(path) ? path : `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;
  const contentType = response.headers.get("content-type") ?? "";
  return contentType.includes("application/json") ? response.json() : response.text();
}

/** Add a request interceptor. Return the unsubscribe function when it is no longer needed. */
export function addRequestInterceptor(interceptor: RequestInterceptor) {
  requestInterceptors.push(interceptor);
  return () => requestInterceptors.splice(requestInterceptors.indexOf(interceptor), 1);
}

/** Add a response interceptor. It runs before non-2xx responses are converted to ApiError. */
export function addResponseInterceptor(interceptor: ResponseInterceptor) {
  responseInterceptors.push(interceptor);
  return () => responseInterceptors.splice(responseInterceptors.indexOf(interceptor), 1);
}

export function subscribeToApiLoading(listener: LoadingListener) {
  loadingListeners.add(listener);
  listener(activeRequests > 0);
  return () => { loadingListeners.delete(listener); };
}

// Default authentication interceptor. Replace the storage key here if your login API uses another one.
addRequestInterceptor((_, config) => {
  if (config.authenticate === false) return config;
  const token = localStorage.getItem("auth_token");
  if (!token) return config;
  const headers = new Headers(config.headers);
  headers.set("Authorization", `Bearer ${token}`);
  return { ...config, headers };
});

// A central place to respond to expired credentials. It deliberately does not redirect;
// the application can register a response interceptor for its login route.
addResponseInterceptor(response => response);

async function request<T>(path: string, config: ApiRequestConfig = {}): Promise<T> {
  const headers = new Headers(config.headers);
  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  let finalConfig: ApiRequestConfig = { ...config, headers };

  for (const interceptor of requestInterceptors) finalConfig = await interceptor(toUrl(path), finalConfig);

  activeRequests += 1;
  notifyLoading();
  try {
    let response = await fetch(toUrl(path), finalConfig);
    for (const interceptor of responseInterceptors) response = await interceptor(response);
    const body = await parseBody(response);
    if (!response.ok) {
      const message = typeof body === "object" && body && "message" in body
        ? String(body.message)
        : `Request failed (${response.status}).`;
      throw new ApiError(message, response.status, body);
    }
    return body as T;
  } finally {
    activeRequests -= 1;
    notifyLoading();
  }
}

function withJsonBody(body: unknown, config: ApiRequestConfig): ApiRequestConfig {
  const headers = new Headers(config.headers);
  headers.set("Content-Type", "application/json");
  return { ...config, headers, body: JSON.stringify(body) };
}

export const apiClient = {
  get: <T>(path: string, config?: ApiRequestConfig) => request<T>(path, { ...config, method: "GET" }),
  post: <T>(path: string, body: unknown, config: ApiRequestConfig = {}) => request<T>(path, withJsonBody(body, { ...config, method: "POST" })),
  put: <T>(path: string, body: unknown, config: ApiRequestConfig = {}) => request<T>(path, withJsonBody(body, { ...config, method: "PUT" })),
  patch: <T>(path: string, body: unknown, config: ApiRequestConfig = {}) => request<T>(path, withJsonBody(body, { ...config, method: "PATCH" })),
  delete: <T>(path: string, config?: ApiRequestConfig) => request<T>(path, { ...config, method: "DELETE" }),
};
