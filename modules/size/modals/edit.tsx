"use client";

import { XFormDialog } from "@/components/common";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input
} from "@/components/ui";
import { FieldValues } from "react-hook-form";
import { updateSizeSchema } from "../schemas";
import { Size } from "../types";

interface EditSizeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FieldValues) => Promise<void>;
  loading: boolean;
  size?: Size | null;
}

export function EditSize({
  open,
  onOpenChange,
  onSubmit,
  loading,
  size,
}: EditSizeProps) {
  const handleSubmit = async (data: FieldValues) => {
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch { }
  };

  return (
    <XFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Size"
      onSubmit={handleSubmit}
      loading={loading}
      schema={updateSizeSchema}
      defaultValues={{
        name: size?.name || "",
      }}
      saveText="Update"
      onCancel={() => onOpenChange(false)}
    >
      {(form) => {
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter size name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      }}
    </XFormDialog>
  );
}
