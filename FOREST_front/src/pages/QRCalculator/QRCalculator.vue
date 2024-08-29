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
					@error="onError"
					@detect="onDetect"
					@camera-on="onCameraReady"
				/>
			</div>

			<div v-if="error" class="error">{{ error }}</div>
		</div>
	</main>
</template>

<script setup lang="ts">
// core
import { ref, onMounted } from 'vue';
// qrcode
import { QrcodeStream } from 'vue-qrcode-reader';

const error = ref();
const qrCodeData = ref();

const onDecode = (decoded: string) => {
	qrCodeData.value = decoded;
};
const onDetect = (decoded: string) => {
	qrCodeData.value = decoded;
};

// onMounted(() => {
// 	window.navigator.mediaDevices
// 		.getUserMedia({ video: true, audio: false })
// 		// .then((stream) => {
// 		//   // 스트림을 사용하여 비디오를 재생하거나 녹화할 수 있습니다.
// 		//   const videoElement = document.querySelector('video');
// 		//   videoElement.srcObject = stream;
// 		// })
// 		.catch((error) => {
// 			console.error('카메라 권한이 거부되었거나 문제가 발생했습니다.', error);
// 		});
// });

async function onCameraReady() {
	// NOTE: on iOS we can't invoke `enumerateDevices` before the user has given
	// camera access permission. `QrcodeStream` internally takes care of
	// requesting the permissions. The `camera-on` event should guarantee that this
	// has happened.
	const devices = await navigator.mediaDevices.enumerateDevices();
	const videoDevices = devices.filter(({ kind }) => kind === 'videoinput');

	error.value = '';
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
	}
}
</style>
