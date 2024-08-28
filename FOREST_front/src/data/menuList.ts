import { Component } from 'vue';

import servieGuideIcon from '@/assets/image/common/header/icon_gnb_servieGuide.svg?component';
import partnerGuideIcon from '@/assets/image/common/header/icon_gnb_partnerGuide.svg?component';
import referenceGuideIcon from '@/assets/image/common/header/icon_gnb_referenceGuide.svg?component';
import customerServiceIcon from '@/assets/image/common/header/icon_gnb_customerService.svg?component';

export type menuType = {
	depth: 1 | 2 | 3;
	title: string;
	path?: string; // (필요시) 라우팅 될 경로
	group?: string; // 서브메뉴 그룹
	icon?: Component; // 아이콘 (svg 컴포넌트)
	subMenu?: menuType[]; // 서브메뉴
};
export const mainMenu: menuType[] = [
	{
		depth: 1,
		title: '서비스 안내',
		path: '/ServiceGuide',
		group: 'ServiceGuide',
		icon: servieGuideIcon,
	},
	{
		depth: 1,
		title: '파트너 안내',
		path: '/PartnerGuide',
		group: 'PartnerGuide',
		icon: partnerGuideIcon,
	},
	{
		depth: 1,
		title: '래퍼런스 안내',
		path: '/ReferenceGuide',
		group: 'ReferenceGuide',
		icon: referenceGuideIcon,
	},
	{
		depth: 1,
		title: '고객센터',
		path: '/CustomerCenter',
		group: 'CustomerCenter',
		icon: customerServiceIcon,
	},
];
