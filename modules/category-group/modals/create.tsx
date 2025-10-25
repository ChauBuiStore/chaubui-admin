"use client";

import { useRef } from "react";
import { FieldValues } from "react-hook-form";

import { XDialog } from "@/components/common/x-dialog";
import XForm, { XFormField } from "@/components/common/x-form";
import { FORM_TYPES } from "@/lib/constants";

import { createCategoryGroupSchema } from "../schemas/category-group.schema";

interface CreateCategoryGroupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FieldValues) => Promise<void>;
  loading: boolean;
}

export function CreateCategoryGroup({
  open,
  onOpenChange,
  onSubmit,
  loading,
}: CreateCategoryGroupProps) {
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
  ];

  return (
    <XDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add Category Group"
      onConfirm={() => formRef.current?.requestSubmit()}
      onCancel={() => onOpenChange(false)}
      confirmText="Add"
      cancelText="Cancel"
      loading={loading}
      size="md"
    >
      <XForm
        ref={formRef}
        schema={createCategoryGroupSchema}
        fields={formFields}
        onSubmit={handleSubmit}
        loading={loading}
        spacing="md"
      />
    </XDialog>
  );
}
