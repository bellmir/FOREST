<template>
	<div class="FilterBox">
		<div class="filter_title">
			<h3>
				<img src="@/assets/image/common/icon/icon_filter.svg" alt="" />
				{{ props.filterTitle }}
			</h3>
			<div v-if="toggle">
				<button type="button" class="btn_toggle" @click="isOpen = !isOpen">
					<span>{{ isOpen ? '접기' : '펼치기' }}</span>
					<img :class="isOpen && 'open'" src="@/assets/image/common/icon/icon_expand.svg" alt="" />
				</button>
			</div>
		</div>
		<div class="toggleArea" :class="{ open: isOpen }">
			<div class="toggleArea_content">
				<div class="filter_content">
					<slot></slot>
					<div class="filter_action">
						<button class="btn_reset" type="button" @click="emit('onInit')"><ResetIcon />초기화</button>
						<button class="btn_search" type="button" @click="emit('onSearch')"><SearchIcon />검색</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// core
import { ref } from 'vue';
// image
import ResetIcon from '@/assets/image/common/icon/icon_reset.svg?component';
import SearchIcon from '@/assets/image/common/icon/icon_search.svg?component';

const props = withDefaults(
	defineProps<{
		filterTitle?: string;
		toggle?: boolean;
	}>(),
	{
		filterTitle: '검색 필터',
		toggle: true,
	}
);
const emit = defineEmits(['onSearch', 'onInit']);

const isOpen = ref(window.innerWidth > 768);
</script>

<style scoped lang="scss">
.FilterBox {
	@include mixin_mypageBox;

	@media screen and (max-width: 768px) {
		// padding: 0;
		// background-color: transparent;
		border-radius: 0;
		width: calc(100% + 4rem);
		margin: 0 -2rem;
	}
	.filter_title {
		@include mixin_flexSpaceBetween;
		gap: var(--sapce-small) var(--sapce-mid);
		line-height: 1;
		h3 {
			display: flex;
			align-items: center;
			gap: 0.6rem;
			font-size: var(--font-s-large);
			font-weight: var(--font-w-semi);
			@media screen and (max-width: 768px) {
				font-size: var(--font-s-mid);
			}
			img {
				display: none;
				width: 1em;
				height: 1em;
				@media screen and (max-width: 768px) {
					display: block;
				}
			}
		}
		.btn_toggle {
			@include mixin_flexCenter;
			gap: var(--space-x-small);
			color: var(--color-font-light);
			font-size: var(--font-s-x-small);
			img {
				width: 1em;
				height: 1em;
				&.open {
					transform: rotate(180deg);
				}
			}
		}
	}
	.toggleArea {
		display: grid;
		grid-template-rows: 0fr;
		transition: var(--transition-fast);
		&.open {
			grid-template-rows: 1fr;
		}
		.toggleArea_content {
			overflow: hidden;
			.filter_content {
				display: flex;
				flex-direction: column;
				gap: var(--space-small);
				margin-top: var(--space-x-large);
				@media screen and (max-width: 768px) {
					gap: var(--space-large);
				}
				.filter_action {
					@include mixin_flexCenter;
					gap: var(--space-small);
					button {
						font-size: var(--font-s-x-small);
						svg {
							width: 1em;
							height: 1em;
							fill: currentColor;
						}
						&.btn_reset {
							@include mixin_button($theme: 'point', $size: 'small', $radius: 'mid');
							gap: 0.5rem;
						}
						&.btn_search {
							@include mixin_button($theme: 'point', $style: 'fill', $size: 'small', $radius: 'mid');
							gap: 0.5rem;
						}
					}
				}
			}
		}
	}
}
</style>
