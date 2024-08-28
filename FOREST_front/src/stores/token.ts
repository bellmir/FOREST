// 토큰 관리 store
import { defineStore } from 'pinia';

type StoreStateType = {
	accessToken: string;
};
export const useTokenStore = defineStore('token', {
	state: (): StoreStateType => {
		return {
			accessToken: '',
		};
	},
	getters: {
		getAccessToken(state) {
			return state.accessToken;
		},
	},
	actions: {
		setAccessToken(accessToken: string) {
			this.accessToken = accessToken;
		},
		resetToken() {
			this.$reset();
		},
	},
	persist: [
		{
			paths: ['accessToken'],
			storage: localStorage,
		},
	],
});
