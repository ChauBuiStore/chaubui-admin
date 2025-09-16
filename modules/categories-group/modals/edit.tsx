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
import { updateCategoryGroupSchema } from "../schemas";
import { CategoryGroup } from "../types/categories-group.type";

interface EditCategoryGroupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FieldValues) => Promise<void>;
  loading: boolean;
  categoryGroup: CategoryGroup | null;
}

export function EditCategoryGroup({
  open,
  onOpenChange,
  onSubmit,
  loading,
  categoryGroup,
}: EditCategoryGroupProps) {
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
      title="Edit Category Group"
      onSubmit={handleSubmit}
      loading={loading}
      schema={updateCategoryGroupSchema}
      defaultValues={{
        name: categoryGroup?.name || "",
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
