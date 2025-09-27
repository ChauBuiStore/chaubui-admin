"use client";

import { XDialog } from "@/components/common/x-dialog";
import XForm, { XFormField } from "@/components/common/x-form";
import { FORM_TYPES } from "@/lib/constants";
import { useRef } from "react";
import { FieldValues } from "react-hook-form";
import { createCategorySchema } from "../schemas";

interface CreateCategoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FieldValues) => Promise<void>;
  loading: boolean;
  categoryGroups?: Array<{ id: string; name: string }>;
}

export function CreateCategory({
  open,
  onOpenChange,
  onSubmit,
  loading,
  categoryGroups = [],
}: CreateCategoryProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = async (data: FieldValues) => {
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch { }
  };

  const formFields: XFormField[] = [
    {
      name: "name",
      type: FORM_TYPES.INPUT,
      label: "Category Name",
      placeholder: "Enter category name",
      required: true,
    },
    {
      name: "groupId",
      type: FORM_TYPES.SELECT,
      label: "Category Group",
      placeholder: "Select category group",
      required: true,
      options: categoryGroups.map((g) => ({ value: g.id, label: g.name })),
    },
  ];

  return (
    <XDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Sub Category"
      onConfirm={() => formRef.current?.requestSubmit()}
      onCancel={() => onOpenChange(false)}
      confirmText="Add"
      cancelText="Cancel"
      loading={loading}
      size="md"
    >
      <XForm
        ref={formRef}
        schema={createCategorySchema}
        fields={formFields}
        onSubmit={handleSubmit}
        loading={loading}
        onSuccess={() => onOpenChange(false)}
        spacing="md"
      />
    </XDialog>
  );
}
