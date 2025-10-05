"use client";

import { useRef } from "react";
import { FieldValues } from "react-hook-form";

import { XDialog } from "@/components/common/x-dialog";
import XForm, { XFormField } from "@/components/common/x-form";
import { FORM_TYPES } from "@/lib/constants";

import { updateCategoryGroupSchema } from "../schemas";
import { CategoryGroup } from "../types/categories-group.type";

interface EditCategoryGroupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FieldValues) => Promise<void>;
  loading: boolean;
  categoryGroup?: CategoryGroup;
  isLoadingData?: boolean;
  onClose?: () => void;
}

export function EditCategoryGroup({
  open,
  onOpenChange,
  onSubmit,
  loading,
  categoryGroup,
  isLoadingData = false,
  onClose,
}: EditCategoryGroupProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = async (data: FieldValues) => {
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch {}
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen && onClose) {
      onClose();
    }
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
      onOpenChange={handleOpenChange}
      title="Edit Category Group"
      onConfirm={() => formRef.current?.requestSubmit()}
      onCancel={() => handleOpenChange(false)}
      confirmText="Update"
      cancelText="Cancel"
      loading={loading || isLoadingData}
      size="md"
    >
      <XForm
        ref={formRef}
        schema={updateCategoryGroupSchema}
        fields={formFields}
        onSubmit={handleSubmit}
        loading={loading}
        onSuccess={() => handleOpenChange(false)}
        spacing="md"
        onFormReady={(form) => {
          form.reset({
            nameVi: categoryGroup?.nameVi || "",
            nameEn: categoryGroup?.nameEn || "",
            nameKm: categoryGroup?.nameKm || "",
          });
        }}
      />
    </XDialog>
  );
}
