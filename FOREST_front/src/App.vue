<template>
	<div class="content_layout">
		<GlobalSidebar v-if="route.name !== 'Login' && route.name !== 'QRCalculator'" />
		<RouterView />
	</div>

	<PageLoading />
	<div id="modal"></div>
	<Toast />
	<Toast position="bottom-center" group="bc" />
</template>

<script setup lang="ts">
// core
import { useRoute } from 'vue-router';
// component
import GlobalSidebar from '@/components/common/layout/GlobalSidebar.vue';
import PageLoading from '@/components/common/layout/PageLoading.vue';
// primevue
import Toast from 'primevue/toast';

const route = useRoute();
</script>

<style scoped>
.content_layout {
	display: flex;
}
</style>
