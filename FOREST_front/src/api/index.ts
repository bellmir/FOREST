// axios
import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
// core
import { computed } from 'vue';
// store
import { useTokenStore } from '@/stores/token';
// router
import Router from '../router';
// mem - 토큰 재발급 위함
import mem from 'mem';
// utils
// import { getJwtExpiration } from '@/utils/function/jwt';

const instance = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL,
});

// 토큰 재발급 함수
const requestToken = mem(
	async (): Promise<string | void> => {
		const tokenStore = useTokenStore();
		try {
			const tokenRes = await instance.post('/requestToken', {
				refresh_token: tokenStore.refresh_token,
			});
			const accessToken = tokenRes.data?.data.access_token;
			if (accessToken) {
				tokenStore.setAccessToken(tokenRes.data.data.access_token);
			}
			return accessToken;
		} catch (e: any) {
			console.error('requestToken error', e);
		}
	},
	{ maxAge: 1000 }
);

// request 보내기전 작업
instance.interceptors.request.use(
	async (request: InternalAxiosRequestConfig) => {
		const tokenStore = useTokenStore();
		const accessToken = computed(() => tokenStore.access_token);
		request.headers.Authorization = accessToken.value ? 'Bearer ' + accessToken.value : null;
		// try {
		// 	if (tokenStore.access_token && getJwtExpiration(tokenStore.access_token) < new Date()) {
		// 		const accessToken = await requestToken(); // 토큰 재발급
		// 		// 새 토큰이 정상적으로 발급되면 토큰 저장 후, 중단된 요청을 재요청
		// 		if (accessToken) {
		// 			request.headers.Authorization = accessToken;
		// 			return request;
		// 		}
		// 	}
		// } catch (error) {
		// 	console.error('interceptors.request ' + error);
		// }
		return request;
	},
	(error: AxiosError) => {
		return Promise.reject(error);
	}
);
// response 받은 후 작업
instance.interceptors.response.use(
	// 2xx 범위인 경우
	async (response: AxiosResponse) => {
		const { config, data } = response;

		console.log(`${config.url} \n`, data); // 데이터 콘솔로 찍기
		// const error = response?.data?.error;

		return response;
	},

	// 2xx 범위 외의 상태코드
	async (error: AxiosError) => {
		const tokenStore = useTokenStore();
		const config = error.config as InternalAxiosRequestConfig;
		const response = error.response as AxiosResponse;

		console.error(`${config.url} \n`, error); // 에러 콘솔로 찍기

		// 401, 403 에러 시 토큰 재발급
		if (response.status === 401 || response.status === 403) {
			// requestToken 요청인 경우 로그아웃
			if (config.url === '/requestToken') {
				tokenStore.resetToken();
				alert('로그인이 만료되었습니다. 다시 로그인해주세요');
				Router.push('/');
			} else {
				const accessToken = await requestToken(); // 토큰 재발급
				// 새 토큰이 정상적으로 발급되면 토큰 저장 후, 중단된 요청을 재요청
				if (accessToken) {
					config.headers.Authorization = accessToken;
					return instance(config);
				}
			}
		} else if (error.code === 'ERR_NETWORK') {
			alert('네트워크 에러. 잠시 후 시도해주세요');
		} else if (error.code === 'ERR_BAD_RESPONSE') {
			alert('서버가 응답하지 않습니다. 서비스 관리자에게 문의해주세요');
		} else if (error.code === 'ECONNABORTED') {
			alert('요청시간을 초과했습니다. 잠시 후 시도해주세요');
		} else if (error.code === 'ERR_BAD_REQUEST') {
			alert('올바르지 않은 요청입니다. 서비스 관리자에게 문의해주세요');
		} else {
			alert(error.code ?? '알 수 없는 에러가 발생했습니다. 서비스 관리자에게 문의해주세요');
		}

		return Promise.reject(error);
	}
);

export const api = {
	get: <T>(url: string, params?: any, config?: any) => instance.get<T>(url, { params, ...config }),
	post: <T>(url: string, data?: any, config?: any) => instance.post<T>(url, data, config),
	put: <T>(url: string, data?: any, config?: any) => instance.put<T>(url, data, config),
	patch: <T>(url: string, data?: any, config?: any) => instance.patch<T>(url, data, config),
	delete: <T>(url: string, params?: any, config?: any) => instance.delete<T>(url, { params, ...config }),
};
