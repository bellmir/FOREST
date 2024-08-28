// 대상이 자식인지 직접인지 구분하여 스타일 적용
function setTargetStyle(el: any, binding: any, isInit = false) {
	if (binding.modifiers.child) {
		// 자식 요소에 차례로
		const childrenEl = el.childNodes;
		for (let i = 0; i < childrenEl.length; i++) {
			setTimeout(
				() => {
					setStyle(childrenEl[i], binding, isInit);
				},
				isInit ? 0 : i * (binding.value?.delay ?? 200)
			);
		}
	} else {
		// 해당 요소에 직접
		setStyle(el, binding, isInit);
	}
}

// 요소에 스타일 적용
function setStyle(el: any, binding: any, isInit = false) {
	if (!el.style) return; // el.style의 undefined 예외처리
	if (isInit) {
		// 초기화
		el.style.opacity = 0;
		const time = binding.value?.time ?? 0.8;
		el.style.transition += `all ${time}s`;
		if (binding.modifiers.vertical) {
			// 수직
			el.style.transform = `translateY(${binding.value?.percent ?? '18%'})`;
		} else {
			// 수평
			el.style.transform = `translateX(${binding.value?.percent ?? '-9%'})`;
		}
	} else {
		el.style.opacity = 1;
		el.style.transform = 'translateY(0) translateX(0)';
	}
}

// v-slide
// v-slide:keep.child.vertical="{ time: 0.8, percent: '18%', delay: 200 }"
const slide = {
	beforeMount(el: any, binding: any) {
		setTargetStyle(el, binding, true); // 초기화
	},
	mounted(el: any, binding: any) {
		function motion() {
			setTargetStyle(el, binding); // 모션 적용
		}

		function createObserver() {
			// InsertionObserver 생성
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							// 대상이 교차영역에 진입 할 경우
							motion();
							if (binding.arg != 'keep') {
								observer.unobserve(el); // keep 아니면 감시할 필요 x
							}
						} else {
							// 대상이 교차영역에서 나간 경우
							if (binding.arg == 'keep') {
								setTargetStyle(el, binding, true); // 초기화
							}
						}
					});
				},
				{
					// 감지영역 조정
					rootMargin: binding.value?.rootMargin ?? '-5% 0px -12%',
					threshold: binding.value?.threshold ?? 0,
				}
			);

			observer.observe(el);
		}

		// 지원하지 않는 브라우저는 바로 모션이 동작하도록 호환성 체크
		window['IntersectionObserver'] ? createObserver() : motion();
	},
};

export default slide;
