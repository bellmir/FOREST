<template>
	<main class="InventoryMoveHistory">
		<h1 class="g_pageTitle">재고 이동 내역</h1>
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
							name: 'InventoryMoveRequest',
						})
					"
				>
					재고 이동 신청
				</button>
			</template>
			<template #content>
				<Column
					field="request_code"
					bodyStyle="width: 10rem; min-width: 7rem; word-break: break-all"
					bodyClass="g_link"
					header="내역 번호"
				>
				</Column>
				<Column field="status" bodyStyle="width: 6rem; min-width: 5rem" header="상태">
					<template #body="{ data }">
						<div class="status" :class="{ check: data.status === '요청' }">{{ data.status }}</div>
					</template>
				</Column>
				<Column field="request_name" bodyStyle="width: 28rem; min-width: 15rem" header="내역명"> </Column>
				<Column field="from" bodyStyle="width: 9rem; min-width: 8rem; word-break: break-all;" header="출발지"></Column>
				<Column field="to" bodyStyle="width: 9rem; min-width: 8rem; word-break: break-all;" header="도착지"></Column>
				<Column
					field="enrollment_date"
					bodyStyle="width: 9rem; min-width: 8rem; word-break: break-all; color: var(--color-font-lighter)"
					header="이동일"
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

const searchCategoryList = ['내역번호', '창고명']; // 검색 카테고리 리스트

const filterDateMode = ref(); // 기간 필터 - 모드
const filterStartDate = ref(); // 기간 필터 - 시작일
const filterEndDate = ref(); // 기간 필터 - 종료일
const searchCategory = ref('내역번호'); // 검색 카테고리
const search = ref(''); // 검색어

const data = ref(
	Array(100)
		.fill({
			// move_pk: 1,
			request_name: '창고 이동 샘플',
			request_code: '123456789',
			status: '요청',
			from: '창고2',
			to: '창고1',
			enrollment_date: '2024-08-20',
		})
		.map((item, index) => ({ ...item, move_pk: index + 1 }))
		.map((item, index) => {
			if (index > 4) {
				item.status = '완료';
				item.from = '창고1';
				item.to = '창고2';
				return item;
			} else {
				return item;
			}
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

const rowClick = (data: any) => {
	router.push({
		name: 'InventoryMoveDetail',
		params: {
			movePk: data.data.move_pk,
		},
	});
};
</script>

<style scoped lang="scss">
.InventoryMoveHistory {
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
		.status {
			&.check {
				color: var(--color-warning);
			}
		}
		:deep(tbody) {
			tr {
				cursor: pointer;
			}
		}
	}
}
</style>
