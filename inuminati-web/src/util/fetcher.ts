import { getAccessToken } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const request = async (
  url: string,
  method: string,
  data?: unknown,
  customAccessToken?: string
) => {
  const fullUrl = `${BASE_URL}${url}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const accessToken = customAccessToken || (await getAccessToken());

  // 認証が必要な場合はアクセストークンを追加
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const options: RequestInit = {
    method,
    credentials: "include",
    headers,
  };

  if (data && method !== "GET") {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(fullUrl, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // レスポンスが空の場合はnullを返す
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return null;
  }

  return response.json();
};

export const fetcher = {
  get: (url: string) => request(url, "GET", undefined),
  post: (url: string, data?: unknown, customAccessToken?: string) =>
    request(url, "POST", data, customAccessToken),
  put: (url: string, data?: unknown) => request(url, "PUT", data),
  delete: (url: string) => request(url, "DELETE", undefined),
};
