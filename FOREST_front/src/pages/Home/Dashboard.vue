<template>
	<main class="Dashboard">
		<h1 class="g_pageTitle">대시보드</h1>
		<section class="carbonFootprint">
			<h2 class="g_boxTitle">기업 탄소배출 목표</h2>
			<div class="companyGoal">
				<div class="companyBi">
					<img src="@/assets/image/sample/company_sample_nike.svg" alt="" />
				</div>
				<div class="goalDetail">
					<table class="g_table goalTable">
						<tr>
							<th></th>
							<th>산업 평균 탄소 효율</th>
							<th>현재 탄소 효율</th>
							<th>차이값</th>
						</tr>
						<tr>
							<th>연별</th>
							<td>960,000 kg/원</td>
							<td>540,000 kg/원</td>
							<td class="success">420,000 kg/원</td>
						</tr>
						<tr>
							<th>월별</th>
							<td>80,000 kg/원</td>
							<td>80,200 kg/원</td>
							<td class="danger">200 kg/원</td>
						</tr>
					</table>
				</div>
			</div>
			<div class="emissionStatus">
				<div class="chartBox">
					<Chart type="doughnut" class="chart" :data="todayChartData" :options="todayChartOption" />
					<p class="chart_label">오늘 배출량</p>
				</div>
				<div class="chartBox">
					<Chart type="bar" class="chart yearChart" :data="monthlyChartData" :options="monthlyChartOption" />
					<p class="chart_label">연간 배출량</p>
				</div>
			</div>
		</section>
		<section class="inventoryBrief">
			<div class="inventoryBrief_box">
				<div class="g_boxTitle">
					<IncomingIcon />
					<h2>입고</h2>
				</div>
				<div class="box_content">
					<table class="g_table">
						<tr>
							<th>당월</th>
							<th>오늘</th>
						</tr>
						<tr>
							<td>347</td>
							<td>23</td>
						</tr>
					</table>
				</div>
			</div>
			<div class="inventoryBrief_box">
				<div class="g_boxTitle">
					<OutgoingIcon />
					<h2>출고</h2>
				</div>
				<div class="box_content">
					<table class="g_table">
						<tr>
							<th>당월</th>
							<th>오늘</th>
						</tr>
						<tr>
							<td>347</td>
							<td>23</td>
						</tr>
					</table>
				</div>
			</div>
		</section>
	</main>
</template>

<script setup lang="ts">
//chart.js
import Chart from 'primevue/chart';
// image
import IncomingIcon from '@/assets/image/dashboard/incoming.svg?component';
import OutgoingIcon from '@/assets/image/dashboard/outgoing.svg?component';
// api
import { useGetDashboard } from '@/api/dashboardApi';

// const { data: dashboardData, isLoading: isGetDashboardLoading } = useGetDashboard();

const documentStyle = getComputedStyle(document.body);

const todayChartData = {
	labels: ['생산', '유통', '기타'],
	datasets: [
		{
			data: [540, 325, 20],
			backgroundColor: [
				documentStyle.getPropertyValue('--p-emerald-500'),
				documentStyle.getPropertyValue('--p-lime-500'),
				documentStyle.getPropertyValue('--p-gray-400'),
			],
			hoverBackgroundColor: [
				documentStyle.getPropertyValue('--p-emerald-400'),
				documentStyle.getPropertyValue('--p-lime-400'),
				documentStyle.getPropertyValue('--p-gray-300'),
			],
		},
	],
};
const todayChartOption = {
	plugins: {
		legend: {
			labels: {
				// usePointStyle: true,
			},
		},
	},
};

const monthlyChartData = {
	labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
	datasets: [
		{
			type: 'bar',
			label: '생산',
			backgroundColor: documentStyle.getPropertyValue('--p-orange-500'),
			data: [50, 25, 40, 48, 90, 76, 42, 55],
		},
		{
			type: 'bar',
			label: '유통',
			backgroundColor: documentStyle.getPropertyValue('--p-yellow-500'),
			data: [21, 84, 24, 75, 37, 65, 34, 30],
		},
		{
			type: 'bar',
			label: '기타',
			backgroundColor: documentStyle.getPropertyValue('--p-gray-400'),
			data: [11, 32, 24, 14, 3, 21, 12, 10],
		},
	],
};
const monthlyChartOption = {
	maintainAspectRatio: false,
	aspectRatio: 0.8,
	plugins: {
		tooltips: {
			mode: 'index',
			intersect: false,
		},
	},
	scales: {
		x: {
			stacked: true,
		},
		y: {
			stacked: true,
		},
	},
};
</script>

<style scoped lang="scss">
.Dashboard {
	@include mixin_mainContainer; // mainContainer 적용
	.carbonFootprint {
		@include mixin_box;
		.companyGoal {
			display: flex;
			gap: var(--space-x-large);
			@media screen and (max-width: 768px) {
				flex-direction: column;
			}
			.companyBi {
				flex-grow: 1;
				width: 20rem;
				height: 14rem;
				padding: var(--space-large);
				background-color: var(--color-base-brand);
				border-radius: var(--border-radius-large);
				overflow: hidden;

				@media screen and (max-width: 768px) {
					width: 100%;
				}
				img {
					@include mixin_fullImg($object-fit: contain);
				}
			}
			.goalDetail {
				flex-grow: 1;
				.goalTable {
					td {
						&.success {
							color: var(--color-success);
						}
						&.danger {
							color: var(--color-danger);
						}
					}
				}
			}
		}
		.emissionStatus {
			display: flex;
			gap: var(--space-x-large);
			margin-top: var(--space-2x-large);
			@media screen and (max-width: 768px) {
				flex-direction: column;
			}
			.chartBox {
				@include mixin_flexCenter;
				flex-direction: column;
				width: calc((100% - var(--space-x-large)) / 2);
				@media screen and (max-width: 768px) {
					width: 100%;
				}
				.chart {
					height: 45rem;
					max-width: 45rem;
					width: 100%;
					@media screen and (max-width: 768px) {
						height: auto;
						aspect-ratio: 1;
					}
					&.yearChart {
						max-width: 70rem;
					}
				}
				.chart_label {
					margin-top: var(--space-x-small);
					text-align: center;
					font-weight: var(--font-w-mid);
				}
			}
		}
	}
	.inventoryBrief {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0 var(--space-x-large);
		@media screen and (max-width: 768px) {
			grid-template-columns: 1fr;
		}
		.inventoryBrief_box {
			@include mixin_box;
			.g_boxTitle {
				display: flex;
				align-items: center;
				gap: var(--space-mid);
				svg {
					width: 1em;
					height: 1em;
					fill: currentColor;
				}
			}
			.box_content {
			}
		}
	}
}
</style>
