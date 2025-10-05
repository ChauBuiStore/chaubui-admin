"use client";

import { Product } from "@/modules/product/types";

interface ColorProps {
  product: Product;
}

export function Color({ product }: ColorProps) {
  const variantColors = product.variants?.map((variant) => variant.color).filter(Boolean) || [];

  const uniqueColors = variantColors.filter(
    (color, index, self) => index === self.findIndex((c) => c?.id === color?.id),
  );

  if (uniqueColors.length === 0) {
    return <span className="text-muted-foreground text-sm">-</span>;
  }

  return (
    <div className="flex items-center">
      <div className="flex items-center">
        {uniqueColors.slice(0, 2).map((color, index) =>
          color ? (
            <div
              key={color.id || index}
              className="w-5 h-5 rounded-full border-2 border-white shadow-sm relative z-10"
              style={{
                backgroundColor: color.code,
                marginLeft: index > 0 ? "-4px" : "0",
                zIndex: 10 - index,
              }}
            />
          ) : null,
        )}
        {uniqueColors.length > 2 && (
          <div
            className="w-5 h-5 rounded-full border-2 border-white shadow-sm bg-muted flex items-center justify-center relative z-0"
            style={{ marginLeft: "-4px" }}
          >
            <span className="text-xs font-medium text-muted-foreground">
              +{uniqueColors.length - 2}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
