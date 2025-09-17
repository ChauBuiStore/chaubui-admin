"use client";

import { XFormDialog } from "@/components/common/x-dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldValues } from "react-hook-form";
import { updateColorSchema } from "../schemas";
import { Color } from "../types/color.type";
import { XColorPicker } from "@/components/common";

interface EditColorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FieldValues) => Promise<void>;
  loading: boolean;
  color?: Color | null;
}

export function EditColor({
  open,
  onOpenChange,
  onSubmit,
  loading,
  color,
}: EditColorProps) {

  const handleSubmit = async (data: FieldValues) => {
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch {
    }
  };

  return (
    <XFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Color"
      onSubmit={handleSubmit}
      loading={loading}
      schema={updateColorSchema}
      defaultValues={{
        name: color?.name || "",
        code: color?.code || "",
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
                  <FormLabel>Color Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter color name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color Code *</FormLabel>
                  <FormControl>
                    <XColorPicker
                      value={field.value}
                      onChange={(color) => field.onChange(color)}
                    />
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
