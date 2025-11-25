"use client";

import { ArrowRight, Clock, User } from "lucide-react";
import React from "react";

import { XBadge } from "@/components/common";
import { DATE_FORMATS } from "@/lib/constants";
import { formatDate } from "@/lib/utils/date.ultis";

import { statusColor, statusLabel } from "../constants/order.constant";
import { Order, OrderStatusHistory } from "../types/order.type";

interface OrderStatusExampleProps {
  order: Order;
}

export function OrderStatusExample({ order }: OrderStatusExampleProps) {
  const formatDateTime = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return formatDate(dateObj, DATE_FORMATS.DATE_SLASH_TIME);
  };

  return (
    <div className="rounded-lg border bg-card p-5 space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">Order Status</h3>
        <div className="flex items-center gap-3">
          <XBadge variant={statusColor[order.status]}>{statusLabel[order.status]}</XBadge>
          <span className="text-xs text-muted-foreground">
            Last updated: {formatDateTime(order.updatedAt)}
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
                formatDateTime={formatDateTime}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface OrderStatusHistoryItemProps {
  history: OrderStatusHistory;
  isLast: boolean;
  formatDateTime: (date: Date | string) => string;
}

function OrderStatusHistoryItem({ history, isLast, formatDateTime }: OrderStatusHistoryItemProps) {
  return (
    <div className="relative">
      {!isLast && <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-border" />}

      <div className="flex gap-4">
        <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-background border-primary shrink-0">
          <div className="h-2 w-2 rounded-full bg-primary" />
        </div>

        <div className="flex-1 pb-4 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <XBadge variant={statusColor[history.fromStatus]} className="text-xs">
              {statusLabel[history.fromStatus]}
            </XBadge>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <XBadge variant={statusColor[history.toStatus]} className="text-xs">
              {statusLabel[history.toStatus]}
            </XBadge>
          </div>

          {history.reason && (
            <div className="text-sm text-foreground bg-muted/50 rounded-md p-3">
              <p className="font-medium mb-1">Reason:</p>
              <p className="text-muted-foreground">{history.reason}</p>
            </div>
          )}

          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatDateTime(history.changedAt)}</span>
            </div>
            {history.changedBy && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>
                  {history.changedBy.fullName ||
                    history.changedBy.userName ||
                    history.changedBy.email ||
                    "Unknown"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
