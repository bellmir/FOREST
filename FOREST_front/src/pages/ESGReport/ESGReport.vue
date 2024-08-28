<template>
	<main class="ESGReportDetail">
		<h1 class="g_pageTitle">ESG 보고서 관리</h1>
		<FilterBox class="searchFilter" @onSearch="onSearch" @onInit="onInit">
			<FilterOptionDate
				v-model:dateMode="filterDateMode"
				v-model:startDate="filterStartDate"
				v-model:endDate="filterEndDate"
			/>
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
			@rowClick="rowClick"
		>
			<template #action>
				<button
					@click="
						router.push({
							name: 'ESGReportDetail',
						})
					"
				>
					보고서 작성
				</button>
			</template>
			<template #content>
				<Column
					field="report_code"
					bodyStyle="width: 10rem; min-width: 7rem; word-break: break-all"
					bodyClass="g_link"
					header="보고서 번호"
				>
				</Column>
				<Column field="report_name" bodyStyle="text-align:left;width: 28rem; min-width: 15rem" header="보고서명">
				</Column>
				<Column
					field="enrollment_date"
					bodyStyle="width: 9rem; min-width: 8rem; word-break: break-all; color: var(--color-font-lighter)"
					header="작성일"
				></Column>
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

const route = useRoute();
const router = useRouter();

const searchCategoryList = ['보고서명', '보고서 번호']; // 검색 카테고리 리스트

const filterDateMode = ref(); // 기간 필터 - 모드
const filterStartDate = ref(); // 기간 필터 - 시작일
const filterEndDate = ref(); // 기간 필터 - 종료일
const searchCategory = ref('보고서명'); // 검색 카테고리
const search = ref(''); // 검색어

const data = ref(
	Array(2)
		.fill({
			// report_pk: 1,
			report_code: '123456789',
			report_name: '2024 나이키 ESG 보고서',
			enrollment_date: '2024-08-20',
		})
		.map((item, index) => ({ ...item, report_pk: index + 1 }))
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

const rowClick = (data: any) => {
	router.push({
		name: 'ESGReportDetail',
		params: {
			reportPk: data.data.report_pk,
		},
	});
};
</script>

<style scoped lang="scss">
.ESGReportDetail {
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
		:deep(tbody) {
			tr {
				cursor: pointer;
			}
		}
	}
}
</style>
