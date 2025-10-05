"use client";

import { CheckCircle, XCircle } from "lucide-react";

import { XBadge } from "@/components/common";
import { Product } from "@/modules/product/types";

interface StockStatusProps {
  product: Product;
}

export function StockStatus({ product }: StockStatusProps) {
  const totalStock =
    product.variants && product.variants.length > 0
      ? product.variants.reduce((sum, variant) => sum + variant.stock, 0)
      : product.stock || 0;

  const isInStock = totalStock > 0;

  return (
    <div className="flex justify-center">
      <XBadge
        variant={isInStock ? "default" : "destructive"}
        className={`flex items-center gap-1.5 px-2 py-1 text-xs font-medium ${
          isInStock
            ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
            : "bg-red-100 text-red-700 border-red-200 hover:bg-red-200"
        }`}
      >
        {isInStock ? (
          <>
            <CheckCircle className="w-3 h-3" />
            <span>Còn hàng</span>
          </>
        ) : (
          <>
            <XCircle className="w-3 h-3" />
            <span>Hết hàng</span>
          </>
        )}
      </XBadge>
    </div>
  );
}
