// サーバーサイド（Server Actions）はコンテナ内ネットワーク経由で brain に接続する。
// クライアントサイド（ブラウザ）はビルド時に焼き込まれた NEXT_PUBLIC_API_URL を使う。
const API_BASE =
  typeof window === "undefined"
    ? (process.env.API_URL ?? "http://localhost:8080")
    : (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080");

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

async function request<T>(
  path: string,
  token?: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, headers, ...rest } = options;

  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error ?? "API error");
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const apiFetch = {
  get: <T>(path: string, token?: string) =>
    request<T>(path, token, { method: "GET" }),

  post: <T>(path: string, token?: string, body?: unknown) =>
    request<T>(path, token, { method: "POST", body }),

  put: <T>(path: string, token?: string, body?: unknown) =>
    request<T>(path, token, { method: "PUT", body }),

  delete: <T>(path: string, token?: string) =>
    request<T>(path, token, { method: "DELETE" }),
};

/** multipart/form-data 用 PUT (プロフィール更新など) */
export async function putFormData<T>(
  path: string,
  token: string,
  formData: FormData
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error ?? "API error");
  }

  return res.json() as Promise<T>;
}

/** multipart/form-data 用 (画像アップロード) */
export async function postFormData<T>(
  path: string,
  token: string,
  formData: FormData
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error ?? "API error");
  }

  return res.json() as Promise<T>;
}
