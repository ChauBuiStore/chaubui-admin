"use client";

import { Order } from "../types/order.type";
import { OrderItemCard } from "./order-item";

interface OrderItemsListProps {
  items: Order["items"];
}

export function OrderItemsList({ items }: OrderItemsListProps) {
  const totalQuantity = items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold">Product ({items?.length || 0})</h3>
        <h3 className="text-base font-semibold">Quantity ({totalQuantity})</h3>
      </div>
      <div className="max-h-[400px] overflow-y-auto overflow-x-hidden">
        <div className="space-y-2">
          {items?.map((item) => (
            <OrderItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </>
  );
}
