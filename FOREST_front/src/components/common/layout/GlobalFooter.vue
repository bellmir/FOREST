<template>
	<footer class="GlobalFooter">
		<div class="GlobalFooterContent">footer</div>
	</footer>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.GlobalFooter {
	.GlobalFooterContent {
		@include mixin_inner;
	}
}
</style>
