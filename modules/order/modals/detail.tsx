"use client";

import React, { useState } from "react";

import { XButton, XDialog, XScrollArea, XTextarea } from "@/components/common";

import { OrderInfoCard } from "../components/order-info";
import { OrderItemsList } from "../components/order-items-list";
import { OrderStatusHistory } from "../components/order-status-history";
import { OrderSummary } from "../components/order-summary";
import { statusLabel } from "../constants/order.constant";
import { getAvailableStatuses } from "../helpers/order.helper";
import { Order, OrderStatus } from "../types/order.type";

interface OrderDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: Order;
  loading?: boolean;
  onSubmitChangeStatus?: (data: { status: OrderStatus; reason?: string }) => Promise<void>;
}

export function OrderDetail({
  open,
  onOpenChange,
  order,
  loading = false,
  onSubmitChangeStatus,
}: OrderDetailProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableStatuses = order ? getAvailableStatuses(order.status) : [];
  const sortedStatuses = [...availableStatuses].sort((a, b) => {
    if (a === "IN_PRODUCTION" && b === "COMPLETED") return -1;
    if (a === "COMPLETED" && b === "IN_PRODUCTION") return 1;
    return 0;
  });
  const canChangeStatus = sortedStatuses.length > 0;

  const handleChangeStatus = async (status: OrderStatus) => {
    if (!onSubmitChangeStatus) return;

    setIsSubmitting(true);
    try {
      await onSubmitChangeStatus({
        status,
        reason: reason.trim() || undefined,
      });
      setReason("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <XDialog
      open={open}
      onOpenChange={onOpenChange}
      title={order ? `Order Details #${order.orderId}` : "Order Details"}
      showFooter={canChangeStatus}
      customFooter={
        canChangeStatus ? (
          <div className="flex flex-col gap-2 w-full">
            <XTextarea
              placeholder="Reason (optional)"
              value={reason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
              disabled={isSubmitting}
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <XButton
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Close
              </XButton>
              {sortedStatuses.map((status) => (
                <XButton
                  key={status}
                  onClick={() => handleChangeStatus(status)}
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  {statusLabel[status]}
                </XButton>
              ))}
            </div>
          </div>
        ) : undefined
      }
      size="4xl"
    >
      <XScrollArea className="h-[calc(100vh-300px)]" orientation="vertical" showScrollbar={true}>
        {loading && !order ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        ) : !order ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-sm text-muted-foreground">No data</div>
          </div>
        ) : (
          <div className="space-y-4 pr-2">
            <OrderInfoCard order={order} />

            <div className="rounded-lg border bg-card p-5">
              <OrderItemsList items={order.items} />
              <OrderSummary order={order} />
            </div>
            <OrderStatusHistory order={order} />
          </div>
        )}
      </XScrollArea>
    </XDialog>
  );
}
