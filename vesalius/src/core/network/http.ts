import { API_BASE_URL } from "./config";
import { authService } from "@core/modules/auth/auth.service";

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  path: string;
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
  const method = opts.method ?? "GET";

  const hAuth = await authHeader();

  const headers: Record<string, string> = {
    ...hAuth,
    ...(opts.body ? { "Content-Type": "application/json" } : {}),
    ...(opts.headers ?? {}),
  };

  /* -------------------------
     REQUEST DEBUG LOG
  ------------------------- */

  console.log("HTTP REQUEST");
  console.log("URL:", url);
  console.log("METHOD:", method);

  if (opts.body) {
    console.log("BODY:", JSON.stringify(opts.body, null, 2));
  }

  const resp = await fetch(url, {
    method,
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  const text = await readText(resp);

  /* -------------------------
     RESPONSE DEBUG LOG
  ------------------------- */

  console.log("HTTP RESPONSE");
  console.log("STATUS:", resp.status);
  console.log("URL:", opts.path);

  if (text) {
    console.log("RESPONSE BODY:", text);
  }

  if (!resp.ok) {
    const err: HttpError = new Error(
      `HTTP ${resp.status} ${method} ${opts.path}`,
    );
    err.status = resp.status;
    err.bodyText = text;

    console.error("HTTP ERROR:", {
      status: resp.status,
      path: opts.path,
      body: text,
    });

    throw err;
  }

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

      return await doRequest<T>(opts);
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
  delete<T>(path: string, body?: unknown, headers?: Record<string, string>) {
    return this.request<T>({ method: "DELETE", path, body, headers });
  },
};
