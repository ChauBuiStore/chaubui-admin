"use client";

import { Package } from "lucide-react";
import Image from "next/image";

import { formatVND } from "@/lib/utils/currency.utils";

import { OrderItem } from "../types/order.type";

interface OrderItemCardProps {
  item: OrderItem;
}

export function OrderItemCard({ item }: OrderItemCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-background p-3 hover:bg-accent/50 transition-colors">
      <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted shrink-0">
        {item.product?.thumbnailUrl ? (
          <Image
            alt={item.product.nameVi}
            src={item.product.thumbnailUrl}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
            <Package className="h-6 w-6" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm mb-1 truncate">{item.product.nameVi}</h4>
        {(item.variant?.color?.nameVi || item.variant?.size?.nameVi) && (
          <div className="text-xs text-muted-foreground">
            {item.variant?.color?.nameVi && <span>Color: {item.variant.color.nameVi}</span>}
            {item.variant?.color?.nameVi && item.variant?.size?.nameVi && (
              <span className="mx-1">•</span>
            )}
            {item.variant?.size?.nameVi && <span>Size: {item.variant.size.nameVi}</span>}
          </div>
        )}
        <div className="text-xs text-muted-foreground mt-1">
          Qty: <span className="font-medium text-foreground">{item.quantity}</span> ×{" "}
          <span className="font-medium">{formatVND(item.unitPrice)}</span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-sm font-semibold text-primary">{formatVND(item.subtotal)}</div>
      </div>
    </div>
  );
}
