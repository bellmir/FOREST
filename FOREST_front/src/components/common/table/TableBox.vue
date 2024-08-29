<template>
	<div class="TableBox" :class="class">
		<div class="tableBox_top">
			<h3 class="top_title">검색목록</h3>
			<div class="top_action">
				<slot name="action"></slot>
				<Select
					v-if="showSelectRow"
					class="select_row"
					:modelValue="route.query.row ? rowList.find((el: any) => el.value === route.query.row) : rowList[0]"
					@update:modelValue="(val: any) => setRow(val.value)"
					:options="rowList"
					optionLabel="label"
				/>
			</div>
		</div>
		<DataTable
			class="tableBox_table"
			:value="data"
			:rows="Number(route.query.row ?? 10)"
			:selectionMode="selectionMode"
			v-bind="$attrs"
			scrollable
			scrollHeight="max(70rem, 70lvh)"
		>
			<Column
				v-if="selectionMode"
				headerStyle="padding: 0"
				bodyStyle="padding-right: 0"
				:selectionMode="selectionMode"
			></Column>
			<Column v-if="numbering" headerStyle="min-width: 6rem;" header="No.">
				<template #body="slotProps">{{ sortTableNumber(slotProps.index) }}</template>
			</Column>
			<slot name="content"></slot>
		</DataTable>
		<Pagination
			class="tableBox_pagination"
			:currentPage="Number(route.query.page ?? 1)"
			:totalCount="!!totalDataCount ? Math.ceil(totalDataCount / Number(route.query.row ?? 10)) : 1"
			@setPage="setPage"
		/>
	</div>
</template>

<script setup lang="ts">
// core
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// components
import Pagination from '@/components/common/table/Pagination.vue';
// primevue
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Select from 'primevue/select';
// utils
import { useSortTableNumber } from '@/utils/composables/useSortTableNumber';

const route = useRoute();
const router = useRouter();

defineOptions({
	inheritAttrs: false,
});
const props = withDefaults(
	defineProps<{
		class?: string;
		data: any[];
		totalDataCount: number;
		selectionMode?: 'single' | 'multiple';
		showSelectRow?: boolean; // 몇개씩 보기 selectbox 보일지 여부
		numbering?: 'ascend' | 'descend'; // 테이블 넘버링 방식
	}>(),
	{
		showSelectRow: true,
	}
);
const rowList = [
	{
		value: '10',
		label: '10개씩 보기',
	},
	{
		value: '50',
		label: '50개씩 보기',
	},
	{
		value: '100',
		label: '100개씩 보기',
	},
];

const setRow = (row: string) => {
	if ((route.query.row ?? '10') === row) return;
	router.push({ query: { ...route.query, row: row, page: 1 } });
};
const setPage = (page: number) => {
	router.push({ query: { ...route.query, page: page } });
};

// 테이블 넘버 계산하는 함수
const sortTableNumber = useSortTableNumber(
	computed(() => Number(props.totalDataCount ?? 0)),
	computed(() => Number(route.query.page ?? 1)),
	computed(() => Number(route.query.row ?? 10)),
	props.numbering
);
</script>

<style scoped lang="scss">
.TableBox {
	@include mixin_box; // mixin_box 적용
	overflow: hidden;

	@media screen and (max-width: 768px) {
		// padding: 0;
		// background-color: transparent;
		// border-radius: 0;
		// width: calc(100% + 4rem);
		// margin: 0 -2rem;
	}
	.tableBox_top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-small) var(--space-mid);
		flex-wrap: wrap;
		margin-bottom: var(--space-x-large);
		line-height: 1;
		@media screen and (max-width: 768px) {
			margin-bottom: var(--space-large);
		}
		.top_title {
			font-size: var(--font-s-large);
			font-weight: var(--font-w-semi);
			word-break: keep-all;
			@media screen and (max-width: 768px) {
				font-size: var(--font-s-mid);
			}
		}
		.top_action {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			flex-wrap: wrap;
			gap: var(--space-x-small) var(--space-small);
			:deep(button) {
				@include mixin_button($theme: 'point-light', $style: 'fill', $radius: 'mid');
				padding: var(--space-x-small) var(--space-small);
				font-weight: var(--font-w-mid);
			}
			.select_row {
				@media screen and (max-width: 768px) {
					display: none;
				}
			}
		}
	}
	.tableBox_table {
		:deep(a) {
			text-decoration: underline;
		}
	}
	.tableBox_pagination {
		margin-top: var(--space-3x-large);
		@media screen and (max-width: 768px) {
			margin-top: var(--space-2x-large);
		}
	}
}
</style>
