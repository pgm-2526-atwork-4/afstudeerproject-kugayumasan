import { API_BASE_URL } from "./config";
import { authService } from "@core/modules/auth/auth.service";

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  path: string; // "/users/me"
  body?: unknown;
  headers?: Record<string, string>;
};

type HttpError = Error & {
  status?: number;
  bodyText?: string;
};

function buildUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

async function readText(resp: Response) {
  try {
    return await resp.text();
  } catch {
    return "";
  }
}

async function authHeader(): Promise<Record<string, string>> {
  const tokens = await authService.getTokens();
  if (!tokens?.accessToken) return {};
  return { Authorization: `Bearer ${tokens.accessToken}` };
}

async function doRequest<T>(opts: RequestOptions): Promise<T> {
  const url = buildUrl(opts.path);
  const hAuth = await authHeader();

  const headers: Record<string, string> = {
    ...hAuth,
    ...(opts.body ? { "Content-Type": "application/json" } : {}),
    ...(opts.headers ?? {}),
  };

  const resp = await fetch(url, {
    method: opts.method ?? "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  if (!resp.ok) {
    const err: HttpError = new Error(
      `HTTP ${resp.status} ${opts.method ?? "GET"} ${opts.path}`,
    );
    err.status = resp.status;
    err.bodyText = await readText(resp);
    throw err;
  }

  const text = await readText(resp);
  return text ? (JSON.parse(text) as T) : ({} as T);
}

let refreshInFlight: Promise<void> | null = null;

export const http = {
  async request<T>(opts: RequestOptions): Promise<T> {
    try {
      return await doRequest<T>(opts);
    } catch (e: any) {
      const status = (e as HttpError)?.status;
      if (status !== 401) throw e;

      const tokens = await authService.getTokens();
      if (!tokens?.refreshToken) throw e;

      if (!refreshInFlight) {
        refreshInFlight = authService
          .refresh()
          .then(() => undefined)
          .finally(() => {
            refreshInFlight = null;
          });
      }

      await refreshInFlight;
      return await doRequest<T>(opts); // retry once
    }
  },

  get<T>(path: string, headers?: Record<string, string>) {
    return this.request<T>({ method: "GET", path, headers });
  },

  post<T>(path: string, body?: unknown, headers?: Record<string, string>) {
    return this.request<T>({ method: "POST", path, body, headers });
  },

  patch<T>(path: string, body?: unknown, headers?: Record<string, string>) {
    return this.request<T>({ method: "PATCH", path, body, headers });
  },
};
