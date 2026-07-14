import axios, {
	type AxiosInstance,
	type AxiosRequestConfig,
	type InternalAxiosRequestConfig,
} from "axios";
import type { UserRefreshToken200 } from "@/api/generated/models";
import {
	getStoredToken,
	notifyUnauthorized,
	removeStoredToken,
	updateStoredToken,
} from "@/lib/auth";
import { env } from "@/utils/env";

const baseURL = env.API_BASE_URL;

const axiosInstance: AxiosInstance = axios.create({
	baseURL,
	timeout: 30000,
	withCredentials: false,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

type RetryableAxiosConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function enqueueRefreshSubscriber(cb: (token: string | null) => void) {
	refreshQueue.push(cb);
}

function notifyRefreshSubscribers(token: string | null) {
	const queue = refreshQueue;
	refreshQueue = [];
	for (const cb of queue) cb(token);
}

async function refreshAccessToken(): Promise<string> {
	const response = await axiosInstance.request<UserRefreshToken200>({
		url: "/api/auth/refresh-token",
		method: "POST",
	});

	const token = response?.data?.data?.token;
	if (!token) {
		throw new Error("Resposta inválida no refresh do token");
	}

	await updateStoredToken(token);
	return token;
}

axiosInstance.interceptors.request.use(
	async (config: InternalAxiosRequestConfig) => {
		const token = await getStoredToken();
		if (token && config.headers) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const status = error.response?.status;
		const originalRequest = error.config as RetryableAxiosConfig | undefined;
		const url = originalRequest?.url ?? "";

		const isLoginRequest =
			typeof url === "string" && url.includes("/api/auth/login");
		const isRefreshRequest =
			typeof url === "string" && url.includes("/api/auth/refresh-token");

		if (isLoginRequest || isRefreshRequest) {
			return Promise.reject(error);
		}

		// Apenas 401 indica token inválido/expirado. 403 é falta de permissão no recurso;
		// tratar 403 como 401 dispara refresh inútil e pode deslogar o usuário (ex.: Recrutador no dashboard).
		if (status === 401 && originalRequest && !originalRequest._retry) {
			originalRequest._retry = true;

			if (isRefreshing) {
				return await new Promise((resolve, reject) => {
					enqueueRefreshSubscriber((token) => {
						if (!token) {
							reject(error);
							return;
						}
						originalRequest.headers = originalRequest.headers ?? {};
						originalRequest.headers.Authorization = `Bearer ${token}`;
						resolve(axiosInstance.request(originalRequest));
					});
				});
			}

			isRefreshing = true;
			try {
				const token = await refreshAccessToken();
				notifyRefreshSubscribers(token);

				originalRequest.headers = originalRequest.headers ?? {};
				originalRequest.headers.Authorization = `Bearer ${token}`;
				return await axiosInstance.request(originalRequest);
			} catch (refreshError) {
				notifyRefreshSubscribers(null);
				await removeStoredToken();
				notifyUnauthorized();
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	},
);

export default async function apiClient<TData = unknown, TVariables = unknown>(
	config: AxiosRequestConfig,
	httpClient: AxiosInstance = axiosInstance,
	_variables?: TVariables,
): Promise<TData> {
	const response = await httpClient.request<TData>(config);
	return response.data;
}

export { axiosInstance as apiClientInstance };
