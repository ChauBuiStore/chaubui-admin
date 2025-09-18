export interface TokenInfo {
  isValid: boolean;
  isExpired: boolean;
  expiresAt?: Date;
  payload?: unknown;
}

export function parseJWTToken(token: string): TokenInfo {
  try {
    if (!token) {
      return { isValid: false, isExpired: true };
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return { isValid: false, isExpired: true };
    }

    const payload = JSON.parse(atob(parts[1]));
    
    if (!payload.exp) {
      return { isValid: false, isExpired: true };
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp < currentTime;
    
    const expiresAt = new Date(payload.exp * 1000);

    return {
      isValid: true,
      isExpired,
      expiresAt,
      payload
    };
  } catch {
    return { isValid: false, isExpired: true };
  }
}

export function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  
  const tokenInfo = parseJWTToken(token);
  return tokenInfo.isValid && !tokenInfo.isExpired;
}