export type CurrencyType = "VND" | "USD";

export interface CurrencyConfig {
  locale: string;
  currency: string;
  minimumFractionDigits: number;
  maximumFractionDigits: number;
  customSymbol?: string;
}

export const CURRENCY_CONFIGS: Record<CurrencyType, CurrencyConfig> = {
  VND: {
    locale: "vi-VN",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    customSymbol: "₫",
  },
  USD: {
    locale: "en-US",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  },
};

export function formatPrice(
  price: string | number | null | undefined,
  currency: CurrencyType = "VND",
): string {
  if (price === null || price === undefined || price === "") {
    return currency === "VND" ? "0 ₫" : `0 ${getCurrencySymbol(currency)}`;
  }

  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(numericPrice)) {
    return currency === "VND" ? "0 ₫" : `0 ${getCurrencySymbol(currency)}`;
  }

  const config = CURRENCY_CONFIGS[currency];

  if (currency === "VND") {
    const formatted = new Intl.NumberFormat(config.locale, {
      style: "decimal",
      minimumFractionDigits: config.minimumFractionDigits,
      maximumFractionDigits: config.maximumFractionDigits,
    }).format(numericPrice);
    return `${formatted} ${config.customSymbol}`;
  }

  const formatted = new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.currency,
    minimumFractionDigits: config.minimumFractionDigits,
    maximumFractionDigits: config.maximumFractionDigits,
  }).format(numericPrice);

  return formatted;
}

function getCurrencySymbol(currency: CurrencyType): string {
  const config = CURRENCY_CONFIGS[currency];
  if (config.customSymbol) {
    return config.customSymbol;
  }

  const formatter = new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.currency,
  });
  return formatter.formatToParts(0).find((part) => part.type === "currency")?.value || "$";
}

export const formatVND = (price: string | number | null | undefined) => formatPrice(price, "VND");
export const formatUSD = (price: string | number | null | undefined) => formatPrice(price, "USD");
