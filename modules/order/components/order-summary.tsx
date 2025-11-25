"use client";

import { formatVND } from "@/lib/utils/currency.utils";

import { Order } from "../types/order.type";

interface OrderSummaryProps {
  order: Order;
}

export function OrderSummary({ order }: OrderSummaryProps) {
  const remainingAmount = order.totalAmount - (order.paidAmount || 0) - (order.refundAmount || 0);

  return (
    <div className="mt-3 pt-3 border-t space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Total Amount</span>
        <span className="text-sm font-semibold">{formatVND(order.totalAmount)}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Paid Amount</span>
        <span className="text-sm font-medium text-green-600">
          {formatVND(order.paidAmount || 0)}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Refund Amount</span>
        <span className="text-sm font-medium text-red-600">
          {formatVND(order.refundAmount || 0)}
        </span>
      </div>
      <div className="flex justify-between items-center pt-2 border-t">
        <span className="text-sm font-semibold">Remaining</span>
        <span className="text-lg font-bold text-primary">{formatVND(remainingAmount)}</span>
      </div>
    </div>
  );
}
