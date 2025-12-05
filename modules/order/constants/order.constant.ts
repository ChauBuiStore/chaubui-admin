import { OrderStatus } from "../types/order.type";

export const ORDER_STATUS = {
  NEW: "NEW",
  PENDING_CONFIRMATION: "PENDING_CONFIRMATION",
  CANCELLED: "CANCELLED",
  CONFIRMED: "CONFIRMED",
  IN_PRODUCTION: "IN_PRODUCTION",
  SHIPPING: "SHIPPING",
  COMPLETED: "COMPLETED",
  CANCELLED_NO_REFUND: "CANCELLED_NO_REFUND",
  CANCELLED_PARTIAL_REFUND: "CANCELLED_PARTIAL_REFUND",
  FAILED_DELIVERY: "FAILED_DELIVERY",
} as const satisfies Record<string, OrderStatus>;

export const statusLabel: Record<OrderStatus, string> = {
  NEW: "New",
  PENDING_CONFIRMATION: "Pending confirmation",
  CANCELLED: "Cancelled",
  CONFIRMED: "Confirmed",
  IN_PRODUCTION: "In production",
  SHIPPING: "Shipping",
  COMPLETED: "Completed",
  CANCELLED_NO_REFUND: "Cancelled - No refund",
  CANCELLED_PARTIAL_REFUND: "Cancelled - Partial refund",
  FAILED_DELIVERY: "Failed delivery",
};

export const statusColor: Record<
  OrderStatus,
  "default" | "secondary" | "destructive" | "success" | "warning" | "info" | "outline"
> = {
  NEW: "info",
  PENDING_CONFIRMATION: "warning",
  CANCELLED: "destructive",
  CONFIRMED: "default",
  IN_PRODUCTION: "outline",
  SHIPPING: "secondary",
  COMPLETED: "success",
  CANCELLED_NO_REFUND: "destructive",
  CANCELLED_PARTIAL_REFUND: "destructive",
  FAILED_DELIVERY: "destructive",
};
