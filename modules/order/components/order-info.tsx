"use client";

import { DATE_FORMATS } from "@/lib/constants";
import { formatDate } from "@/lib/utils/date.ultis";

import { Order } from "../types/order.type";

interface OrderInfoCardProps {
  order: Order;
}

export function OrderInfoCard({ order }: OrderInfoCardProps) {
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
          <p className="font-medium">{formatDate(order.createdAt, DATE_FORMATS.DATE_TIME)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Address</p>
          <p className="font-medium line-clamp-2">{order.address}</p>
        </div>
      </div>
    </div>
  );
}
