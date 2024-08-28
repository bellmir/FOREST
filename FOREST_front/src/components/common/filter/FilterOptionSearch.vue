<!-- <FilterOptionDate
	title="예시 타이틀"
	v-model:searchCategory="searchCategory"
	:searchCategoryList="searchCategoryList"
	:searchCategoryRender="(val) => val==='all' ? '전체' : val"
	v-model:search="search"
/> -->

<template>
	<FilterOption class="FilterOptionSearch" :title="props.title">
		<div class="searchOption">
			<Select
				v-if="searchCategoryList"
				class="serachCategory"
				:modelValue="searchCategory"
				@update:modelValue="(val) => emit('update:searchCategory', val)"
				:options="searchCategoryList"
				:optionLabel="optionLabel"
			/>
			<InputText
				type="search"
				class="searchInput"
				:modelValue="search"
				@update:modelValue="(val) => emit('update:search', val)"
				placeholder="검색어"
			/>
			<!-- <InputSearch
					:value="search"
					@input="(event: Event)=>emit('update:search', (event.target as HTMLSelectElement).value)"
					@onDelete="() => emit('update:search', '')"
				/> -->
		</div>
	</FilterOption>
</template>

<script setup lang="ts">
// components
import FilterOption from '@/components/common/filter/FilterOption.vue';
// primevue
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';

const props = withDefaults(
	defineProps<{
		title?: string;
		searchCategory?: string;
		searchCategoryList?: any[];
		optionLabel?: string;
		search: string;
	}>(),
	{
		title: '검색어',
	}
);
const emit = defineEmits(['update:searchCategory', 'update:search']);
</script>

<style scoped lang="scss">
.FilterOptionSearch {
	.searchOption {
		display: flex;
		gap: var(--space-small);
		.serachCategory {
			flex-shrink: 0;
			width: 13rem;
		}
		.searchInput {
			flex-grow: 1;
		}
	}
}
</style>
