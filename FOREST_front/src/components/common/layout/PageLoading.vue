<template>
	<transition name="g_fade">
		<div v-if="loadingStore.isLoading" class="PageLoading">
			<div class="loading_spinner"></div>
		</div>
	</transition>
</template>

<script setup lang="ts">
import { useLoadingStore } from '@/stores/loading';

const loadingStore = useLoadingStore();
</script>

<style scoped lang="scss">
.PageLoading {
	z-index: 1000;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	left: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: rgba(255, 255, 255, 0.7);
	.loading_spinner {
		border: 4px solid rgba(0, 0, 0, 0.1);
		border-left-color: var(--color-primary);
		border-radius: 50%;
		width: 24px;
		height: 24px;
		animation: spin 1s linear infinite;
	}
	/* .loading_text {
		margin-top: 1rem;
		font-size: var(--font-s-x-mall);
		color: var(--color-font-mid);
	} */
}
@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>
