<template>
	<GlobalHeader />
	<RouterView />
	<GlobalFooter />

	<PageLoading />
	<div id="modal"></div>
</template>

<script setup lang="ts">
// component
import GlobalHeader from '@/components/common/layout/GlobalHeader.vue';
import GlobalFooter from '@/components/common/layout/GlobalFooter.vue';
import PageLoading from '@/components/common/layout/PageLoading.vue';
</script>

<style scoped></style>
