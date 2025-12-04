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
  "FAILED_DELIVERY" as OrderStatus,
];

export function getAvailableStatuses(currentStatus: OrderStatus): OrderStatus[] {
  if (cancelledFlow.includes(currentStatus)) {
    return [];
  }
  if (currentStatus === "COMPLETED") {
    return [];
  }

  const currentIndex = normalFlow.indexOf(currentStatus);
  if (currentIndex === -1) {
    return [];
  }

  const availableStatuses: OrderStatus[] = [];

  if (currentIndex < normalFlow.length - 1) {
    availableStatuses.push(normalFlow[currentIndex + 1]);
  }

  if (currentStatus === "SHIPPING" && currentIndex > 0) {
    availableStatuses.push(normalFlow[currentIndex - 1]);
  }

  return availableStatuses;
}
