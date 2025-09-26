"use client";

import { Product } from "@/modules/product/types";

interface SizeProps {
  product: Product;
}

export function Size({ product }: SizeProps) {
  const variantSizes =
    product.variants?.map((variant) => variant.size).filter(Boolean) || [];

  const uniqueSizes = variantSizes.filter(
    (size, index, self) =>
      index === self.findIndex((s) => s?.id === size?.id)
  );

  if (uniqueSizes.length === 0) {
    return <span className="text-muted-foreground text-sm">-</span>;
  }

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {uniqueSizes.slice(0, 4).map((size, index) => 
        size ? (
          <span
            key={size.id || index}
            className="px-2 py-1 bg-muted text-foreground/80 text-xs rounded-full border"
            title={size.description || size.name}
          >
            {size.name}
          </span>
        ) : null
      )}
      {uniqueSizes.length > 4 && (
        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full border">
          +{uniqueSizes.length - 4}
        </span>
      )}
    </div>
  );
}
