<template>
	<div class="FilterOption">
		<p class="option_title">{{ props.title }}</p>
		<div class="option_content">
			<slot></slot>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{
	title: string;
}>();
</script>

<style scoped lang="scss">
.FilterOption {
	display: flex;
	align-items: center;
	gap: var(--space-small) var(--space-mid);
	@media screen and (max-width: 768px) {
		flex-direction: column;
		align-items: stretch;
	}
	.option_title {
		min-width: 8rem;
		flex-shrink: 0;
		line-height: 1;
		font-weight: var(--font-w-semi);
	}
	.option_content {
		flex-grow: 1;
	}
}
</style>
