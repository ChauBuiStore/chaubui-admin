"use client";

import { useRef } from "react";
import { FieldValues } from "react-hook-form";

import { XDialog } from "@/components/common/x-dialog";
import XForm, { XFormField } from "@/components/common/x-form";
import { FORM_TYPES } from "@/lib/constants";

import { updateCategorySchema } from "../schemas";
import { Category } from "../types/categories.type";

interface EditCategoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FieldValues) => Promise<void>;
  loading: boolean;
  categoryGroups?: Array<{ id: string; nameEn: string }>;
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
      type: FORM_TYPES.SELECT,
      label: "Category Group",
      placeholder: "Select category group",
      required: true,
      options: categoryGroups.map((g) => ({ value: g.id, label: g.nameEn })),
    },
  ];

  return (
    <XDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Category"
      onConfirm={() => formRef.current?.requestSubmit()}
      onCancel={() => onOpenChange(false)}
      confirmText="Update"
      cancelText="Cancel"
      loading={loading}
      size="md"
    >
      <XForm
        ref={formRef}
        schema={updateCategorySchema}
        fields={formFields}
        onSubmit={handleSubmit}
        loading={loading}
        spacing="md"
        onFormReady={(form) => {
          const formData = {
            nameVi: category?.nameVi || "",
            nameEn: category?.nameEn || "",
            nameKm: category?.nameKm || "",
            groupId: category?.group?.id || "",
          };
          form.reset(formData);
        }}
      />
    </XDialog>
  );
}
