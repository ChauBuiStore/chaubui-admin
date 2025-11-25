import { OrderStatus } from "../types/order.type";

const normalFlow: OrderStatus[] = [
  "NEW",
  "PENDING_CONFIRMATION",
  "CONFIRMED",
  "IN_PRODUCTION",
  "SHIPPING",
  "COMPLETED",
];

const cancelledFlow: OrderStatus[] = [
  "CANCELLED",
  "CANCELLED_NO_REFUND",
  "CANCELLED_PARTIAL_REFUND",
];

export function getStatusIndex(status: OrderStatus): number {
  if (normalFlow.includes(status)) {
    return normalFlow.indexOf(status);
  }
  if (cancelledFlow.includes(status)) {
    return cancelledFlow.indexOf(status) + 100;
  }
  return 0;
}

export function getNextStatus(currentStatus: OrderStatus): OrderStatus | null {
  if (cancelledFlow.includes(currentStatus)) {
    return null;
  }
  if (currentStatus === "COMPLETED") {
    return null;
  }

  const currentIndex = normalFlow.indexOf(currentStatus);
  if (currentIndex === -1 || currentIndex === normalFlow.length - 1) {
    return null;
  }

  return normalFlow[currentIndex + 1];
}
