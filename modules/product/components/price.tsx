"use client";

import { formatPrice } from "@/lib/utils/currency.utils";
import { Product } from "@/modules/product/types";

interface PriceProps {
  product: Product;
}

export function Price({ product }: PriceProps) {
  const displayPrice =
    product.variants && product.variants.length > 0
      ? product.variants[0].salePrice || product.variants[0].originalPrice
      : product.salePrice;

  const displayOriginalPrice =
    product.variants && product.variants.length > 0
      ? product.variants[0].originalPrice
      : product.originalPrice;

  const displayDiscountPercent =
    product.variants && product.variants.length > 0
      ? product.variants[0].discountPercent || 0
      : product.discountPercent;

  const hasDiscount = displayDiscountPercent > 0;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className={`font-bold ${hasDiscount ? "text-primary" : ""}`}>
          {formatPrice(displayPrice)}
        </span>
        {hasDiscount && (
          <span className="px-1.5 py-0.5 bg-destructive/10 text-destructive text-xs rounded font-medium">
            -{displayDiscountPercent}%
          </span>
        )}
      </div>
      {hasDiscount && (
        <span className="text-xs text-muted-foreground line-through">
          {formatPrice(displayOriginalPrice)}
        </span>
      )}
    </div>
  );
}
