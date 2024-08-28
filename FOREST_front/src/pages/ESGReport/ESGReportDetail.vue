<template>
	<main class="ESGReport">
		<h1 class="g_pageTitle">
			{{ reportPk ? 'ESG 보고서 제목' : 'ESG 보고서 작성' }}
		</h1>
		<section v-if="reportPk" class="report">
			<!-- 환경 섹션 -->
			<div class="reportSection">
				<h2 class="reportSection_title">환경</h2>
				<p class="reportSection_description">
					당사는 지속 가능한 경영을 위해 환경 정책과 이니셔티브를 강화하고 있습니다. 탄소 발자국 감소, 에너지 효율성
					향상, 재생 에너지 사용 확대 등을 통해 환경에 미치는 영향을 최소화하고 있습니다.
				</p>
				<h3 class="reportSection_subtitle">주요 성과</h3>
				<table class="g_table">
					<thead>
						<tr>
							<th>성과</th>
							<th>세부 내용</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>탄소 배출량 감소</td>
							<td>전년 대비 15% 감소</td>
						</tr>
						<tr>
							<td>재생 에너지 사용 확대</td>
							<td>재생 에너지 사용 비율 50% 달성</td>
						</tr>
						<tr>
							<td>물 사용량 절감</td>
							<td>신기술 도입으로 물 사용량 20% 절감</td>
						</tr>
					</tbody>
				</table>
			</div>
			<!-- 사회 섹션 -->
			<div class="reportSection">
				<h2 class="reportSection_title">사회</h2>
				<p class="reportSection_description">
					당사는 직원, 고객, 지역 사회의 복지를 최우선으로 생각합니다. 다양성과 포용성 증진, 지역 사회 참여, 공정하고
					안전한 근무 환경을 제공하기 위해 노력하고 있습니다.
				</p>
				<h3 class="reportSection_subtitle">주요 성과</h3>
				<table class="g_table">
					<thead>
						<tr>
							<th>성과</th>
							<th>세부 내용</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>다양성 및 포용성 프로그램</td>
							<td>소수자 대표성 25% 증가</td>
						</tr>
						<tr>
							<td>지역 사회 기부</td>
							<td>지역 개발 프로젝트에 20억 원 기부</td>
						</tr>
						<tr>
							<td>직원 만족도</td>
							<td>최근 조사에서 98% 만족도 달성</td>
						</tr>
					</tbody>
				</table>
			</div>
			<!-- 지배구조 섹션 -->
			<div class="reportSection">
				<h2 class="reportSection_title">지배구조</h2>
				<p class="reportSection_description">
					당사의 운영은 투명성, 책임성, 윤리적 경영을 바탕으로 하고 있습니다. 모든 이해관계자의 이익을 보호하기 위해
					견고한 지배구조를 유지하고 있습니다.
				</p>
				<h3 class="reportSection_subtitle">주요 성과</h3>
				<table class="g_table">
					<thead>
						<tr>
							<th>성과</th>
							<th>세부 내용</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>새로운 윤리 규정 도입</td>
							<td>전 부서 100% 준수</td>
						</tr>
						<tr>
							<td>이사회 다양성</td>
							<td>여성 이사 비율 40% 달성</td>
						</tr>
						<tr>
							<td>데이터 보호 강화</td>
							<td>지난해 데이터 유출 0건 달성</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="report_action">
				<button class="btn_delete">보고서 삭제</button>
			</div>
		</section>
		<section v-else class="reportWrite">
			<div class="formSection">
				<h5 class="formSection_title">보고서 정보</h5>
				<div class="formBox">
					<h5 class="formBox_title">보고서 제목</h5>
					<div class="formBox_content">
						<InputText placeholder="보고서 제목" />
					</div>
				</div>
				<div class="formBox">
					<h5 class="formBox_title">보고서 설명</h5>
					<div class="formBox_content">
						<Textarea placeholder="보고서 설명" />
					</div>
				</div>
			</div>
			<div class="formSection">
				<h5 class="formSection_title">환경</h5>
				<div class="formBox">
					<h5 class="formBox_title">보고서 내용</h5>
					<div class="formBox_content">
						<Textarea placeholder="보고서 내용" />
					</div>
				</div>
			</div>
			<div class="formSection">
				<h5 class="formSection_title">사회</h5>
				<div class="formBox">
					<h5 class="formBox_title">보고서 내용</h5>
					<div class="formBox_content">
						<Textarea placeholder="보고서 내용" />
					</div>
				</div>
			</div>
			<div class="formSection">
				<h5 class="formSection_title">지배구조</h5>
				<div class="formBox">
					<h5 class="formBox_title">보고서 내용</h5>
					<div class="formBox_content">
						<Textarea placeholder="보고서 내용" />
					</div>
				</div>
			</div>

			<div class="reportWrite_action">
				<button class="btn_save">저장</button>
			</div>
		</section>
		<div class="detailAction">
			<button class="btn_toList" @click="onToList">목록으로</button>
		</div>
	</main>
</template>

<script setup lang="ts">
// core
import { useRoute, useRouter } from 'vue-router';
// primevue
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';

const route = useRoute();
const router = useRouter();

const reportPk = route.params.reportPk;

const onToList = () => {
	// 이전 페이지가 목록일 경우 뒤로가기로 이동
	if (router.options.history.state.back === '/ESGReport') {
		router.go(-1);
	} else {
		router.push({ name: 'ESGReport' });
	}
};
</script>

<style scoped lang="scss">
.ESGReport {
	@include mixin_mainContainer; // mainContainer 적용
	.report {
		@include mixin_box;
		.reportSection {
			margin-bottom: var(--space-2x-large);
			.reportSection_title {
				font-size: var(--font-s-large);
				font-weight: var(--font-w-semi);
				margin-bottom: var(--space-x-small);
			}
			.reportSection_description {
				margin-bottom: var(--space-mid);
				color: var(--color-font-mid);
			}
			.reportSection_subtitle {
				font-size: var(--font-s-mid);
				font-weight: var(--font-w-mid);
				margin-bottom: var(--space-x-small);
			}
		}
		.report_action {
			@include mixin_flexCenter;
			.btn_delete {
				@include mixin_button($theme: 'danger', $radius: 'mid', $size: 'mid');
			}
		}
	}
	.reportWrite {
		display: flex;
		flex-direction: column;
		gap: var(--space-x-large);
		.formSection {
			@include mixin_box;
			display: flex;
			flex-direction: column;
			gap: var(--space-mid);
			.formSection_title {
				font-size: var(--font-s-large);
				font-weight: var(--font-w-semi);
			}
			.formBox {
				display: flex;
				flex-direction: column;
				gap: var(--space-x-small);
				.formBox_title {
					font-weight: var(--font-w-mid);
				}
			}
		}
		.reportWrite_action {
			@include mixin_flexCenter;
			.btn_save {
				@include mixin_button($theme: 'primary', $radius: 'mid', $size: 'mid');
			}
		}
	}
	.detailAction {
		@include mixin_flexCenter;
		.btn_toList {
			@include mixin_button($theme: 'dark', $style: 'fill', $radius: 'mid', $size: 'mid');
		}
	}
}
</style>
