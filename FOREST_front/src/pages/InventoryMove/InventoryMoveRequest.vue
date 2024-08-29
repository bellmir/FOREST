<template>
	<main class="InventoryMove">
		<h1 class="g_pageTitle">재고 이동 신청</h1>
		<section class="changeArea">
			<h2 class="g_boxTitle">품목 선택</h2>
			<div class="changeArea_content">
				<div class="storageInventory">
					<div class="formBox">
						<h3 class="storagetitle">출발지</h3>
						<Select
							class="storageSelect"
							v-model="fromStorage"
							:options="fromLocationList"
							optionLabel="name"
							placeholder="창고 선택"
						/>
					</div>
					<div v-if="fromStorage?._id" class="formBox">
						<h4>보낼 품목</h4>
						<ul class="inventoryList">
							<li class="list_item" v-for="(item, idx) in moveList">
								<Select
									class="productSelect"
									disabled
									:modelValue="{ product_name: item.product_name, product_code: item.product_code }"
									:options="
										fromStorageItemList.map((product: any) => ({
											product_name: product.product_name,
											product_code: product.product_code,
										}))
									"
									optionLabel="product_name"
									placeholder="품목 선택"
								/>
								<InputNumber class="productQuantity" disabled :modelValue="item.quantity" />
								<button @click="onDelete(item, idx)" class="btn_delete">- 삭제</button>
							</li>
							<li class="list_item addItem">
								<Select
									class="productSelect"
									v-model="selectedProduct"
									:options="addableFromStorageItemList"
									optionLabel="product_name"
									placeholder="품목 선택"
								>
									<template #value="slotProps">
										<span v-if="slotProps.value"
											>{{ slotProps.value.product_name }} ({{ slotProps.value.quantity }}개)
										</span>
										<span v-else>
											{{ slotProps.placeholder }}
										</span>
									</template>
									<template #option="{ option }"> {{ option?.product_name }} ({{ option?.quantity }}개) </template>
								</Select>
								<InputNumber
									class="productQuantity"
									:max="selectedProduct?.quantity ?? Infinity"
									v-model="selectedQuantity"
									@keypress.enter="onAdd"
									:placeholder="`수량 입력 (최대 ${selectedProduct?.quantity ?? 0}개)`"
								/>
								<button @click="onAdd" class="btn_add">+ 추가</button>
							</li>
						</ul>
					</div>
				</div>
				<div class="line"></div>
				<div class="storageInventory">
					<div class="formBox">
						<h3 class="storagetitle">도착지</h3>
						<Select
							class="storageSelect"
							v-model="toStorage"
							:options="toLocationList"
							optionLabel="name"
							placeholder="창고 선택"
						/>
					</div>
					<div v-if="toStorage?._id" class="formBox">
						<h4>재고</h4>
						<ul class="inventoryList">
							<li class="list_item" v-for="(item, idx) in toStorageItemList">
								<Select
									class="productSelect"
									disabled
									:modelValue="{ product_name: item.product_name, product_code: item.product_code }"
									:options="
										toStorageItemList.map((product: any) => ({
											product_name: product.product_name,
											product_code: product.product_code,
										}))
									"
									optionLabel="product_name"
									placeholder="품목 선택"
								/>
								<InputNumber class="productQuantity" disabled :modelValue="item.quantity" />
							</li>
							<li v-if="(toStorageItemList?.length ?? 0) === 0">재고가 없습니다.</li>
						</ul>
					</div>
				</div>
			</div>

			<div v-if="fromStorage && toStorage" class="change_carbon">
				<ul>
					<li>
						<span class="carbon_title">운송 거리</span><span class="carbon_content distance">{{ distance }} km</span>
					</li>
					<li><span class="carbon_title">탄소 소비량</span><span class="carbon_content amount">1,000 kg</span></li>
				</ul>
			</div>
			<div class="change_action">
				<button class="btn_move" @click="onMove" :disabled="moveList.length === 0 || !fromStorage || !toStorage">
					<TransactionIcon />
					이동
				</button>
			</div>
		</section>
	</main>
</template>

<script setup lang="ts">
// core
import { computed, ref } from 'vue';
// primevue
import Select from 'primevue/select';
import InputNumber from 'primevue/inputnumber';
import { useToast } from 'primevue/usetoast';
// image
import TransactionIcon from '@/assets/image/common/icon/icon_transaction.svg?component';
// api
import { useGetLocationList, useGetStartLocationList } from '@/api/inventoryMoveApi';

const toast = useToast();

const fromStorage = ref();
const toStorage = ref();

const { data: fromLocationList } = useGetStartLocationList();
const { data: toLocationList } = useGetLocationList();

const distance = computed(() => {
	if (!fromStorage.value || !toStorage.value) {
		return 0;
	} else {
		const lat1 = Number(fromStorage.value.x_cord);
		const lng1 = Number(fromStorage.value.y_cord);
		const lat2 = Number(toStorage.value.x_cord);
		const lng2 = Number(toStorage.value.y_cord);
		console.log(lat1, lng1, lat2, lng2);
		function deg2rad(deg: number): number {
			return deg * (Math.PI / 180);
		}
		const R = 6371; // Radius of the earth in km
		const dLat = deg2rad(lat2 - lat1); // deg2rad below
		const dLon = deg2rad(lng2 - lng1);
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const d = R * c; // Distance in km
		return d;
	}
});
const fromStorageItemList = [
	{
		product_name: '품목1',
		product_code: '1111111',
		quantity: 10,
	},
	{
		product_name: '품목2',
		product_code: '2222222',
		quantity: 20,
	},
	{
		product_name: '품목3',
		product_code: '3333333',
		quantity: 30,
	},
];
const addableFromStorageItemList = ref([...fromStorageItemList]);
const toStorageItemList = [
	{
		product_name: '품목1',
		product_code: '1111111',
		quantity: 70,
	},
	{
		product_name: '품목4품목4품목4품목4',
		product_code: '2222222',
		quantity: 20,
	},
];

const selectedProduct = ref();
const selectedQuantity = ref(0);
const moveList = ref<
	{
		product_name: string;
		product_code: string;
		quantity: number;
	}[]
>([]);

const onDelete = (item: any, index: number) => {
	moveList.value.splice(index, 1);
	const quantity = fromStorageItemList.find((product) => product.product_code === item.product_code)?.quantity;
	if (quantity) {
		addableFromStorageItemList.value.push({
			product_name: item.product_name,
			product_code: item.product_code,
			quantity,
		});
	}
};
const onAdd = () => {
	if (!selectedProduct.value || !selectedQuantity.value) {
		return;
	}
	moveList.value.push({
		product_name: selectedProduct.value.product_name,
		product_code: selectedProduct.value.product_code,
		quantity: selectedQuantity.value,
	});
	addableFromStorageItemList.value.splice(
		addableFromStorageItemList.value.findIndex(
			(product) => product.product_code === selectedProduct.value.product_code
		),
		1
	);
	selectedProduct.value = null;
	selectedQuantity.value = 0;
};
const onMove = () => {
	toast.add({
		severity: 'success',
		summary: '성공',
		detail: '재고가 이동되었습니다.',
		group: 'bc',
		life: 3000,
	});
};
</script>

<style scoped lang="scss">
.InventoryMove {
	@include mixin_mainContainer; // mainContainer 적용\
	.changeArea {
		@include mixin_box;
		.g_boxTitle {
			margin-bottom: var(--space-mid);
		}
		.changeArea_content {
			display: grid;
			grid-template-columns: 1fr 1px 1fr;
			gap: var(--space-small) var(--space-x-large);
			max-width: 120rem;
			@media screen and (max-width: 768px) {
				grid-template-columns: 1fr;
			}
			.line {
				width: 1px;
				height: 100%;
				background-color: var(--color-border-mid);

				@media screen and (max-width: 768px) {
					width: 100%;
					height: 1px;
				}
			}
			.storageInventory {
				display: flex;
				flex-direction: column;
				gap: var(--space-large);
				padding: var(--space-large) 0;
				.formBox {
					.storagetitle {
						font-size: var(--font-s-large);
						font-weight: var(--font-w-mid);
						margin-bottom: var(--space-small);
					}
					.storageSelect {
						width: 100%;
					}
					.inventoryList {
						.list_item {
							@include mixin_flexSpaceBetween;
							margin-top: var(--space-small);
							gap: var(--space-small);
							.productSelect {
								width: 15rem;
								flex-shrink: 0;
								@media screen and (max-width: 1024px) {
									width: 12rem;
								}
							}
							.productQuantity {
								flex-grow: 1;
							}
							.btn_delete {
								@include mixin_button($theme: 'danger', $radius: 'mid');
								height: var(--common-height);
								width: 6.4rem;
								flex-shrink: 0;
							}
							.btn_add {
								@include mixin_button($theme: 'primary', $radius: 'mid');
								height: var(--common-height);
								width: 6.4rem;
								flex-shrink: 0;
							}
						}
					}
				}
			}
		}
		.change_carbon {
			margin-top: var(--space-x-large);
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
		.change_action {
			@include mixin_flexCenter;
			max-width: 120rem;
			margin-top: var(--space-x-large);
			.btn_move {
				@include mixin_button($theme: 'primary', $style: 'fill', $size: 'mid', $radius: 'mid');
				svg {
					fill: currentColor;
				}
			}
		}
	}
}
</style>
