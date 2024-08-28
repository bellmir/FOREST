<template>
	<IconField class="SearchBox">
		<InputText
			type="search"
			class="searchBox_input"
			:value="modelValue"
			@update:modelValue="(val) => $emit('update:modelValue', val)"
			@keypress.enter="(event) => $emit('onSearch', event)"
			v-bind="$attrs"
		/>
		<InputIcon class="searchBox_icon" @click="(event) => $emit('onSearch', event)">
			<SearchIcon />
		</InputIcon>
	</IconField>
</template>

<script setup lang="ts">
// primevue
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
// images
import SearchIcon from '@/assets/image/common/icon/icon_search.svg?component';

defineOptions({
	inheritAttrs: false,
});
const props = defineProps<{
	modelValue: string;
}>();
defineEmits(['update:modelValue', 'onSearch']);
</script>

<style scoped lang="scss">
.SearchBox {
	flex-grow: 1;
	overflow: hidden;
	input.searchBox_input {
		padding-right: calc(var(--common-height) + var(--p-form-field-padding-x));
	}
	span.searchBox_icon {
		height: var(--common-height);
		width: var(--common-height);
		top: 0;
		right: 0;
		margin-top: 0;
		background-color: var(--color-point);
		border-top-right-radius: var(--border-radius-mid);
		border-bottom-right-radius: var(--border-radius-mid);
		cursor: pointer;
		@include mixin_flexCenter; // mixin_flexCenter 적용
		svg {
			width: 1em;
			height: 1em;
			fill: var(--color-point-contrast);
		}
	}
}
</style>
