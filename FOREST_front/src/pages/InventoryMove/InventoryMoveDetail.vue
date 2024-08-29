<template>
	<main class="InventoryMoveDetail">
		<h1 class="g_pageTitle">재고 이동 신청 상세</h1>
		<div class="detailContent">
			<h2 class="g_boxTitle">이동 품목</h2>
			<div class="sendProduct">
				<ul class="productList">
					<li class="list_item header">
						<div class="product_code">품목 코드</div>
						<div class="product_name">품목명</div>
						<div class="quantity">수량</div>
					</li>
					<li v-for="item in data" class="list_item">
						<div class="product_code">{{ item.product_code }}</div>
						<div class="product_name">{{ item.product_name }}</div>
						<div class="quantity">{{ item.quantity }}</div>
					</li>
				</ul>

				<Pagination
					class="tableBox_pagination"
					:currentPage="page"
					:totalCount="Math.ceil(data.length / 10)"
					@setPage="setPage"
				/>
			</div>
		</div>
		<div class="carbonAmount">
			<h2 class="g_boxTitle">탄소 배출량</h2>

			<div class="carbonAmount_content">
				<ul>
					<li><span class="carbon_title">운송 거리</span><span class="carbon_content distance">1,000 km</span></li>
					<li><span class="carbon_title">탄소 소비량</span><span class="carbon_content amount">1,000 kg</span></li>
				</ul>
			</div>
		</div>
		<div v-if="movePk < 5" class="detailAction">
			<button class="btn_confirm">승인</button>
			<button class="btn_cancel">거절</button>
		</div>
	</main>
</template>

<script setup lang="ts">
// core
import { ref } from 'vue';
import { useRoute } from 'vue-router';
// components
import Pagination from '@/components/common/table/Pagination.vue';
// primevue
import { useToast } from 'primevue/usetoast';

const route = useRoute();

const movePk = route.params.movePk;

const data = [
	{
		product_name: '품목1',
		product_code: '123456',
		quantity: 10,
	},
	{
		product_name: '품목2',
		product_code: '123456',
		quantity: 10,
	},
	{
		product_name: '품목3',
		product_code: '123456',
		quantity: 10,
	},
	{
		product_name: '품목4',
		product_code: '123456',
		quantity: 10,
	},
];

const page = ref(1);

const setPage = (val: number) => {
	page.value = val;
};
</script>

<style scoped lang="scss">
.InventoryMoveDetail {
	@include mixin_mainContainer; // mainContainer 적용\
	.detailContent {
		@include mixin_box;
		.sendProduct {
			.productList {
				margin-bottom: var(--space-small);
				.list_item {
					border-bottom: 1px solid var(--color-border-light);
					display: flex;
					font-size: var(--font-s-mid);
					&.header {
						font-weight: var(--font-w-mid);
						background-color: var(--color-base-light);
					}
					div {
						text-align: center;
						padding: var(--space-x-small);
					}
					.product_code {
						width: 15rem;
					}
					.product_name {
						width: 30rem;
						flex-grow: 1;
					}
					.quantity {
						width: 15rem;
					}
				}
			}
		}
	}
	.carbonAmount {
		@include mixin_box;
		.carbonAmount_content {
			ul {
				padding: var(--space-large);
				background-color: var(--color-base-light);
				border-radius: var(--border-radius-large);
				li {
					display: flex;
					span {
						font-size: var(--font-s-mid);
						&.carbon_title {
							font-weight: var(--font-w-mid);
							width: 10rem;
						}
						&.carbon_content {
							flex-grow: 1;
							color: var(--color-font-light);
						}
						&.amount {
							color: var(--color-primary);
						}
					}
				}
			}
		}
	}
	.detailAction {
		@include mixin_flexCenter;
		gap: var(--space-mid);
		.btn_confirm {
			@include mixin_button($theme: 'primary', $style: 'fill', $radius: 'mid', $size: 'mid');
		}
		.btn_cancel {
			@include mixin_button($theme: 'danger', $radius: 'mid', $size: 'mid');
		}
	}
}
</style>
