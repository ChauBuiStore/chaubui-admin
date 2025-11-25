"use client";

import { Order } from "../types/order.type";

interface OrderInfoCardProps {
  order: Order;
}

export function OrderInfoCard({ order }: OrderInfoCardProps) {
  const createdDate = new Date(order.createdAt);

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Order ID</p>
          <p className="font-medium">{order.orderId}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Customer</p>
          <p className="font-medium truncate">{order.fullName}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Phone</p>
          <p className="font-medium">{order.phone}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Email</p>
          <p className="font-medium truncate">{order.email}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Created Date</p>
          <p className="font-medium">
            {createdDate.toLocaleString("en-US", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Address</p>
          <p className="font-medium line-clamp-2">{order.address}</p>
        </div>
      </div>
    </div>
  );
}
