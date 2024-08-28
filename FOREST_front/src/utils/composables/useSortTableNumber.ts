import { Ref } from 'vue';

// 테이블 넘버를 sortOption에 따라 계산하는 함수를 반환하는 컴포지션
export const useSortTableNumber = (
	totalNum: Ref<number>,
	currentPage: Ref<number>,
	row: Ref<number>,
	sortOption: 'ascend' | 'descend' = 'descend'
) => {
	if (sortOption === 'ascend') {
		// 오름차순으로 계산된 테이블 넘버
		return (idx: number) => {
			return (currentPage.value - 1) * row.value + idx + 1;
		};
	} else {
		// 내림차순으로 계산된 테이블 넘버
		return (idx: number) => {
			return totalNum.value - (currentPage.value - 1) * row.value - idx;
		};
	}
};
