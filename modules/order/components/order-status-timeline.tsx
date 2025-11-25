"use client";

import { CheckCircle2, Clock, Package, ShoppingCart, Truck, XCircle } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

import { getStatusIndex } from "../helpers/order.helper";
import { OrderStatus } from "../types/order.type";

const statusTimeline: {
  status: OrderStatus;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    status: "NEW",
    label: "New",
    icon: <ShoppingCart className="h-4 w-4" />,
  },
  {
    status: "PENDING_CONFIRMATION",
    label: "Pending confirmation",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    status: "CONFIRMED",
    label: "Confirmed",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  {
    status: "IN_PRODUCTION",
    label: "In production",
    icon: <Package className="h-4 w-4" />,
  },
  {
    status: "SHIPPING",
    label: "Shipping",
    icon: <Truck className="h-4 w-4" />,
  },
  {
    status: "COMPLETED",
    label: "Completed",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  {
    status: "CANCELLED",
    label: "Cancelled",
    icon: <XCircle className="h-4 w-4" />,
  },
  {
    status: "CANCELLED_NO_REFUND",
    label: "Cancelled - No refund",
    icon: <XCircle className="h-4 w-4" />,
  },
  {
    status: "CANCELLED_PARTIAL_REFUND",
    label: "Cancelled - Partial refund",
    icon: <XCircle className="h-4 w-4" />,
  },
];

interface OrderStatusTimelineProps {
  currentStatus: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export function OrderStatusTimeline({
  currentStatus,
  createdAt,
  updatedAt,
}: OrderStatusTimelineProps) {
  const normalFlow = [
    "NEW",
    "PENDING_CONFIRMATION",
    "CONFIRMED",
    "IN_PRODUCTION",
    "SHIPPING",
    "COMPLETED",
  ];
  const isCancelled = ["CANCELLED", "CANCELLED_NO_REFUND", "CANCELLED_PARTIAL_REFUND"].includes(
    currentStatus,
  );

  const currentIndex = getStatusIndex(currentStatus);
  const timelineItems = isCancelled
    ? statusTimeline.filter((item) =>
        ["NEW", "PENDING_CONFIRMATION", currentStatus].includes(item.status),
      )
    : statusTimeline.filter((item) => normalFlow.includes(item.status));

  const formatDateTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative w-full overflow-x-auto py-4">
      <div className="relative flex items-start justify-between w-full px-4">
        <div className="absolute top-[12px] left-4 right-4 h-0.5 bg-muted" />
        {timelineItems.map((item, index) => {
          const itemIndex = getStatusIndex(item.status);
          const isActive = itemIndex <= currentIndex;
          const isCurrent = item.status === currentStatus;
          const isNew = item.status === "NEW";

          const prevItem = index > 0 ? timelineItems[index - 1] : null;
          const prevItemIndex = prevItem ? getStatusIndex(prevItem.status) : null;
          const isPrevActive = prevItemIndex !== null && prevItemIndex <= currentIndex;

          const nextItem = timelineItems[index + 1];
          const nextItemIndex = nextItem ? getStatusIndex(nextItem.status) : null;
          const isNextActive = nextItemIndex !== null && nextItemIndex <= currentIndex;

          const isLeftLineActive = index > 0 && isPrevActive && isActive;
          const isRightLineActive = index < timelineItems.length - 1 && isActive && isNextActive;

          const displayDate = isNew ? createdAt : isCurrent ? updatedAt : null;

          return (
            <div
              key={item.status}
              className="relative z-10 flex flex-col items-center gap-2 flex-1 max-w-[140px]"
            >
              {index > 0 && (
                <div
                  className={cn(
                    "absolute top-[12px] h-0.5 transition-colors z-0",
                    isLeftLineActive ? "bg-primary" : "bg-transparent",
                    "right-1/2 w-1/2",
                  )}
                />
              )}
              {index < timelineItems.length - 1 && (
                <div
                  className={cn(
                    "absolute top-[12px] h-0.5 transition-colors z-0",
                    isRightLineActive ? "bg-primary" : "bg-transparent",
                    "left-1/2 w-1/2",
                  )}
                />
              )}

              <div
                className={cn(
                  "relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors shrink-0",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted bg-background text-muted-foreground",
                  isCurrent && "ring-2 ring-primary ring-offset-2",
                )}
              >
                {React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, {
                  className: "h-3 w-3",
                })}
              </div>

              <div className="flex flex-col items-center gap-1 text-center w-full">
                <span
                  className={cn(
                    "text-xs font-medium text-center break-words",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </span>
                {displayDate && (
                  <span className="text-xs text-muted-foreground text-center mt-1 break-words">
                    {formatDateTime(displayDate)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
