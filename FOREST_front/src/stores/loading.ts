// 라우터 이동시 페이지가 dynamic import 될때 loading을 위한 store
import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
	state: () => ({
		isLoading: true,
	}),
	actions: {
		startLoading() {
			this.isLoading = true;
		},
		finishLoading() {
			this.isLoading = false;
		},
	},
});
