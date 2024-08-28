<template>
	<main class="Home">
		<section class="sample">
			<div class="sample_content">홈 페이지</div>
		</section>
	</main>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.Home {
	@include mixin_mainContainer; // mainContainer 적용
	.sample {
		@include mixin_section;
		.sample_content {
			@include mixin_inner; // inner 적용
		}
	}
}
</style>
