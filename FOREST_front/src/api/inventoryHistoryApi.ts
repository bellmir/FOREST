import { useQuery, useMutation } from '@tanstack/vue-query';
import { AxiosError, AxiosResponse } from 'axios';
import { api } from '@/api';
import { Ref } from 'vue';

// 입출고내역 정보
type getInventoryHistoryParamsType = Ref<{
	page: number;
	row: number;
}>;
type getInventoryHistoryResType = {
	product_code: string;
	product_name: string;
	category: string;
	division: string;
	count: number;
}[];
export const useGetInventoryHistory = (params: getInventoryHistoryParamsType) => {
	const url = '/getInventoryHistory';
	return useQuery<AxiosResponse, AxiosError, getInventoryHistoryResType>({
		queryKey: [url, params],
		queryFn: () => api.get(url, params.value),
		select: (res) => res.data?.data,
	});
};
