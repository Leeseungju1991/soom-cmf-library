const KEY = "soom_auth";

export function isAuthed() {
  return localStorage.getItem(KEY) === "true";
}

export function login(id: string, pw: string) {
  if (id === "soom" && pw === "soom") {
    localStorage.setItem(KEY, "true");
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem(KEY);
}
