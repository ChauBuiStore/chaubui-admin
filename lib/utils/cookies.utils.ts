export const COOKIE_NAMES = {
  AUTH_TOKEN: "auth_token",
} as const;

export const COOKIE_CONFIG = {
  maxAge: 7 * 24 * 60 * 60,
  path: "/",
} as const;

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const raw = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`));

  if (!raw) return null;

  const valuePart = raw.substring(name.length + 1);
  try {
    return decodeURIComponent(valuePart);
  } catch {
    return valuePart || null;
  }
}

export function setCookie(
  name: string,
  value: string,
  options: {
    maxAge?: number;
    path?: string;
    secure?: boolean;
    domain?: string;
    sameSite?: "strict" | "lax" | "none";
  } = {},
): void {
  if (typeof document === "undefined") return;

  const {
    maxAge = COOKIE_CONFIG.maxAge,
    path = COOKIE_CONFIG.path,
    secure = process.env.NODE_ENV === "production",
    domain,
    sameSite = "lax",
  } = options;

  const encodedValue = encodeURIComponent(value);

  const isSecure = sameSite === "none" ? true : secure;

  let cookieString = `${name}=${encodedValue}; Path=${path}; Max-Age=${maxAge}`;

  if (domain) cookieString += `; Domain=${domain}`;
  if (isSecure) cookieString += "; Secure";
  if (sameSite)
    cookieString += `; SameSite=${sameSite.charAt(0).toUpperCase()}${sameSite.slice(1)}`;
  document.cookie = cookieString;
}

export function removeCookie(name: string, options: { path?: string; domain?: string } = {}): void {
  if (typeof document === "undefined") return;

  const path = options.path ?? COOKIE_CONFIG.path;
  const domain = options.domain;
  const expire = "expires=Thu, 01 Jan 1970 00:00:00 GMT";

  let base = `${name}=; Path=${path}; ${expire}`;
  if (domain) base += `; Domain=${domain}`;
  document.cookie = base;

  document.cookie = `${name}=; Path=/; ${expire}`;
  if (!domain && typeof window !== "undefined") {
    const host = window.location.hostname;
    document.cookie = `${name}=; Path=/; Domain=${host}; ${expire}`;
    document.cookie = `${name}=; Path=/; Domain=.${host}; ${expire}`;
  }
}

export const authCookies = {
  get: () => getCookie(COOKIE_NAMES.AUTH_TOKEN),
  set: (token: string) => setCookie(COOKIE_NAMES.AUTH_TOKEN, token),
  remove: () => removeCookie(COOKIE_NAMES.AUTH_TOKEN),
};
