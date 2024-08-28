<template>
	<div class="NotFound404">
		<div class="inform">
			<div class="text_box">
				<h1>404</h1>
				<p>존재하지 않는 페이지입니다.</p>
			</div>
			<router-link to="/" class="btn_return">돌아가기 </router-link>
		</div>
	</div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.NotFound404 {
	@include mixin_mainContainer;

	.inform {
		@include mixin_section;
		padding: var(--space-mid);
		min-height: 80vh;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: 4rem;
		.illust_box {
			width: 40%;
			min-width: 20rem;
			/* border:1px solid blue; */
		}
		.text_box {
			text-align: center;
			h1 {
				color: var(--color-primary);
				font-size: 12rem;
				font-weight: var(--font-w-bold);
				margin-bottom: 1rem;
			}
			p {
				font-size: var(--font-s-small);
			}
		}
		.btn_return {
			@include mixin_button($theme: 'primary', $radius: 'full', $size: 'large', $hover: false);
			&:hover {
				@include mixin_button($theme: 'primary', $style: 'fill', $hover: false);
			}
		}
	}
}
</style>
