<template>
	<div class="SliderSelectTab">
		<div :class="`slider ${modelValue === left ? 'left' : 'right'}`"></div>
		<button :class="`c_btn-round ${modelValue === left ? 'on' : ''}`" @click.prevent="emit('update:modelValue', left)">
			{{ leftLabel ?? left }}
		</button>
		<button
			:class="`c_btn-round ${modelValue === right ? 'on' : ''}`"
			@click.prevent="() => emit('update:modelValue', right)"
		>
			{{ rightLabel ?? right }}
		</button>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	modelValue: string; // 선택된 값
	left: string; // 왼쪽 값
	leftLabel?: string; // 왼쪽 라벨 text
	right: string; // 오른쪽 값
	rightLabel?: string; // 오른쪽 라벨 text
}>();
const emit = defineEmits(['update:modelValue']);
</script>

<style scoped lang="scss">
.SliderSelectTab {
	position: relative;
	display: flex;
	color: var(--color-point);
	border-radius: var(--border-radius-full);
	border: 1px solid var(--color-point);
	.slider {
		position: absolute;
		top: 0;
		left: 0;
		width: 50%;
		height: 100%;
		background-color: var(--color-point);
		border-radius: var(--border-radius-full);
		transition: transform var(--transition-slow);
		&.left {
			transform: translateX(0);
		}
		&.right {
			transform: translateX(100%);
		}
	}
	button {
		z-index: 1;
		flex-grow: 1;
		flex-basis: 0;
		border: none;
		font-weight: var(--font-w-semi);
		line-height: 1;
		padding: var(--space-small) 0;
		transition: color var(--transition-default);
		&.on {
			color: var(--color-point-contrast);
		}
		&:hover {
			opacity: 1;
		}
	}
}
</style>
