import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import svgLoader from 'vite-svg-loader';
import { compression } from 'vite-plugin-compression2';

// https://vitejs.dev/config/
export default defineConfig({
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '@import "./src/assets/css/_mixin.scss";',
				sassOptions: {
					quietDeps: true,
				},
			},
		},
	},
	plugins: [
		vue({
			template: {
				compilerOptions: {
					// swiper web component 사용시 custom element로 등록 (warning 제거)
					isCustomElement: (tag) => tag === 'swiper-container' || tag.startsWith('swiper-'),
				},
			},
		}),
		svgLoader({
			defaultImport: 'url', // or 'raw'
		}),
		compression(),
	],
	resolve: {
		alias: [
			// import 경로 수정
			{ find: '@', replacement: path.resolve(__dirname, './src') },
		],
	},
});
