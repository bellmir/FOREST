<template>
	<div class="Pagination">
		<div class="pagination_action" @click="onFirstPageClick">
			<svg
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				viewBox="0 0 24 24"
			>
				<g style="fill: #a6a6a6">
					<path d="M11.9,22.3L1.7,12.5L11.9,1.7L14,3.6l-8.2,8.6l8.1,7.8L11.9,22.3z" />
					<path d="M20.2,22.3L10,12.5L20.2,1.7l2.1,1.9l-8.2,8.6l8.1,7.8L20.2,22.3z" />
				</g>
			</svg>
		</div>
		<div class="pagination_action" @click="onPrevPageClick">
			<svg
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				viewBox="0 0 24 24"
			>
				<path fill="#A6A6A6" d="M16.1,22.3L5.9,12.5L16.1,1.7l2.1,1.9L10,12.2l8.1,7.8L16.1,22.3z" />
			</svg>
		</div>

		<div class="pagination_num">
			<p
				v-for="i in Math.min(maxShow, Math.max(totalCount - prevPageCount, 0))"
				:key="i"
				:class="currentPage === prevPageCount + i && 'on'"
				@click="onPageClick(prevPageCount + i)"
			>
				{{ prevPageCount + i }}
			</p>
		</div>

		<div class="pagination_action" @click="onNextPageClick">
			<svg
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				viewBox="0 0 24 24"
			>
				<path fill="#A6A6A6" d="M8,1.7l10.2,9.8L8,22.3l-2.1-1.9l8.2-8.6L6,4L8,1.7z" />
			</svg>
		</div>
		<div class="pagination_action" @click="onLastPageClick">
			<svg
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				viewBox="0 0 24 24"
			>
				<g style="fill: #a6a6a6">
					<path d="M12.1,1.7l10.2,9.8L12.1,22.3L10,20.4l8.2-8.6L10.1,4L12.1,1.7z" />
					<path d="M3.8,1.7L14,11.5L3.8,22.3l-2.1-1.9l8.2-8.6L1.8,4L3.8,1.7z" />
				</g>
			</svg>
		</div>
	</div>
</template>

<script setup lang="ts">
// core
import { ref, computed, onMounted, onUnmounted } from 'vue';
// utils
import { throttle } from 'lodash-es';

const props = defineProps<{
	currentPage: number; //	현재 페이지
	totalCount: number; //	총 페이지 수
}>();
const emit = defineEmits(['setPage']);

const maxShow = ref(10); //	한번에 보여줄 최대 페이지 범위

// 이전 범위의 페이지 수 (maxShow가 10일경우 현재 페이지가 1~10 이면 0, 11~20이면 10 반환)
const prevPageCount = computed(() => {
	return Math.max(Math.floor((props.currentPage - 1) / maxShow.value) * maxShow.value, 0);
});

const onResize = throttle(
	() => {
		if (window.innerWidth <= 768) {
			maxShow.value = 5;
		} else {
			maxShow.value = 10;
		}
	},
	100,
	{
		trailing: true,
	}
);
onMounted(() => {
	window.addEventListener('resize', onResize);
	onResize();
});
onUnmounted(() => {
	window.removeEventListener('resize', onResize);
});

const onFirstPageClick = () => {
	if (props.currentPage > 1) {
		emit('setPage', 1);
	}
};
const onPrevPageClick = () => {
	if (props.currentPage > 1) {
		emit('setPage', props.currentPage - 1);
	}
};
const onNextPageClick = () => {
	if (props.currentPage < props.totalCount) {
		emit('setPage', props.currentPage + 1);
	}
};
const onLastPageClick = () => {
	if (props.currentPage < props.totalCount) {
		emit('setPage', props.totalCount);
	}
};
const onPageClick = (page: number) => {
	if (page !== props.currentPage) {
		emit('setPage', page);
	}
};
// -----페이징 액션 끝
</script>

<style scoped lang="scss">
.Pagination {
	display: flex;
	align-items: center;
	justify-content: center;
	.pagination_num {
		display: flex;
		gap: var(--space-small);
	}
	.pagination_num p {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.8rem;
		height: 2.8rem;
		/* border:1px solid var(--color-border-light); */
		border-radius: var(--border-radius-mid);
		color: var(--color-font-light);
		cursor: pointer;
		transition-duration: 0.2s;
		&.on {
			background-color: var(--color-point);
			color: var(--color-point-contrast);
		}
	}
	.pagination_action {
		display: flex;
		align-content: center;
		justify-content: center;
		width: 3.6rem;
		height: 3.6rem;
		padding: 1.2rem;
		box-sizing: border-box;
		cursor: pointer;
		svg {
			width: 100%;
			height: 100%;
		}
	}
}
</style>
