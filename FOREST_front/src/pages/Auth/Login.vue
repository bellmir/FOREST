<template>
	<main class="Login">
		<section class="loginForm">
			<div class="loginForm_content">
				<div class="c_section_subtitleBox">
					<div class="logo">
						<img src="@/assets/image/common/bi/logo_title.png" alt="logo" />
					</div>
					<h2 class="c_section_subtitle">로그인</h2>
				</div>
				<div class="c_fieldArea">
					<div class="FieldLayout">
						<label>아이디</label>
						<div class="field">
							<InputText v-model="email" placeholder="test@test.com" />
						</div>
						<p v-if="errors.email" class="errorText">{{ errors.email }}</p>
					</div>
					<div class="FieldLayout">
						<label>비밀번호</label>
						<div class="field">
							<Password
								v-model="password"
								@keyup.enter="onSubmitLogin"
								showToggle
								fluid
								:feedback="false"
								placeholder="8~20자 영문, 숫자, 특수문자 조합 입력"
							/>
						</div>
						<p v-if="errors.password" class="errorText">{{ errors.password }}</p>
					</div>
				</div>
				<nav class="extraMenu">
					<router-link to="">서비스 가입 문의</router-link>
					<span class="divider"></span>
					<router-link to="">비밀번호 찾기</router-link>
					<span class="divider"></span>
					<router-link to="">회원가입</router-link>
				</nav>
				<button class="btn_submit" @click="onSubmitLogin" :disabled="!meta.valid || isLoginPending">
					로그인{{ isLoginPending ? '중' : '' }}
				</button>
			</div>
		</section>
	</main>
</template>

<script setup lang="ts">
// core
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// primevue
import { useToast } from 'primevue/usetoast';
// vee-validate
import { useForm } from 'vee-validate';
import * as yup from 'yup';
// data
import { passRegex } from '@/data/regex';
// store
import { useTokenStore } from '@/stores/token';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
// api
import { useLogin } from '@/api/authApi';

const router = useRouter();
const tokenStore = useTokenStore();
const toast = useToast();

const isLoginPending = ref(false);
const timeId = ref();

// const { mutateAsync: login, isPending: isLoginPending } = useLogin();

const { meta, errors, defineField, handleSubmit } = useForm({
	validationSchema: yup.object({
		email: yup.string().required('필수 입력 항목입니다.').email('아이디는 이메일 형식이어야합니다.'),
		password: yup
			.string()
			.required('필수 입력 항목입니다.')
			.matches(passRegex, '8~20자의 영문, 숫자, 특수문자 조합으로 입력해주세요.'),
	}),
});
const [email] = defineField('email');
const [password] = defineField('password');

// 로그인 클릭시
const onSubmitLogin = handleSubmit(async (values: any) => {
	if (isLoginPending.value) return;

	// const res = await login(values);
	// if (res.data.access_token) {
	// 	tokenStore.setAccessToken(res.data.access_token);
	// 	toast.add({ severity: 'success', summary: '성공', detail: '로그인 되었습니다.', group: 'bc', life: 3000 });
	// 	router.push('/');
	// } else {
	// 	toast.add({
	// 		severity: 'error',
	// 		summary: '실패',
	// 		detail: '사용자 정보가 일치하지 않습니다.',
	// 		group: 'bc',
	// 		life: 3000,
	// 	});
	// }
	isLoginPending.value = true;
	clearTimeout(timeId.value);
	timeId.value = setTimeout(() => {
		if (values.email === 'test@test.com' && values.password === 'test1234!') {
			tokenStore.setAccessToken('testToken');
			toast.add({ severity: 'success', summary: '성공', detail: '로그인 되었습니다.', group: 'bc', life: 3000 });
			router.push('/');
		} else {
			toast.add({
				severity: 'error',
				summary: '실패',
				detail: '사용자 정보가 일치하지 않습니다.',
				group: 'bc',
				life: 3000,
			});
		}
		isLoginPending.value = false;
	}, Math.ceil(Math.random() * 300));
});
</script>

<style scoped lang="scss">
.FieldLayout {
	display: flex;
	flex-direction: column;
	font-size: var(--font-s-large);
	@media screen and (max-width: 768px) {
		font-size: var(--font-s-mid);
	}
	label {
		margin-bottom: var(--space-x-small);
		font-weight: var(--font-w-mid);
		line-height: 1.2;
		&.required {
			&::after {
				content: '*';
				color: var(--color-danger);
			}
		}
	}
	.field {
		display: flex;
		gap: var(--space-small);

		:deep(button) {
			width: 13rem;
			flex-shrink: 0;
			@media screen and (max-width: 768px) {
				width: 11rem;
			}
		}
	}
	.errorText {
		margin-top: var(--space-x-small);
		color: var(--color-danger);
		line-height: 1.3;
	}
	.successText {
		margin-top: var(--space-x-small);
		color: var(--color-primary);
		line-height: 1.3;
	}
}
.c_section_subtitleBox {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: var(--space-x-large);
	width: 100%;
	margin-bottom: var(--space-2x-large);
	@media screen and (max-width: 768px) {
		margin-bottom: var(--space-2x-large);
	}
	.logo {
		width: 12rem;
		transform: translateX(-5px);
		img {
			@include mixin_fullImg($object-fit: contain);
		}
	}
}
.c_section_subtitle {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	font-size: var(--font-s-4x-large);
	font-weight: var(--font-w-bold);
	text-align: center;
	text-wrap: balance; // 사파리를 위해
	text-wrap: pretty;
	word-break: keep-all;
	line-height: 1.3;
	@media screen and (max-width: 768px) {
		font-size: var(--font-s-2x-large);
	}
	&-sub {
		width: 100%;
		margin-top: var(--space-large);
		font-size: var(--font-s-3x-large);
		font-weight: var(--font-w-mid);
		@media screen and (max-width: 768px) {
			margin-top: var(--space-mid);
			font-size: var(--font-s-2x-large);
		}
	}
}
.c_fieldArea {
	display: flex;
	flex-direction: column;
	gap: var(--space-x-large);
	@media screen and (max-width: 768px) {
		gap: 2rem;
	}
}
.p-password-fluid {
	width: 100%;
}
.Login {
	@include mixin_mainContainer; // mainContainer 적용
	margin-top: 0 !important;
	height: 100vh;
	.loginForm {
		@include mixin_section; // section 적용

		.loginForm_content {
			@include mixin_inner; // inner 적용
			max-width: 57rem;
			margin: 0 auto;
			background-color: #fff;
			padding: var(--space-2x-large);
			border-radius: var(--border-radius-large);
			.c_fieldArea {
				margin-bottom: 4rem;
				@media screen and (max-width: 768px) {
					margin-bottom: var(--space-x-large);
				}
			}
			.extraMenu {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: var(--space-x-large);
				color: var(--color-font-mid);
				margin-bottom: var(--space-3x-large);
				font-size: var(--font-s-large);
				@media screen and (max-width: 768px) {
					gap: var(--space-mid);
					font-size: var(--font-s-mid);
					margin-bottom: var(--space-2x-large);
				}
				.divider {
					flex-shrink: 0;
					width: 1px;
					height: 1em;
					background-color: var(--color-border-light);
				}
				a {
					white-space: nowrap;
					flex-shrink: 0;
				}
			}
			.btn_submit {
				@include mixin_button($theme: 'primary', $style: 'fill', $radius: 'large', $size: 'full');
			}
		}
	}
}
</style>
