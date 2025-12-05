"use client";

import React from "react";

import { XBadge } from "@/components/common";
import { DATE_FORMATS } from "@/lib/constants";
import { formatDate } from "@/lib/utils/date.ultis";

import { statusColor, statusLabel } from "../constants/order.constant";
import { Order } from "../types/order.type";
import { OrderStatusHistoryItem } from "./order-status-history-item";

interface OrderStatusHistoryProps {
  order: Order;
}

export function OrderStatusHistory({ order }: OrderStatusHistoryProps) {
  return (
    <div className="rounded-lg border bg-card p-5 space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">Order Status</h3>
        <div className="flex items-center gap-3">
          <XBadge variant={statusColor[order.status]}>{statusLabel[order.status]}</XBadge>
          <span className="text-xs text-muted-foreground">
            Last updated: {formatDate(order.updatedAt, DATE_FORMATS.DATE_SLASH_TIME)}
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Status Change History</h3>
        {!order.statusHistory?.length ? (
          <div className="text-sm text-muted-foreground py-4 text-center border rounded-md bg-muted/30">
            No status change history
          </div>
        ) : (
          <div className="space-y-4">
            {order.statusHistory?.map((history, index) => (
              <OrderStatusHistoryItem
                key={history.id}
                history={history}
                isLast={index === (order.statusHistory?.length ?? 0) - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
