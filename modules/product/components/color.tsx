"use client";

import { Product } from "@/modules/product/types";

interface ColorProps {
  product: Product;
}

export function Color({ product }: ColorProps) {
  const variantColors =
    product.variants?.map((variant) => variant.color).filter(Boolean) || [];

  const uniqueColors = variantColors.filter(
    (color, index, self) =>
      index === self.findIndex((c) => c?.id === color?.id)
  );

  if (uniqueColors.length === 0) {
    return <span className="text-muted-foreground text-sm">-</span>;
  }

  return (
    <div className="flex items-center gap-1">
      {uniqueColors.slice(0, 6).map((color, index) => 
        color ? (
          <div
            key={color.id || index}
            className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: color.code }}
            title={`${color.name} (${color.code})`}
          />
        ) : null
      )}
      {uniqueColors.length > 6 && (
        <div className="flex items-center">
          <div className="w-5 h-5 rounded-full border-2 border-card shadow-sm bg-muted flex items-center justify-center">
            <span className="text-xs font-medium text-muted-foreground">
              +{uniqueColors.length - 6}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
