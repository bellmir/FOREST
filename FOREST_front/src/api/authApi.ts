import { useQuery, useMutation } from '@tanstack/vue-query';
import { AxiosError, AxiosResponse } from 'axios';
import { api } from '@/api';
import { useTokenStore } from '@/stores/token';
import { computed } from 'vue';
import { CommonResType } from '@/types/commonApiType';

// 유저정보
type GetUserInfoResType = {
	birthday: string;
	contact: string;
	country: string;
	email: string;
	gender: string;
	name: string;
	profile_url: string;
	state: string;
	telecom: string;
};
export const useGetUserInfo = () => {
	const url = '/getUserInfo';
	const tokenStore = useTokenStore();
	return useQuery<AxiosResponse, AxiosError, GetUserInfoResType>({
		queryKey: [url],
		queryFn: () => api.get(url),
		select: (res) => res.data?.data?.member,
		staleTime: 1000 * 60 * 60, // 1시간 stale. 로그아웃시 invalidateQueries로 캐시 삭제
		gcTime: 1000 * 60 * 60, // 1시간
		enabled: computed(() => !tokenStore.access_token),
	});
};

// 로그인
type LoginDataType = {
	email: string;
	password: string;
};
type LoginResType = {
	access_token: string;
};
export const useLogin = () => {
	const url = '/auth/login';
	return useMutation<AxiosResponse<LoginResType>, AxiosError, LoginDataType>({
		mutationFn: (data: LoginDataType) => api.post(url, data),
	});
};
