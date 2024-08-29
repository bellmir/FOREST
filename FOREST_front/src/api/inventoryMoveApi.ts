import { useQuery, useMutation } from '@tanstack/vue-query';
import { AxiosError, AxiosResponse } from 'axios';
import { api } from '@/api';
import { useTokenStore } from '@/stores/token';

// 창고 리스트
type GetLocationListResType = {
	_id: string;
	type: string;
	name: string;
	x_cor: string;
	y_cor: string;
	item_list: any[];
	charged_users: string[];
}[];
export const useGetLocationList = () => {
	const url = '/location/list';
	return useQuery<AxiosResponse, AxiosError, GetLocationListResType>({
		queryKey: [url],
		queryFn: () => api.get(url),
		select: (res) => res.data,
	});
};

// 출발 창고 리스트
type GetStartLocationListResType = {
	_id: string;
	type: string;
	name: string;
	x_cor: string;
	y_cor: string;
	item_list: any[];
	charged_users: string[];
}[];
export const useGetStartLocationList = () => {
	const url = '/location/66d04f2a983cf9ad425988f0';
	return useQuery<AxiosResponse, AxiosError, GetStartLocationListResType>({
		queryKey: [url],
		queryFn: () => api.get(url),
		select: (res) => res.data,
	});
};
