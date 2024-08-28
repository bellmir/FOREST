export {};

declare module 'vue-fullpage.js';

declare module 'vue' {
	// export interface GlobalComponents {}
}

declare global {
	interface Window {
		daum: any;
	}
}
