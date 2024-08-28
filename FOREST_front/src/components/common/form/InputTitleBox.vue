<template>
	<div class="InputTitleBox" :class="{ flex: flex }">
		<p class="box_title" :class="{ required: required }">{{ title }}</p>
		<slot></slot>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	title: string;
	required?: boolean;
	flex?: boolean;
}>();
</script>

<style scoped lang="scss">
.InputTitleBox {
	overflow: hidden;
	.box_title {
		margin-bottom: var(--space-small);
		line-height: 1;
		&.required {
			display: flex;
			align-items: center;
			gap: var(--space-2x-small);
			&::after {
				content: '';
				width: 4px;
				height: 4px;
				border-radius: 50%;
				background-color: var(--color-danger);
			}
		}
	}
}
</style>
