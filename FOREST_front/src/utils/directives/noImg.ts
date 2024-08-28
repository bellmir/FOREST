import ImgToReplace from '@/assets/image/common/no_img.svg';

// 사용방법: <img :src="..." v-noImg/>

// 주석 처리된 부분 설명
// <img :src="..." loading="lazy" v-noImg/> 처럼 loading 속성을 사용하면 src 없을때 바꿔끼기만하면 되고,
// 자체적으로 observer 사용하여 lazy loading을 구현하였다면 아래 주석을 해제하고 사용하면 됩니다.

const setNoImage = (el: HTMLImageElement) => {
	// 무한루프 방지(첫번째 에러에서만 시도)
	if (el.dataset.isAlreadyError !== 'true') {
		el.src = ImgToReplace;
	}
};
const noImg = {
	beforeMount(el: HTMLImageElement) {
		if (el.nodeName !== 'IMG') {
			console.error('v-noImg는 이미지 태그에만 사용하세요');
			return;
		} else {
			el.src = el.src || ImgToReplace;

			el.onerror = (e: any) => {
				setNoImage(e.target);
				el.dataset.isAlreadyError = 'true';
			};
		}
	},
};
export default noImg;
