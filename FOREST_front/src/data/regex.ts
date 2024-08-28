export const idRegex = /^[a-zA-Z0-9]{6,12}$/; // 아이디 정규식
export const passRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]).{8,20}$/; // 비밀번호 정규식
export const phoneRegex = /^010-?([0-9]{4})-?([0-9]{4})$/;
export const bizNumRegex = /^([0-9]{3})-?([0-9]{2})-?([0-9]{5})$/; // 사업자번호 정규식
