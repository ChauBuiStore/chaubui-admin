"use client";

import { useRef } from "react";
import { FieldValues } from "react-hook-form";

import { XDialog } from "@/components/common/x-dialog";
import XForm, { XFormField } from "@/components/common/x-form";
import { FORM_TYPES } from "@/lib/constants";

import { createCategorySchema } from "../schemas/category.schema";

interface CreateCategoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FieldValues) => Promise<void>;
  loading: boolean;
  categoryGroups?: Array<{ id: string; nameEn: string }>;
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
    await onSubmit(data);
    onOpenChange(false);
  };

  const formFields: XFormField[] = [
    {
      name: "nameVi",
      type: FORM_TYPES.INPUT,
      label: "NameVi",
      placeholder: "Enter nameVi",
      required: true,
    },
    {
      name: "nameEn",
      type: FORM_TYPES.INPUT,
      label: "NameEn",
      placeholder: "Enter nameEn",
      required: true,
    },
    {
      name: "nameKm",
      type: FORM_TYPES.INPUT,
      label: "NameKm",
      placeholder: "Enter nameKm",
      required: false,
    },
    {
      name: "groupId",
      type: FORM_TYPES.COMBOBOX,
      label: "Category Group",
      placeholder: "Search category group...",
      searchPlaceholder: "Type to search...",
      required: true,
      options: categoryGroups.map((g) => ({ value: g.id, label: g.nameEn })),
    },
  ];

  return (
    <XDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add Category"
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
        spacing="md"
      />
    </XDialog>
  );
}
