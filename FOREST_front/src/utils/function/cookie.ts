// cookie 생성
export function setCookie(name: string, content: string, expire: Date) {
	// 주의) domain 설정해둬서 실서버에서만 저장됨
	document.cookie = `${name}=${content};expires=${expire.toUTCString()};path=/;`;
}

// cookie 가져오기
export function getCookie(name: string): string {
	const cName = name + '=';
	const cookieData = document.cookie;

	let start = cookieData.indexOf(cName);
	if (start == -1) return '';
	start += cName.length;

	let end = cookieData.indexOf(';', start);
	if (end == -1) end = cookieData.length;
	const cValue = cookieData.substring(start, end);
	return cValue;
}

// cookie 삭제
export function deleteCookie(name: string) {
	document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

// cookie 전체 삭제
export function deleteAllCookies(domain: string = location.hostname, path: string = '/') {
	if (!document.cookie) return;

	// 반목문 순회하면서 쿠키 전체 삭제
	const cookies = document.cookie.split('; '); // 배열로 반환
	for (let i = 0; i < cookies.length; i++) {
		document.cookie = cookies[i].split('=')[0] + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT';
		// document.cookie = cookies[i].split('=')[0] + '=; expires=' + expiration + '; domain =' + domain;
	}
}
