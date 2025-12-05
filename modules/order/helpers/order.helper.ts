import { ORDER_STATUS, statusLabel } from "../constants/order.constant";
import { OrderCancelStatusOption, OrderStatus } from "../types/order.type";

const normalFlow: OrderStatus[] = [
  ORDER_STATUS.NEW,
  ORDER_STATUS.PENDING_CONFIRMATION,
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.IN_PRODUCTION,
  ORDER_STATUS.SHIPPING,
  ORDER_STATUS.COMPLETED,
];

const cancelledFlow: OrderStatus[] = [
  ORDER_STATUS.CANCELLED,
  ORDER_STATUS.CANCELLED_NO_REFUND,
  ORDER_STATUS.CANCELLED_PARTIAL_REFUND,
];

export const allCancelStatusOptions: OrderCancelStatusOption[] = [
  {
    value: ORDER_STATUS.CANCELLED,
    label: "Cancel before confirmation",
    description: "No revenue generated",
  },
  {
    value: ORDER_STATUS.CANCELLED_NO_REFUND,
    label: "Cancel no refund",
    description: "No refund",
  },
  {
    value: ORDER_STATUS.CANCELLED_PARTIAL_REFUND,
    label: "Cancel partial refund",
    description: "Refund partial of the paid amount",
  },
];

export function getAvailableStatuses(currentStatus: OrderStatus): OrderStatus[] {
  if (cancelledFlow.includes(currentStatus)) {
    return [];
  }
  if (currentStatus === ORDER_STATUS.COMPLETED) {
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

  if (currentStatus === ORDER_STATUS.SHIPPING && currentIndex > 0) {
    availableStatuses.push(normalFlow[currentIndex - 1]);
  }

  return availableStatuses;
}

const cancelStatusMapping: Partial<Record<OrderStatus, OrderStatus[]>> = {
  [ORDER_STATUS.PENDING_CONFIRMATION]: [ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.CONFIRMED]: [
    ORDER_STATUS.CANCELLED_NO_REFUND,
    ORDER_STATUS.CANCELLED_PARTIAL_REFUND,
  ],
  [ORDER_STATUS.IN_PRODUCTION]: [
    ORDER_STATUS.CANCELLED_NO_REFUND,
    ORDER_STATUS.CANCELLED_PARTIAL_REFUND,
  ],
  [ORDER_STATUS.SHIPPING]: [ORDER_STATUS.CANCELLED_PARTIAL_REFUND],
  [ORDER_STATUS.FAILED_DELIVERY]: [
    ORDER_STATUS.CANCELLED_NO_REFUND,
    ORDER_STATUS.CANCELLED_PARTIAL_REFUND,
  ],
};

export function getCancelStatusOptions(orderStatus?: OrderStatus): OrderCancelStatusOption[] {
  if (!orderStatus) {
    return allCancelStatusOptions.filter((opt) => opt.value !== ORDER_STATUS.CANCELLED);
  }

  const allowedStatuses = cancelStatusMapping[orderStatus];
  if (allowedStatuses) {
    return allCancelStatusOptions.filter((opt) => allowedStatuses.includes(opt.value));
  }

  return allCancelStatusOptions.filter((opt) => opt.value !== ORDER_STATUS.CANCELLED);
}

export const ORDER_TABS: { key: OrderStatus; label: string }[] = [
  { key: ORDER_STATUS.NEW, label: statusLabel[ORDER_STATUS.NEW] },
  { key: ORDER_STATUS.PENDING_CONFIRMATION, label: statusLabel[ORDER_STATUS.PENDING_CONFIRMATION] },
  { key: ORDER_STATUS.CONFIRMED, label: statusLabel[ORDER_STATUS.CONFIRMED] },
  { key: ORDER_STATUS.IN_PRODUCTION, label: statusLabel[ORDER_STATUS.IN_PRODUCTION] },
  { key: ORDER_STATUS.SHIPPING, label: statusLabel[ORDER_STATUS.SHIPPING] },
  { key: ORDER_STATUS.COMPLETED, label: statusLabel[ORDER_STATUS.COMPLETED] },
  { key: ORDER_STATUS.FAILED_DELIVERY, label: statusLabel[ORDER_STATUS.FAILED_DELIVERY] },
  { key: ORDER_STATUS.CANCELLED, label: statusLabel[ORDER_STATUS.CANCELLED] },
  {
    key: ORDER_STATUS.CANCELLED_PARTIAL_REFUND,
    label: statusLabel[ORDER_STATUS.CANCELLED_PARTIAL_REFUND],
  },
  { key: ORDER_STATUS.CANCELLED_NO_REFUND, label: statusLabel[ORDER_STATUS.CANCELLED_NO_REFUND] },
];
