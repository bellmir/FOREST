import { useQuery, useMutation } from '@tanstack/vue-query';
import { AxiosError, AxiosResponse } from 'axios';
import { api } from '@/api';

// 대시보드 정보
type GetDashboardResType = {
	carbonFootprint: any;
	incoming: any;
	outgoing: any;
};
export const useGetDashboard = () => {
	const url = '/getDashboard';
	return useQuery<AxiosResponse, AxiosError, GetDashboardResType>({
		queryKey: [url],
		queryFn: () => api.get(url),
		select: (res) => res.data?.data,
	});
};
