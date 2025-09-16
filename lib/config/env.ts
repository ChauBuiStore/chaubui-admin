export const serverEnv = {
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:4200',
} as const;

export const clientEnv = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4200',
} as const;

export const isClient = typeof window !== 'undefined';
export const isServer = typeof window === 'undefined';

export const env = isClient ? clientEnv : serverEnv;

export default env;
