export const COOKIE_NAMES = {
  AUTH_TOKEN: "auth_token",
} as const;

export const COOKIE_CONFIG = {
  maxAge: 7 * 24 * 60 * 60,
  path: "/",
} as const;

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];

  return value || null;
}

export function setCookie(
  name: string,
  value: string,
  options: {
    maxAge?: number;
    path?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: "strict" | "lax" | "none";
  } = {}
): void {
  if (typeof document === "undefined") return;

  const {
    maxAge = COOKIE_CONFIG.maxAge,
    path = COOKIE_CONFIG.path,
    secure = process.env.NODE_ENV === "production",
    httpOnly = false,
    sameSite = "lax",
  } = options;

  let cookieString = `${name}=${value}; path=${path}; max-age=${maxAge}`;

  if (secure) cookieString += "; secure";
  if (httpOnly) cookieString += "; httpOnly";
  if (sameSite) cookieString += `; sameSite=${sameSite}`;

  document.cookie = cookieString;
}

export function removeCookie(
  name: string,
  path: string = COOKIE_CONFIG.path
): void {
  if (typeof document === "undefined") return;

  // Xóa cookie với nhiều cách để đảm bảo nó được xóa hoàn toàn
  document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  document.cookie = `${name}=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  document.cookie = `${name}=; path=/; domain=.${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export const authCookies = {
  get: () => getCookie(COOKIE_NAMES.AUTH_TOKEN),
  set: (token: string) => setCookie(COOKIE_NAMES.AUTH_TOKEN, token),
  remove: () => removeCookie(COOKIE_NAMES.AUTH_TOKEN),
};
