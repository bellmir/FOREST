// core
import { createApp } from 'vue';
// store
import stores from './stores';
// router
import router from './router';
// vue-query
import { VueQueryPlugin, VueQueryPluginOptions } from '@tanstack/vue-query';
// directives
import noImg from '@/utils/directives/noImg';
import fade from '@/utils/directives/fade';
import slide from '@/utils/directives/slide';
// component
import App from './App.vue';
// style
import '@/assets/css/reset.css';
import '@/assets/css/global.scss';
import '@/assets/css/ckeditor.scss';
// 스와이퍼 register
import { register } from 'swiper/element/bundle';
register();
// primevue
import PrimeVue from 'primevue/config';
import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';

if (import.meta.env.PROD) {
	console.log = () => {};
	console.error = () => {};
	console.debug = () => {};
}

// vue-query 기본 옵션 설정
const vueQueryPluginOptions: VueQueryPluginOptions = {
	queryClientConfig: {
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: true, // 모바일 환경 background에서 foreground로 올라올때 필요
				retry: false,
			},
		},
	},
};

const app = createApp(App);
// global variable
app.directive('noImg', noImg);
app.directive('fade', fade);
app.directive('slide', slide);
app.directive('tooltip', Tooltip);
app.use(stores);
app.use(router);
app.use(VueQueryPlugin, vueQueryPluginOptions);
app.use(ToastService);
app.use(PrimeVue, {
	locale: {
		dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
		dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
		dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
		monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
		monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
		chooseYear: '연도 선택',
	},
	theme: {
		preset: Aura,
	},
	options: {
		darkModeSelector: '.app-darkMode',
	},
});
app.mount('#app');
