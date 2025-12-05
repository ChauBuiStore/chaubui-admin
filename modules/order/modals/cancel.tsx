import { XFormDialog, XRadioGroup, XTextarea } from "@/components/common";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui";

import { getCancelStatusOptions } from "../helpers/order.helper";
import { createCancelOrderSchema } from "../schemas/order.schema";
import { Order, OrderStatus } from "../types/order.type";

type CancelForm = {
  status: OrderStatus;
  reason: string;
};

interface CancelOrderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: CancelForm) => Promise<void>;
  loading?: boolean;
  order?: Order;
}

export function CancelOrder({ open, onOpenChange, onSubmit, loading, order }: CancelOrderProps) {
  const orderStatus = order?.status;
  const schema = createCancelOrderSchema(orderStatus);
  const cancelStatusOptions = getCancelStatusOptions(orderStatus);

  return (
    <XFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Cancel Order #${order?.orderId}`}
      description="Please select cancellation type and enter a reason."
      schema={schema}
      defaultValues={{ status: undefined, reason: "" }}
      onSubmit={onSubmit}
      saveText="Confirm"
      cancelText="Close"
      loading={loading}
      size="lg"
    >
      {(form) => (
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <XRadioGroup
                label="Cancellation Type"
                options={cancelStatusOptions}
                value={field.value}
                onValueChange={field.onChange}
                orientation="vertical"
                required
                error={form.formState.errors.status?.message as string | undefined}
              />
            )}
          />

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Cancellation Reason</FormLabel>
                <FormControl>
                  <XTextarea rows={5} placeholder="Enter cancellation reason..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </XFormDialog>
  );
}
