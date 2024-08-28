<template>
	<header class="GlobalHeader">글로벌 헤더</header>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.GlobalHeader {
	z-index: 100;
	position: fixed;
	top: 0;
	overflow: hidden;
	width: 100%;
	background-color: #fff;
	box-shadow: var(--box-shadow);
	border-bottom: none;
	height: var(--header-height);
	transition: var(--transition-slow);
}
</style>
