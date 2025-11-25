"use client";

import { formatPrice } from "@/lib/utils/currency.utils";
import { Product } from "@/modules/product/types";

interface PriceProps {
  product: Product;
}

export function Price({ product }: PriceProps) {
  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;

  let displayPrice = product.salePrice;

  let rangeMin: number | null = null;
  let rangeMax: number | null = null;

  if (hasVariants) {
    const raw = product.variants.map((v) => {
      const saleNum = v.salePrice !== undefined && v.salePrice !== null ? Number(v.salePrice) : NaN;
      const origNum =
        v.originalPrice !== undefined && v.originalPrice !== null ? Number(v.originalPrice) : NaN;
      if (!Number.isNaN(saleNum) && saleNum > 0) return saleNum;
      if (!Number.isNaN(origNum) && origNum > 0) return origNum;
      return NaN;
    });

    const valid = raw.filter((n) => !Number.isNaN(n));
    if (valid.length > 0) {
      rangeMin = Math.min(...valid);
      rangeMax = Math.max(...valid);
    } else {
      const fallback = product.variants
        .map((v) => Number(v.salePrice ?? v.originalPrice))
        .filter((n) => !Number.isNaN(n));
      if (fallback.length > 0) {
        rangeMin = Math.min(...fallback);
        rangeMax = Math.max(...fallback);
      } else {
        rangeMin = 0;
        rangeMax = 0;
      }
    }
  } else {
    displayPrice = product.salePrice ?? product.originalPrice ?? 0;
  }

  return (
    <div className="flex flex-col gap-1">
      {hasVariants ? (
        <div className="flex items-center gap-2">
          <span className="font-bold">
            {formatPrice(rangeMin || 0)} ~ {formatPrice(rangeMax || 0)}
          </span>
        </div>
      ) : (
        <span className="font-bold">{formatPrice(displayPrice)}</span>
      )}
    </div>
  );
}
