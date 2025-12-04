import { OrderStatus } from "../types/order.type";

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
