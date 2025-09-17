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
import { updateMenuSchema } from "../schemas";
import { Menu } from "../types";

interface EditMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FieldValues) => Promise<void>;
  loading: boolean;
  menu?: Menu | null;
}

export function EditMenu({
  open,
  onOpenChange,
  onSubmit,
  loading,
  menu,
}: EditMenuProps) {
  const handleSubmit = async (data: FieldValues) => {
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch {}
  };

  return (
    <XFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Menu"
      onSubmit={handleSubmit}
      loading={loading}
      schema={updateMenuSchema}
      defaultValues={{
        name: menu?.name || "",
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
                  <FormLabel>Menu Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter menu name" {...field} />
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
