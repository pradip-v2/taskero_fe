import axios from "axios";
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import type { AuthLoginCreateMutationResponse as LoginResponse } from "./types";

const BASE_PATH = import.meta.env.VITE_BASE_URL;
export const LOCAL_STORAGE_USER_KEY = "taskero_user";

export type RequestConfig<TVariables = unknown> = {
  method:
    | "get"
    | "put"
    | "patch"
    | "post"
    | "delete"
    | "GET"
    | "PUT"
    | "PATCH"
    | "POST"
    | "DELETE";
  url: string;
  params?: unknown;
  data?: TVariables;
  responseType?:
    | "arraybuffer"
    | "blob"
    | "document"
    | "json"
    | "text"
    | "stream";
  signal?: AbortSignal;
  headers?: AxiosRequestConfig["headers"] & { "X-Tenant"?: string };
};

export type ResponseConfig<TData = unknown> = {
  data: TData;
  status: number;
  statusText: string;
  headers?: AxiosResponse["headers"] & { "X-Tenant"?: string };
};

export type ResponseErrorConfig<TError = unknown> = {
  data: TError;
  status: number;
  statusText: string;
  headers?: AxiosResponse["headers"] & { "X-Tenant"?: string };
};

export const axiosInstance = axios.create({
  baseURL: BASE_PATH,
});

export const axiosClient = async <
  TData,
  TError = unknown,
  TVariables = unknown,
>(
  config: RequestConfig<TVariables>
): Promise<ResponseConfig<TData>> => {
  const promise = axiosInstance
    .request<TData, ResponseConfig<TData>>(config)
    .catch((e: AxiosError<TError>) => {
      throw e;
    });

  return promise;
};

axiosInstance.interceptors.request.use((config) => {
  const userObj: LoginResponse | null = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_USER_KEY) ?? "null"
  );
  const baseUrl = JSON.parse(localStorage.getItem("baseUrl") ?? "null");
  if (import.meta.env.MODE == "dev" && !!baseUrl) {
    config.baseURL = baseUrl;
  }
  config.headers.Authorization =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY0MzU4NjIxLCJpYXQiOjE3NjQyNzIyMjEsImp0aSI6IjdkZmQwN2YwNzIwZTQ5YjJiZTA4MTYwZGIwNTZiN2RlIiwidXNlcl9pZCI6IjEifQ.hbPl0H9DkejB5jvcZJzLhNvWuJKcgIkZIGjboIAf0eQ";
  if (userObj?.access)
    config.headers.Authorization = "Bearer " + userObj?.access;
  return config;
});

axiosInstance.interceptors.response.use(undefined, async (err) => {
  const userObj = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_USER_KEY) ?? "null"
  );
  if (err.response.status === 401) {
    if (err?.config?.url === "/auth/token/refresh/") {
      localStorage.clear();
      setTimeout(() => {
        location.reload();
      }, 0);
      return;
    }
    axiosInstance
      .post(`/auth/token/refresh/`, { refresh: userObj.refresh })
      .then((response: any) => {
        const updatedUserObj = {
          ...userObj,
          access: response.data.access,
          refresh: response.data.refresh,
        };
        localStorage.setItem(
          LOCAL_STORAGE_USER_KEY,
          JSON.stringify(updatedUserObj)
        );
      });
  }

  throw err;
});

export default axiosClient;
