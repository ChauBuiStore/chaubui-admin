"use client";

import { Product } from "@/modules/product/types";

interface SizeProps {
  product: Product;
}

export function Size({ product }: SizeProps) {
  const variantSizes = product.variants?.map((variant) => variant.size).filter(Boolean) || [];

  const uniqueSizes = variantSizes.filter(
    (size, index, self) => index === self.findIndex((s) => s?.id === size?.id),
  );

  if (uniqueSizes.length === 0) {
    return <span className="text-muted-foreground text-sm">-</span>;
  }

  return (
    <div className="flex items-center">
      <div className="flex items-center">
        {uniqueSizes.slice(0, 2).map((size, index) =>
          size ? (
            <span
              key={size.id || index}
              className="px-1.5 py-0.5 bg-muted text-foreground/80 text-xs rounded-full border relative z-10 whitespace-nowrap"
              style={{
                marginLeft: index > 0 ? "-6px" : "0",
                zIndex: 10 - index,
              }}
            >
              {size.nameVi || size.nameEn || size.nameKm}
            </span>
          ) : null,
        )}
        {uniqueSizes.length > 2 && (
          <span
            className="px-1.5 py-0.5 bg-muted text-muted-foreground text-xs rounded-full border relative z-0"
            style={{ marginLeft: "-6px" }}
          >
            +{uniqueSizes.length - 2}
          </span>
        )}
      </div>
    </div>
  );
}
