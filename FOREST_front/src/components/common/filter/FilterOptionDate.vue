<!-- <FilterOptionDate
	title="예시 타이틀"
	v-model:dateOption="dateOption"
	v-model:dateMode="dateMode"
	v-model:startDate="filterStartDate"
	v-model:endDate="filterEndDate"
	:dateOptionList="dateOptionList"
	:dateOptionRender="(val) => val==='all' ? '전체' : val"
/> -->

<template>
	<FilterOption class="FilterOptionDate" :title="props.title">
		<div class="dateOption">
			<select
				v-if="dateOption"
				:value="dateOption"
				@change="(event: Event)=>emit('update:dateOption', (event.target as HTMLSelectElement).value)"
			>
				<option v-for="option in dateOptionList" :key="option" :value="option">
					{{ dateOptionRender(option) }}
				</option>
			</select>

			<div class="dateOption_inputArea">
				<DatePicker
					:modelValue="startDate"
					@update:modelValue="onStartDateChange"
					:maxDate="props.endDate ?? today"
					dateFormat="y.mm.dd"
					placeholder="시작일"
					showIcon
					iconDisplay="input"
				/>
				~
				<DatePicker
					:modelValue="endDate"
					@update:modelValue="onEndDateChange"
					:maxDate="today"
					:minDate="props.startDate"
					dateFormat="y.mm.dd"
					placeholder="종료일"
					showIcon
					iconDisplay="input"
				/>
			</div>
			<div class="dateOption_modeArea">
				<button class="btn_dateMode" :class="{ on: dateMode === '0' }" @click="onDateModeClick('0')">오늘</button>
				<div class="line"></div>
				<button class="btn_dateMode" :class="{ on: dateMode === '30' }" @click="onDateModeClick('30')">1개월</button>
				<div class="line"></div>
				<button class="btn_dateMode" :class="{ on: dateMode === '60' }" @click="onDateModeClick('60')">3개월</button>
				<div class="line"></div>
				<button class="btn_dateMode" :class="{ on: dateMode === '120' }" @click="onDateModeClick('120')">6개월</button>
			</div>
		</div>
	</FilterOption>
</template>

<script setup lang="ts">
// components
import FilterOption from '@/components/common/filter/FilterOption.vue';
// primevue
import DatePicker from 'primevue/datepicker';

const props = withDefaults(
	defineProps<{
		title?: string;
		dateOption?: string;
		dateOptionList?: string[];
		dateOptionRender?: (val: string) => void;
		dateMode?: string;
		startDate?: Date;
		endDate?: Date;
	}>(),
	{
		title: '기간',
		dateOptionRender: (val: string) => val,
	}
);
const emit = defineEmits(['update:dateOption', 'update:dateMode', 'update:startDate', 'update:endDate']);

// 날짜제한
const today = new Date(); // 오늘날짜

const onDateModeClick = (value: string) => {
	if (typeof value != 'string' || value === '') {
		emit('update:dateMode');
		emit('update:startDate');
		emit('update:endDate');
	} else {
		const startDate = new Date();
		startDate.setDate(startDate.getDate() - Number(value));
		emit('update:dateMode', value);
		emit('update:startDate', startDate);
		emit('update:endDate', today);
	}
};
const onStartDateChange = (date: Date) => {
	emit('update:startDate', date);
	if (props.dateMode) emit('update:dateMode', '');
};
const onEndDateChange = (date: Date) => {
	emit('update:endDate', date);
	if (props.dateMode) emit('update:dateMode', '');
};
</script>

<style scoped lang="scss">
.FilterOptionDate {
	.dateOption {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-small);
		@media screen and (max-width: 768px) {
			flex-direction: column;
		}
		.dateOption_inputArea {
			display: flex;
			align-items: center;
			gap: var(--space-x-small);
			@media screen and (max-width: 768px) {
				flex-grow: 1;
				max-width: 40rem;
			}
			:deep(.p-datepicker-input) {
				width: 11.7rem;

				@media screen and (max-width: 768px) {
					width: 100%;
					flex-basis: 0;
					flex-grow: 1;
				}
			}
		}
		.dateOption_modeArea {
			flex-grow: 1;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			border: 1px solid var(--color-border-mid);
			border-radius: var(--border-radius-mid);
			max-width: 35rem;
			height: var(--common-height);
			@media screen and (max-width: 768px) {
				max-width: 40rem;
			}
			.line {
				width: 1px;
				height: 50%;
				background-color: var(--color-border-mid);
			}
			.btn_dateMode {
				@include mixin_button($radius: 'mid');
				border: none;
				flex-basis: 0;
				flex-grow: 1;
				height: 100%;
				font-weight: var(--font-w-mid);
				&.on {
					@include mixin_button($theme: 'point', $style: 'fill', $radius: 'mid');
					border: none;
				}
			}
		}
	}
}
</style>
