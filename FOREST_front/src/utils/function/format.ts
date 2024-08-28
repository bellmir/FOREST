// 문자열 중 숫자만 반환하는 유틸 함수
export const numberonly = (val: string | number): string => {
	if (typeof val === 'number') return String(val);
	else if (typeof val === 'string') return val.replace(/[^\d]/g, '');
	else return '';
};

// 숫자에 3자리마다 ',' 넣어주는 유틸 함수
export const numberFormat = (num?: string | number): string => {
	if (typeof num === 'string') {
		return new Intl.NumberFormat().format(Number(numberonly(num)));
	} else if (typeof num === 'number') {
		return new Intl.NumberFormat().format(num);
	} else {
		return '-';
	}
};

// 전화번호 사이에 -(dash) 넣어주는 유틸 함수
export const phoneFormat = (phoneNum: string) => {
	if (typeof phoneNum !== 'string') return '';
	const val = phoneNum.replace(/[^0-9]*/s, ''); //숫자이외 제거

	if (val.substring(0, 2) == '02') {
		return phoneNum.replace(/[^0-9]/g, '').replace(/([0-9]{2})([0-9]{3,4})([0-9]{4})$/g, '$1-$2-$3');
	} else if (
		val.substring(0, 2) == '8' ||
		val.substring(0, 2) == '15' ||
		val.substring(0, 2) == '16' ||
		val.substring(0, 2) == '18'
	) {
		return phoneNum.replace(/[^0-9]/g, '').replace(/([0-9]{4})([0-9]{4})$/g, '$1-$2');
	} else {
		return phoneNum
			.replace(/[^0-9]/g, '')
			.replace(/([0-9]{3})([0-9]{3,4})([0-9]{4})$/g, '$1-$2-$3')
			.replace(/(\-{1,2})$/g, ''); //eslint-disable-line
	}
};

// 사업자 번호 사이에 -(dash) 넣어주는 유틸 함수
export const businessNumFormat = (bizNumber: string) => {
	if (typeof bizNumber !== 'string') return '';

	return bizNumber
		.replace(/[^0-9]/g, '')
		.replace(/([0-9]{3})([0-9]{2})([0-9]{5})$/g, '$1-$2-$3')
		.replace(/(\-{1,2})$/g, ''); //eslint-disable-line
};
