<template>
	<main class="QRCalculator">
		<div class="QRCalculator_content">
			<div class="logo">
				<img src="@/assets/image/common/bi/logo_title.png" alt="logo" />
			</div>
			<h1>QR 코드를 통해 탄소발자국을 확인해보세요!</h1>

			<div class="cameraArea">
				<qrcode-stream
					:constraints="{ facingMode: 'environment' }"
					:formats="['qr_code']"
					:track="paintOutline"
					@error="onError"
					@detect="onDetect"
				/>
			</div>

			<div v-if="error" class="error">{{ error }}</div>

			<div class="addedProduct">
				<h2 class="totalCarbon">
					총 탄소배출량: <span class="totalCarbon_amount">{{ totalCarbon }}kg</span>
				</h2>
				<ul class="addedList">
					<li v-for="item in addedProductList" class="list_item">
						<details>
							<summary>
								<div class="list_summary">
									<div class="product_name">
										{{ item.name }}
									</div>
									<div class="emission">
										<span class="emission_title">탄소배출량</span
										><span class="emission_content">{{ item.emission }}</span>
									</div>
								</div>
							</summary>
							<div class="list_detail">
								<div class="material">
									<h3>소재</h3>
									<p>{{ item.material }}</p>
								</div>
								<div class="moveHistory">
									<h3>이동 경로</h3>
									<ul>
										<li v-for="history in item.moveHistory">{{ history.location }}</li>
									</ul>
								</div>
							</div>
						</details>
					</li>
				</ul>
			</div>
		</div>
	</main>
</template>

<script setup lang="ts">
// core
import { ref, onMounted, computed } from 'vue';
// qrcode
import { QrcodeStream } from 'vue-qrcode-reader';
// primevue
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const error = ref();
const qrCodeData = ref();
const addedProductList = ref<
	{
		id: number;
		name: string;
		material: string;
		emission: string;
		moveHistory: { location: string }[];
	}[]
>([]);
const totalCarbon = computed(() => {
	return addedProductList.value
		.reduce((acc, cur) => {
			return acc + parseFloat(cur.emission);
		}, 0)
		.toFixed(2);
});

const mockProductData = [
	{
		id: 123,
		name: '레이버 쿨링 카고 팬츠',
		material: '폴리 83%  + 레이온 13% + 스판 4%',
		emission: '121.07kg',
		moveHistory: [
			{
				location: '부산광역시 부산진구 동천로108번길 36',
			},
			{
				location: '서울특별시 서초구 양재동 225-5',
			},
			{
				location: '서울 서초구 바우뫼로12길 70 더케이호텔서울',
			},
		],
	},
	{
		id: 456,
		name: '뱅크 옆밴드 링클프리 슬랙스',
		material: '폴리 83%  + 레이온 13% + 스판 4%',
		emission: '103.20kg',
		moveHistory: [
			{
				location: '부산광역시 부산진구 동천로108번길 36',
			},
			{
				location: '서울특별시 서초구 양재동 225-5',
			},
			{
				location: '경기도 의정부시 체육로 123 (녹양동 285-3)',
			},
			{
				location: '서울 서초구 바우뫼로12길 70 더케이호텔서울',
			},
		],
	},
	{
		id: 789,
		name: '[6COLOR] 플레인 스냅 후드',
		material: '면 80% + 폴리에스터 20%',
		emission: '58.17kg',
		moveHistory: [
			{
				location: '서울 성동구 성수이로 66 서울숲 드림타워 105호 (성수동2가)',
			},
			{
				location: '서울특별시 서초구 양재동 225-5',
			},
			{
				location: '경기도 의정부시 체육로 123 (녹양동 285-3)',
			},
			{
				location: '서울 서초구 바우뫼로12길 70 더케이호텔서울',
			},
		],
	},
];

const onDetect = (decoded: any[]) => {
	const productIds = decoded.map((el) => JSON.parse(el.rawValue)?.id);
	productIds.forEach((productId) => {
		if (addedProductList.value.find((item) => item.id == productId)) {
			return;
		}
		const foundItem = mockProductData.find((item) => item.id == productId);
		if (foundItem) {
			addedProductList.value.push(foundItem);
		}
		toast.add({
			severity: 'success',
			summary: '성공',
			detail: '품목이 추가되었습니다.',
			group: 'bc',
			life: 2500,
		});
	});
};

function paintOutline(detectedCodes: any, ctx: any) {
	for (const detectedCode of detectedCodes) {
		const [firstPoint, ...otherPoints] = detectedCode.cornerPoints;

		ctx.strokeStyle = 'red';

		ctx.beginPath();
		ctx.moveTo(firstPoint.x, firstPoint.y);
		for (const { x, y } of otherPoints) {
			ctx.lineTo(x, y);
		}
		ctx.lineTo(firstPoint.x, firstPoint.y);
		ctx.closePath();
		ctx.stroke();
	}
}

function onError(err: any) {
	error.value = `[${err.name}]: `;

	if (err.name === 'NotAllowedError') {
		error.value += 'you need to grant camera access permission';
	} else if (err.name === 'NotFoundError') {
		error.value += 'no camera on this device';
	} else if (err.name === 'NotSupportedError') {
		error.value += 'secure context required (HTTPS, localhost)';
	} else if (err.name === 'NotReadableError') {
		error.value += 'is the camera already in use?';
	} else if (err.name === 'OverconstrainedError') {
		error.value += 'installed cameras are not suitable';
	} else if (err.name === 'StreamApiNotSupportedError') {
		error.value += 'Stream API is not supported in this browser';
	} else if (err.name === 'InsecureContextError') {
		error.value += 'Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.';
	} else {
		error.value += err.message;
	}
}
</script>

<style scoped lang="scss">
.QRCalculator {
	@include mixin_mainContainer;
	margin-top: 0 !important;
	height: 100vh;
	background-color: #fff;
	.QRCalculator_content {
		@include mixin_inner;
		.logo {
			margin: 0 auto;
			width: 20rem;
			img {
				@include mixin_fullImg($object-fit: contain);
			}
		}
		h1 {
			margin-top: var(--space-2x-large);
			text-align: center;
			font-size: var(--font-s-2x-large);
			font-weight: bold;
		}
		.cameraArea {
			margin: var(--space-large) auto;
			width: 30rem;
			aspect-ratio: 1;
			border: 1px solid var(--color-border-dark);
			border-radius: var(--border-radius-small);
		}
		.error {
			margin-top: var(--space-large);
			text-align: center;
			color: var(--color-danger);
		}
		.addedProduct {
			.totalCarbon {
				padding: var(--space-x-small);
				margin-bottom: var(--space-mid);
				background-color: var(--color-base-mid);
				border-radius: var(--border-radius-mid);
				text-align: center;
				font-size: var(--font-s-large);
				font-weight: var(--font-w-semi);
				.totalCarbon_amount {
					color: var(--color-primary);
				}
			}
			.addedList {
				display: flex;
				flex-direction: column;
				gap: var(--space-small);
				.list_item {
					.list_summary {
						.product_name {
							font-weight: var(--font-w-semi);
						}
						.emission {
							.emission_title {
								margin-right: var(--space-small);
							}
							.emission_content {
								color: var(--color-primary);
							}
						}
					}
					.list_detail {
						font-size: var(--font-s-x-small);
						h3 {
							font-weight: var(--font-w-semi);
						}
						.material {
							margin-bottom: var(--space-x-small);
						}
						.moveHistory {
							ul {
								color: var(--color-font-light);
							}
						}
					}
				}
			}
		}
	}
}
</style>
