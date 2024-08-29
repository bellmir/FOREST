<template>
	<div class="leftMenuBar" :class="isOpened && 'opened'" style="box-shadow: 0 0.2rem 1rem rgba(151, 151, 151, 0.2)">
		<div class="topLogo">
			<div class="buttonWrap">
				<button class="btn_toggle" :class="{ open: isOpened }" @click="() => (isOpened = !isOpened)">
					<div class="line"></div>
					<div class="line"></div>
					<div class="line"></div>
				</button>
			</div>
			<img class="logo" src="@/assets/image/common/bi/logo_title.png" alt="FOREST" />
		</div>

		<ul class="mainMenu">
			<!--대시보드-->
			<li id="Dashboard" :class="selectedMenu === 'Dashboard' && 'on'" @click="onSelectMenu('Dashboard')">
				<router-link to="/">
					<span class="icon_wrap">
						<IconLeftMenuDashboard />
					</span>
					<p>대시보드</p>
				</router-link>
			</li>

			<!--입출고내역-->
			<li
				id="InventoryHistory"
				:class="selectedMenu === 'InventoryHistory' && 'on'"
				@click="onSelectMenu('InventoryHistory')"
			>
				<router-link to="/InventoryHistory">
					<span class="icon_wrap">
						<IconLeftMenuHistory />
					</span>
					<p>입출고내역</p>
				</router-link>
			</li>

			<!--재고이동-->
			<li id="InventoryMove" class="closeMenu" :class="selectedMenu === 'InventoryMove' && 'on'">
				<div class="depth" @click="onSelectMenu('InventoryMove', true)">
					<span class="icon_wrap">
						<IconLeftMenuInventory viewBox="0 0 24 24" />
					</span>
					<p>재고 이동</p>
					<div class="icon_toggle" :class="selectedSubMenu === 'InventoryMove' && 'icon_close'">
						<img src="@/assets/image/common/icon/icon_expand.svg" alt="" />
					</div>
				</div>
				<ul v-if="selectedSubMenu === 'InventoryMove' && 'on'" class="submenu">
					<li :class="activeSubmenu === 'InventoryMoveRequest' && 'submenuOn'" id="InventoryMoveRequest">
						<router-link :to="{ name: 'InventoryMoveRequest' }"><span>재고 이동 신청</span></router-link>
					</li>
					<li :class="activeSubmenu === 'InventoryMoveHistory' && 'submenuOn'" id="InventoryMove">
						<router-link :to="{ name: 'InventoryMoveHistory' }"><span>재고 이동 내역</span></router-link>
					</li>
				</ul>
			</li>

			<!--ESG 보고서-->
			<li id="ESGReport" :class="selectedMenu === 'ESGReport' && 'on'" @click="onSelectMenu('ESGReport')">
				<router-link to="/ESGReport">
					<span class="icon_wrap">
						<IconLeftMenuReport />
					</span>
					<p>ESG 보고서</p>
				</router-link>
			</li>
		</ul>

		<div class="bottomInfo">
			<!-- <div class="text_wrap text-center margin-bottom-mid">
				<h1 class="title2">{{ userStore.userInfo.admin_name }}</h1>
				<p class="body1 text-color-light">
					{{ userStore.userInfo.admin_email }}
				</p>
			</div> -->
			<button class="logout" @click="onLogOut">
				<span class="icon_wrap">
					<img src="@/assets/image/sidebar/icon_logout.svg" />
				</span>
				<p class="text-color-light">로그아웃</p>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
//SVG
import IconLeftMenuDashboard from '@/assets/image/sidebar/icon_dashboard.svg?component';
import IconLeftMenuHistory from '@/assets/image/sidebar/icon_history.svg?component';
import IconLeftMenuInventory from '@/assets/image/sidebar/icon_inventory.svg?component';
import IconLeftMenuReport from '@/assets/image/sidebar/icon_report.svg?component';
//vue core
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTokenStore } from '@/stores/token';

const route = useRoute();
const router = useRouter();
const tokenStore = useTokenStore();

const isOpened = ref(window.innerWidth > 1024); // 1024px 이상일 때 초기값은 열림
const selectedMenu = ref('Dashboard');
const selectedSubMenu = ref('');
const activeSubmenu = ref('');

//메인 메뉴 컨트롤
const onSelectMenu = (menu: string, subMenu?: boolean) => {
	const leftMenuBar = document.querySelector('.leftMenuBar');

	// 만약 화면 너비가 1024이상이고, 메뉴바가 닫혀있는 상태에서 이동하면 메뉴바 열리도록
	if (window.innerWidth > 1024 && !leftMenuBar?.classList.contains('opened')) {
		isOpened.value = true;
	}
	//서브 메뉴 컨트롤
	if (subMenu) {
		if (selectedSubMenu.value === menu) {
			selectedSubMenu.value = '';
		} else {
			selectedSubMenu.value = menu;
		}
	} else {
		selectedSubMenu.value = '';
	}
};

const onLogOut = () => {
	tokenStore.resetToken();
	router.push('/Auth/Login');
};

//url에 따라 메뉴 상태 업데이트
const updateMenu = () => {
	if (window.location.pathname === '/') {
		selectedMenu.value = 'Dashboard';
		activeSubmenu.value = '';
	} else {
		selectedMenu.value = window.location.pathname.split('/')[1];
		if (window.location.pathname.split('/')[2]) {
			selectedSubMenu.value = window.location.pathname.split('/')[1];
			activeSubmenu.value = window.location.pathname.split('/')[2];
		} else {
			selectedSubMenu.value = '';
			activeSubmenu.value = '';
		}
	}
};

onMounted(() => {
	addEventListener('resize', () => {
		if (Number(window.innerWidth) <= 1024) {
			isOpened.value = false;
		}
	});
	updateMenu();
});

watch(
	() => route.path,
	() => {
		updateMenu();
		if (window.innerWidth <= 1024) {
			isOpened.value = false; // 모바일에서는 라우트 이동시 메뉴바 닫힘
		}
		// checkMenuBarState();
	}
);
</script>

<style scoped lang="scss">
.leftMenuBar {
	z-index: 1000;
	position: sticky;
	top: 0;
	flex-shrink: 0;
	flex-grow: 0;
	width: calc(4.8rem + var(--space-small) * 2);
	height: 100dvh;
	background-color: #fff;
	transition-duration: 0.3s;
	box-shadow: var(--box-shadow);
	display: flex;
	justify-content: space-between;
	flex-direction: column;
}
.leftMenuBar.opened {
	width: calc(4.8rem + var(--space-small) * 2 + 16rem);
}
@media screen and (max-width: 1024px) {
	.leftMenuBar {
		position: fixed;
		width: 100%;
		height: var(--header-height);
		overflow: hidden;
	}
	.leftMenuBar.opened {
		width: 100%;
		height: 100dvh;
	}
}

/* topLogo START */
.leftMenuBar .topLogo {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	gap: var(--space-small);
	height: 7rem;
	padding: 0 var(--space-small);
	overflow: hidden;
}
.leftMenuBar .topLogo .buttonWrap {
	padding: var(--space-small);
	.btn_toggle {
		flex-shrink: 0;
		position: relative;
		width: 2.4rem;
		height: 2rem;
		.line {
			position: absolute;
			width: 100%;
			height: 2px;
			background-color: currentColor;
			transition: opacity var(--transition-default), transform var(--transition-default);
			transform-origin: center;
			&:first-child {
				top: 0;
			}
			&:nth-child(2) {
				top: 50%;
			}
			&:last-child {
				top: 100%;
			}
		}
	}
}
.leftMenuBar.opened .topLogo .buttonWrap .btn_toggle {
	.line {
		&:first-child {
			transform: translateY(1rem) rotate(135deg);
		}
		&:nth-child(2) {
			transform: rotateY(180deg);
			opacity: 0;
		}
		&:last-child {
			transform: translateY(-1rem) rotate(-135deg);
		}
	}
}
.leftMenuBar .topLogo .logo {
	flex-shrink: 1;
	width: 100%;
	max-width: 13rem;
	transition-duration: 0.3s;
}
@media screen and (max-width: 1024px) {
	.leftMenuBar .topLogo {
		height: var(--header-height);
	}
}
/* topLogo END */

/* mainMenu START */
.leftMenuBar .mainMenu {
	flex-grow: 1;
	position: relative;
	display: flex;
	justify-content: flex-start;
	flex-direction: column;
	width: calc(100% + 2rem);
	overflow: hidden;
	overflow-y: auto;
}
.leftMenuBar .mainMenu::-webkit-scrollbar {
	display: none;
}
.leftMenuBar .mainMenu > li {
	position: relative;
	flex-shrink: 0;
	width: calc(100% - 2rem);
	line-height: 4.8rem;
	padding: 0 var(--space-small);
	cursor: pointer;
	border-radius: 0.8rem;
	background-color: #fff;
	overflow: hidden;
	white-space: nowrap;
	cursor: pointer;
}
.leftMenuBar .mainMenu > li .icon_wrap {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 4.8rem;
	height: 4.8rem;
	padding: 1.2rem;
	box-sizing: border-box;
}
.leftMenuBar .mainMenu > li .icon_wrap svg {
	width: 100%;
	height: 100%;
	object-fit: contain;
}
.leftMenuBar .mainMenu > li.on .icon_wrap svg {
	fill: var(--color-primary);
}
.leftMenuBar.opened .mainMenu li .icon_toggle {
	position: absolute;
	right: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 4.8rem;
	height: 4.8rem;
	padding: 1.6rem;
	box-sizing: border-box;
	transition-duration: 0.2s;
}
.leftMenuBar .mainMenu li .icon_toggle {
	display: none;
}
.leftMenuBar .mainMenu li .icon_toggle.icon_close {
	transform: rotate(180deg);
}
.leftMenuBar .mainMenu > li p {
	display: none;
}
.leftMenuBar.opened .mainMenu > li.on {
	left: 1.4rem;
	z-index: 1;
	color: var(--color-primary);
	box-shadow: var(--box-shadow);
}
.leftMenuBar.opened .mainMenu li .submenu li.on {
	left: 2rem;
	background-color: #fff;
	box-shadow: var(--box-shadow);
}
.leftMenuBar.opened li.on a,
.leftMenuBar.opened li.on p {
	color: var(--color-primary);
}
.mainMenu > li a,
.mainMenu > li div {
	display: flex;
	align-items: center;
	gap: var(--space-small);
}
.leftMenuBar .mainMenu > li .icon_wrap img {
	width: 100%;
	height: 100%;
}
.leftMenuBar.opened .mainMenu > li p {
	display: inline-block;
}
.leftMenuBar .mainMenu .submenu {
	display: none;
	transition-duration: 0.3s;
}
.leftMenuBar.opened .mainMenu .submenu {
	position: relative;
	display: flex;
	justify-content: center;
	flex-direction: column;
	width: 100%;
	padding-left: 1.2rem;
	padding-bottom: 1.2rem;
	font-size: var(--font-size-small);
}
.leftMenuBar.opened .mainMenu .submenu li {
	flex-shrink: 0;
	position: relative;
	left: 0;
	display: flex;
	align-items: center;
	gap: var(--space-small);
	/* width: 100%; */
	height: 3.6rem;
	line-height: 3.6rem;
	cursor: pointer;
}
.leftMenuBar.opened .mainMenu .submenu li::before {
	content: '';
	display: block;
	width: 4px;
	height: 4px;
	background-color: var(--color-font-mid);
	border-radius: var(--border-radius-full);
}
.leftMenuBar.opened .mainMenu .submenu li a {
	width: 100%;
}
.leftMenuBar.opened .mainMenu .submenu li a span {
	color: var(--color-font-mid);
}
.leftMenuBar.opened .mainMenu .submenu li.submenuOn a span {
	color: var(--color-primary);
}
.leftMenuBar.opened .mainMenu .submenu li.submenuOn::before {
	background-color: var(--color-primary);
}
@media screen and (max-width: 1024px) {
	.leftMenuBar.opened .mainMenu > li.on {
		left: 0rem;
		color: var(--color-primary);
		box-shadow: none;
	}
	.leftMenuBar .mainMenu > li p {
		display: block;
	}
}
/* mainMenu END */

/* bottomInfo START */
.leftMenuBar .bottomInfo {
	flex-shrink: 0;
	padding: 0 var(--space-mid) var(--space-mid);
	margin-top: 1px; /* 크롬 버그때문인지 안넣으면 text_wrap의 border가 안보임 */
	overflow: hidden;
}
.leftMenuBar .bottomInfo .text_wrap {
	padding-top: var(--space-mid);
	border-top: 1px solid var(--color-border-light);
	display: none;
}
.leftMenuBar.opened .bottomInfo .text_wrap {
	display: block;
}
.leftMenuBar .bottomInfo .logout {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 4.8rem;
	width: 100%;
	margin-top: var(--space-mid);
	border: none;
	padding: 0;
}
.leftMenuBar.opened .bottomInfo .logout {
	border: 1px solid var(--color-border-light);
	border-radius: var(--border-radius-small);
}
.leftMenuBar .bottomInfo .logout p {
	display: none;
}
.leftMenuBar.opened .bottomInfo .logout p {
	display: inline-block;
}
/* bottomInfo START */
</style>
