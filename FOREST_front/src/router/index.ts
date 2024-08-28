// router
import { createRouter, createWebHistory } from 'vue-router';
// store
import { useLoadingStore } from '@/stores/loading';
// utils
import { getCookie } from '@/utils/function/cookie';
// component
import Home from '@/pages/Home/Home.vue';

// 로그인 상태 체크
const checkLogin = async (_: any, from: any, next: any) => {
	// if (!getCookie('webid')) {
	// 	alert('로그인이 필요한 서비스입니다.');
	// 	next('/');
	// } else {
	// 	next();
	// }
	next();
};
// 로그아웃 상태 체크
const checkLogout = async (_: any, from: any, next: any) => {
	if (getCookie('webid')) {
		next(from);
	} else {
		next();
	}
};

const routes = [
	{
		// 홈 (로그아웃 상태일때 홈)
		path: '/',
		name: 'Home',
		component: Home,
	},

	{
		// TODO: 짭 로그인 페이지 (나중에 삭제)
		path: '/Auth/Login',
		name: 'Login',
		component: () => import('@/pages/Auth/Login.vue'),
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
