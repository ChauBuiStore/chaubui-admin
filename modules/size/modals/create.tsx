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
import { createSizeSchema } from "../schemas";

interface CreateSizeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FieldValues) => Promise<void>;
  loading: boolean;
}

export function CreateSize({
  open,
  onOpenChange,
  onSubmit,
  loading,
}: CreateSizeProps) {
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
      title="Add New Size"
      onSubmit={handleSubmit}
      loading={loading}
      schema={createSizeSchema}
      defaultValues={{
        name: "",
      }}
      saveText="Add"
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
