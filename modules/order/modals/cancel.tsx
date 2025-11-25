import { z } from "zod";

import { XFormDialog, XRadioGroup, XTextarea } from "@/components/common";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui";

import { Order, OrderStatus } from "../types/order.type";

const schema = z.object({
  status: z.enum(["CANCELLED", "CANCELLED_NO_REFUND", "CANCELLED_PARTIAL_REFUND"], {
    message: "Please select a cancel status",
  }),
  reason: z.string().min(1, "Please enter cancellation reason"),
});
type CancelForm = z.infer<typeof schema>;

const cancelStatusOptions = [
  {
    value: "CANCELLED" as OrderStatus,
    label: "Cancel before confirmation",
    description: "No revenue generated",
  },
  {
    value: "CANCELLED_NO_REFUND" as OrderStatus,
    label: "Cancel without refund",
    description: "Keep deposit",
  },
  {
    value: "CANCELLED_PARTIAL_REFUND" as OrderStatus,
    label: "Partial refund",
    description: "Refund part of the paid amount",
  },
];

interface CancelOrderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: CancelForm) => Promise<void>;
  loading?: boolean;
  order?: Order;
}

export function CancelOrder({ open, onOpenChange, onSubmit, loading, order }: CancelOrderProps) {
  return (
    <XFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Cancel Order #${order?.orderId}`}
      description="Please select cancellation type and enter a reason."
      schema={schema}
      defaultValues={{ status: undefined, reason: "" }}
      onSubmit={onSubmit}
      saveText="Confirm Cancel"
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
