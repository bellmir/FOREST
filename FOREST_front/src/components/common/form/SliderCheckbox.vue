<template>
	<label class="SliderCheckbox">
		<input
			type="checkbox"
			class="c_checkbox"
			:checked="checked || modelValue"
			@change="(event) => emit('update:modelValue', (event.target as HTMLInputElement).checked)"
			v-bind="$attrs"
		/>
		<div class="slider"></div>
	</label>
</template>

<script setup lang="ts">
defineOptions({
	inheritAttrs: false,
});
const props = defineProps<{
	modelValue?: string[] | boolean;
	checked?: boolean;
}>();
const emit = defineEmits(['update:modelValue']);
</script>

<style scoped lang="scss">
.SliderCheckbox {
	position: relative;
	display: block;
	width: 5.2rem;
	height: 3.2rem;
	cursor: pointer;
	input {
		display: none;
	}
	.slider {
		width: 100%;
		height: 100%;
		background-color: var(--color-base-light);
		border-radius: var(--border-radius-full);
		transition-property: background-color;
		transition-duration: var(--transition-default);
		border: 2px solid #949494;
		&:before {
			content: '';
			position: absolute;
			height: 1.6rem;
			width: 1.6rem;
			top: 0.8rem;
			left: 0.8rem;
			background-color: #949494;
			border-radius: 50%;
			transition-property: background-color, transform, width, height, top, left;
			transition-duration: var(--transition-default);
		}
	}
	input:checked + .slider {
		//background-color: var(--color-primary);
		background-color: var(--color-primary-light);
		border-color: var(--color-primary-light);
	}
	input:checked + .slider:before {
		height: 2.4rem;
		width: 2.4rem;
		top: 0.4rem;
		left: 0.4rem;
		transform: translateX(2rem);
		background-color: white;
	}
}
</style>
