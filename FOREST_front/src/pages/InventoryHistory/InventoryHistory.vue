<template>
	<main class="InventoryHistory">
		<h1 class="g_pageTitle">상품 입출고</h1>
		<FilterBox class="searchFilter" @onSearch="onSearch" @onInit="onInit">
			<FilterOptionDate
				v-model:dateMode="filterDateMode"
				v-model:startDate="filterStartDate"
				v-model:endDate="filterEndDate"
			/>
			<FilterOption title="카테고리">
				<div class="categoryOption">
					<Select v-model="filterDivision" :options="filterDivisionList" showClear placeholder="구분" />
					<Select v-model="filterCategory" :options="filterCategoryList" showClear placeholder="항목" />
				</div>
			</FilterOption>
			<FilterOptionSearch
				v-model:searchCategory="searchCategory"
				:searchCategoryList="searchCategoryList"
				:searchCategoryRender="(val: string) => val==='all' ? '선택' : val"
				v-model:search="search"
			/>
		</FilterBox>
		<TableBox
			class="searchResult"
			:data="
				data.slice(
					(Number(route.query.page ?? 1) - 1) * Number(route.query.row ?? 10),
					Number(route.query.page ?? 1) * Number(route.query.row ?? 10)
				)
			"
			:totalDataCount="data.length"
			:rowHover="true"
		>
			<template #content>
				<Column
					field="product_code"
					bodyStyle="width: 10rem; min-width: 7rem; word-break: break-all"
					header="상품 번호"
				>
				</Column>
				<Column field="division" bodyStyle="width: 6rem; min-width: 5rem" header="구분">
					<template #body="{ data }">
						<span
							class="division"
							:class="{ incoming: data.division === '출고', outcoming: data.division === '입고' }"
							>{{ data.division }}</span
						>
					</template>
				</Column>
				<Column field="category" bodyStyle="width: 7rem; min-width: 6rem" header="카테고리"></Column>
				<Column field="product_name" bodyStyle="width: 28rem; min-width: 15rem" header="상품명"> </Column>
				<Column field="count" bodyStyle="width: 12rem; min-width: 9rem; word-break: break-all;" header="개수"> </Column>
			</template>
		</TableBox>
	</main>
</template>

<script setup lang="ts">
// core
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// components
import FilterBox from '@/components/common/filter/FilterBox.vue';
import FilterOption from '@/components/common/filter/FilterOption.vue';
import FilterOptionSearch from '@/components/common/filter/FilterOptionSearch.vue';
import TableBox from '@/components/common/table/TableBox.vue';
import FilterOptionDate from '@/components/common/filter/FilterOptionDate.vue';
// primevue
import Column from 'primevue/column';
import Select from 'primevue/select';
// api
import { useGetInventoryHistory } from '@/api/inventoryHistoryApi';

const route = useRoute();
const router = useRouter();

const searchCategoryList = ['상품명', '상품코드']; // 검색 카테고리 리스트
const filterDivisionList = ['출고', '입고']; // 구분 필터 리스트
const filterCategoryList = ['남성의류', '여성의류', '유니섹스', '액세서리', '기타']; // 항목 필터 리스트

const filterDateMode = ref(); // 기간 필터 - 모드
const filterStartDate = ref(); // 기간 필터 - 시작일
const filterEndDate = ref(); // 기간 필터 - 종료일
const filterState = ref(); // 상태 필터
const filterDivision = ref(); // 구분 필터
const filterCategory = ref(); // 항목 필터
const searchCategory = ref('상품명'); // 검색 카테고리
const search = ref(''); // 검색어

// const { data: inventoryHistoryData, isLoading: isGetInventoryHistoryLoading } = useGetInventoryHistory(
// 	computed(() => ({
// 		page: Number(route.query.page ?? 1),
// 		row: Number(route.query.row ?? 10),
// 		// startDate: filterStartDate.value,
// 		// endDate: filterEndDate.value,
// 		// state: filterState.value,
// 		// division: filterDivision.value,
// 		// category: filterCategory.value,
// 		// searchCategory: searchCategory.value,
// 		// search: search.value,
// 	}))
// );

const data = ref(
	Array(100)
		.fill({
			// product_pk: 1,
			product_code: '123456789',
			category: '여성의류',
			division: '입고',
			product_name: '셀린 자수 배색 스트라이프 티셔츠',
			count: '1,000',
			enrollment_date: '2024-08-29',
		})
		.map((item, index) => ({ ...item, product_pk: index + 1 }))
		.map((item, index) => {
			if (index < 4) {
				item.division = '출고';
			}
			return item;
		})
);

const onSearch = () => {
	router.push({
		query: {
			page: 1,
			row: 10,
			// startDate: filterStartDate.value,
			// endDate: filterEndDate.value,
			// state: filterState.value,
			// division: filterDivision.value,
			// category: filterCategory.value,
			// searchCategory: searchCategory.value,
			// search: search.value,
		},
	});
};
const onInit = () => {
	console.log('onInit');
};
</script>

<style scoped lang="scss">
.InventoryHistory {
	@include mixin_mainContainer; // mainContainer 적용
	.searchFilter {
		.categoryOption {
			display: flex;
			gap: var(--space-small);
			@media screen and (max-width: 768px) {
				flex-direction: column;
			}
		}
	}
	.searchResult {
		.division {
			&.incoming {
				color: var(--color-danger);
			}
			&.outcoming {
				color: var(--color-success);
			}
		}
	}
}
</style>
