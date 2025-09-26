"use client";

import { XDialog } from "@/components/common/x-dialog";
import XForm, { XFormField } from "@/components/common/x-form";
import { FORM_TYPES } from "@/lib/constants";
import { useRef } from "react";
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
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = async (data: FieldValues) => {
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch {
    }
  };

  const formFields: XFormField[] = [
    {
      name: "name",
      type: FORM_TYPES.INPUT,
      label: "Category Group Name",
      placeholder: "Enter category group name",
      required: true,
    },
  ];

  return (
    <XDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Category Group"
      onConfirm={() => formRef.current?.requestSubmit()}
      onCancel={() => onOpenChange(false)}
      confirmText="Update"
      cancelText="Cancel"
      loading={loading}
      size="md"
    >
      <XForm
        ref={formRef}
        schema={updateCategoryGroupSchema}
        fields={formFields}
        onSubmit={handleSubmit}
        loading={loading}
        onSuccess={() => onOpenChange(false)}
        spacing="md"
        onFormReady={(form) => {
          form.reset({
            name: categoryGroup?.name || "",
          });
        }}
      />
    </XDialog>
  );
}
