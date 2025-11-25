"use client";

import { Order } from "../types/order.type";
import { OrderStatusTimeline } from "./order-status-timeline";

interface OrderStatusCardProps {
  order: Order;
}

export function OrderStatusCard({ order }: OrderStatusCardProps) {
  const createdDate = new Date(order.createdAt);
  const updatedDate = new Date(order.updatedAt);
  const isCancelled = ["CANCELLED", "CANCELLED_NO_REFUND", "CANCELLED_PARTIAL_REFUND"].includes(
    order.status,
  );

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-3">
        <h3 className="text-sm font-semibold">Order Status</h3>
      </div>
      <OrderStatusTimeline
        currentStatus={order.status}
        createdAt={createdDate}
        updatedAt={updatedDate}
      />
      {isCancelled && order.reason && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground mb-2">Cancellation reason:</p>
          <p className="text-sm text-foreground bg-muted/50 rounded-md p-3">{order.reason}</p>
        </div>
      )}
    </div>
  );
}
