import { z } from "zod";

import { getCancelStatusOptions } from "../helpers/order.helper";
import { OrderStatus } from "../types/order.type";

const REASON_FIELD = z.string().min(1, "Please enter cancellation reason");
const STATUS_ERROR_MESSAGE = "Please select a cancel status";

function createStatusSchema(allowedStatuses: OrderStatus[]) {
  if (allowedStatuses.length === 1) {
    return z.literal(allowedStatuses[0], {
      message: STATUS_ERROR_MESSAGE,
    });
  }

  return z.enum(allowedStatuses as [OrderStatus, OrderStatus, ...OrderStatus[]], {
    message: STATUS_ERROR_MESSAGE,
  });
}

export const createCancelOrderSchema = (orderStatus?: OrderStatus) => {
  const cancelStatusOptions = getCancelStatusOptions(orderStatus);
  const allowedStatuses = cancelStatusOptions.map((opt) => opt.value);

  return z.object({
    status: createStatusSchema(allowedStatuses),
    reason: REASON_FIELD,
  });
};
