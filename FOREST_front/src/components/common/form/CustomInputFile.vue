<template>
	<div class="CustomInputFile">
		<input ref="fileInputRef" type="file" :accept="acceptFormat" @input="onFileInput" style="display: none" />
		<button
			v-if="!file || fileArray.length < MAX_FILE_COUNT"
			type="button"
			:disabled="readonly || disabled"
			class="btn_fileUpload"
			@click="fileInputRef?.click()"
		>
			<span>+ 파일 첨부</span>
			<img src="@/assets/image/common/icon/icon_file.svg" alt="clip" />
		</button>
		<div v-for="(file, idx) in fileArray" class="attached_file">
			<p class="file_name">{{ file.name }}</p>
			<div class="file_info">
				<p class="file_size">
					<span class="size_attached">{{ (file.size / 1024 / 1024).toFixed(2) }}MB</span>/5MB
				</p>
				<button type="button" class="btn_close" v-if="!readonly && !disabled" @click="$emit('removeFile', idx)">
					<img src="@/assets/image/common/icon/icon_close_light.svg" alt="x" />
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// core
import { ref, computed } from 'vue';

const props = withDefaults(
	defineProps<{
		file: File | File[] | undefined;
		MAX_FILE_COUNT?: number; // 최대 파일 개수
		MAX_FILE_SIZE?: number;
		ACCEPT_FILE_FORMAT?: string[];
		readonly?: boolean;
		disabled?: boolean;
	}>(),
	{
		MAX_FILE_COUNT: 1,
		MAX_FILE_SIZE: 5, // 5MB
		ACCEPT_FILE_FORMAT: () => ['jpg', 'jpeg', 'png', 'pdf'], // 확장자,
	}
);
const emit = defineEmits(['addFile', 'removeFile']);

const fileInputRef = ref<HTMLInputElement | null>(null);
const acceptFormat = computed(() => props.ACCEPT_FILE_FORMAT.map((el) => `.${el}`).join(', '));
const fileArray = computed(() => (!props.file ? [] : Array.isArray(props.file) ? props.file : [props.file]));

const onFileInput = (e: Event) => {
	const target = e.target as HTMLInputElement;
	const targetFile = target.files?.[0];
	target.value = '';

	if (!targetFile) return; // 파일이 존재하는지 확인
	if (!props.ACCEPT_FILE_FORMAT.includes(targetFile.type.split('/')[1])) {
		// 확장자 체크
		alert(`파일은 ${acceptFormat.value}만 첨부 가능합니다.`);
		return;
	}
	if (targetFile.size > props.MAX_FILE_SIZE * 1024 * 1024) {
		// 5MB보다 크면 안받도록
		alert('5MB 이하 이미지를 선택해주세요.');
		return;
	}
	emit('addFile', targetFile);
};
</script>

<style scoped lang="scss">
.CustomInputFile {
	display: flex;
	flex-direction: column;
	gap: var(--space-small);
	.btn_fileUpload {
		@include mixin_button($radius: 'mid');
		justify-content: space-between;
		height: var(--common-height);
		width: 100%;
		padding: 0 var(--space-small);
		border-color: var(--color-border-mid);
		&:disabled {
			cursor: default;
		}
	}
	.attached_file {
		@include mixin_button($radius: 'mid', $hover: false);
		justify-content: space-between;
		height: var(--common-height);
		width: 100%;
		padding: 0 var(--space-small);
		border-color: var(--color-border-mid);
		font-size: var(--font-s-x-small);
		color: var(--color-font-light);
		line-height: 1.2;
		cursor: default;
		.file_name {
			flex-grow: 1;
			@include mixin_ellipsis;
		}
		.file_info {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			gap: var(--space-x-small);
			.file_size {
				.size_attached {
					color: var(--color-point);
				}
			}
			.btn_close {
				width: 1em;
				height: 1em;
				&:disabled {
					cursor: default;
				}
			}
		}
	}
}
</style>
