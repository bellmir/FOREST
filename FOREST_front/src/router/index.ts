// router
import { createRouter, createWebHistory } from 'vue-router';
// store
import { useLoadingStore } from '@/stores/loading';
import { useTokenStore } from '@/stores/token';
// component
import Dashboard from '@/pages/Home/Dashboard.vue';

// 로그인 상태 체크
const checkLogin = async (_: any, from: any, next: any) => {
	const tokenStore = useTokenStore();
	if (!tokenStore.accessToken) {
		console.log('로그인 안되어있음', from);
		next('/Auth/Login');
	} else {
		next();
	}
};
// 로그아웃 상태 체크
const checkLogout = async (_: any, from: any, next: any) => {
	const tokenStore = useTokenStore();
	if (tokenStore.accessToken) {
		console.log('이미 로그인 되어있음', from);
		next(from);
	} else {
		next();
	}
};

const routes = [
	{
		// 대시보드(홈)
		path: '/',
		name: 'Dashboard',
		component: Dashboard,
		beforeEnter: [checkLogin],
	},
	{
		// 입출고내역
		path: '/InventoryHistory',
		name: 'InventoryHistory',
		component: () => import('@/pages/InventoryHistory/InventoryHistory.vue'),
		beforeEnter: [checkLogin],
	},
	{
		// 재고이동
		path: '/InventoryMove',
		name: 'InventoryMove',
		component: () => import('@/pages/InventoryMove/InventoryMove.vue'),
		beforeEnter: [checkLogin],
	},
	{
		// ESG 보고서
		path: '/ESGReport',
		name: 'ESGReport',
		component: () => import('@/pages/ESGReport/ESGReport.vue'),
		beforeEnter: [checkLogin],
	},
	{
		// ESG 보고서 상세
		path: '/ESGReport/ESGReportDetail/:reportPk?',
		name: 'ESGReportDetail',
		component: () => import('@/pages/ESGReport/ESGReportDetail.vue'),
		beforeEnter: [checkLogin],
	},

	{
		// 로그인 페이지
		path: '/Auth/Login',
		name: 'Login',
		component: () => import('@/pages/Auth/Login.vue'),
		beforeEnter: [checkLogout],
	},

	{
		// 404 NotFound 페이지
		path: '/404',
		name: 'NotFound404',
		component: () => import('@/pages/NotFound404/NotFound404.vue'),
	},
	{
		// 존재하지 않는 페이지 404로 리다이렉트
		path: '/:pathMatch(.*)*',
		redirect: '/404',
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition;
		} else {
			if (to.path !== from.path) {
				// path가 다른 경우 맨위로
				return { top: 0 };
			} else if (JSON.stringify(to.query) === JSON.stringify(from.query)) {
				// 같은 path내에서 query가 바뀌지 않은경우 부드럽게 위로 스크롤 (hash 변경 제외)
				// return { el: to.hash, top: 240, behavior: 'smooth' };
				return { top: 0, behavior: 'smooth' };
			}
		}
	},
});

let loadingTimeId: ReturnType<typeof setTimeout>;
// 페이지 변경시
router.beforeEach((to, from) => {
	const loadingStore = useLoadingStore();

	// 1초뒤에 페이지로딩 시작
	clearTimeout(loadingTimeId); // 페이지로딩 시작 취소
	loadingTimeId = setTimeout(() => {
		loadingStore.startLoading();
	}, 300);
});
router.afterEach(() => {
	const loadingStore = useLoadingStore();
	clearTimeout(loadingTimeId); // 페이지로딩 시작 취소
	loadingStore.finishLoading();
});

export default router;
