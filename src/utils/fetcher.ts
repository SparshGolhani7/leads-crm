import { ApiErrorShape } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const AUTH_TOKEN = process.env.NEXT_PUBLIC_AUTH_TOKEN || "";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (AUTH_TOKEN) headers.set("Authorization", `Bearer ${AUTH_TOKEN}`);

  const response = await fetch(url, { ...options, headers, cache: "no-store" });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!response.ok) {
    const errorBody = isJson ? await response.json() : await response.text();
    const error: ApiErrorShape = {
      message: (errorBody && (errorBody.message || errorBody.error)) || response.statusText,
      status: response.status,
      details: errorBody,
    };
    throw error;
  }

  return (isJson ? await response.json() : (await response.text() as unknown)) as T;
}


