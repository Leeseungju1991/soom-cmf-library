/**
 * 요구사항: 아이디 soom / 비밀번호 soom 단일 계정만 허용.
 * Firebase Auth를 쓰면 더 안전하지만(권장), 요구사항을 그대로 만족시키기 위해
 * 프론트에서 간단한 세션 방식을 제공합니다.
 *
 * ✅ 운영 시에는 Firebase Auth + 보안 규칙을 꼭 적용하세요.
 */
const KEY = "soom_cmf_session";

export function isLoggedIn(): boolean {
  return localStorage.getItem(KEY) === "ok";
}

export function login(id: string, pw: string): boolean {
  if (id === "soom" && pw === "soom") {
    localStorage.setItem(KEY, "ok");
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem(KEY);
}
