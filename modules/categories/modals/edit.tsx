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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui";
import { FieldValues } from "react-hook-form";
import { updateCategorySchema } from "../schemas";
import { Category } from "../types/categories.type";

interface EditCategoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FieldValues) => Promise<void>;
  loading: boolean;
  categoryGroups?: Array<{ id: string; name: string }>;
  category?: Category | null;
}

export function EditCategory({
  open,
  onOpenChange,
  onSubmit,
  loading,
  categoryGroups = [],
  category,
}: EditCategoryProps) {

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
      title="Edit Category"
      onSubmit={handleSubmit}
      loading={loading}
      schema={updateCategorySchema}
      defaultValues={{
        name: category?.name || "",
        description: category?.description || "",
        groupId: category?.group?.id || "",
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
                  <FormLabel>Category Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter category name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter category description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="groupId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Group *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoryGroups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
