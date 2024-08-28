// 토큰 관리 store
import { defineStore } from 'pinia';

type StoreStateType = {
	accessToken: string;
	refreshToken: string;
};
export const useTokenStore = defineStore('token', {
	state: (): StoreStateType => {
		return {
			accessToken: '',
			refreshToken: '',
		};
	},
	getters: {
		access_token(state) {
			return state.accessToken;
		},
		refresh_token(state) {
			return state.refreshToken;
		},
	},
	actions: {
		setToken(accessToken: string, refreshToken: string) {
			this.accessToken = accessToken;
			this.refreshToken = refreshToken;
		},
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
