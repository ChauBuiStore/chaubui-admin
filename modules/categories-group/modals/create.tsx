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
import { createCategoryGroupSchema } from "../schemas";

interface CreateCategoryGroupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FieldValues) => Promise<void>;
  loading: boolean;
}

export function CreateCategoryGroupModal({
  open,
  onOpenChange,
  onSubmit,
  loading,
}: CreateCategoryGroupProps) {

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
      title="Add New Category Group"
      onSubmit={handleSubmit}
      loading={loading}
      schema={createCategoryGroupSchema}
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
                  <FormLabel>Category Group Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter category group name"
                      {...field}
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