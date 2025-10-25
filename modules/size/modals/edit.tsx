"use client";

import { useRef } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

import { XDialog, XForm, XFormField } from "@/components/common";
import { FORM_TYPES } from "@/lib/constants";

import { updateSizeSchema } from "../schemas/size.schema";
import { Size } from "../types/size.type";

interface EditSizeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FieldValues) => Promise<void>;
  loading: boolean;
  isLoadingData?: boolean;
  size?: Size | null;
}

export function EditSize({
  open,
  onOpenChange,
  onSubmit,
  loading,
  isLoadingData,
  size,
}: EditSizeProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (data: FieldValues) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  const fields: XFormField[] = [
    {
      name: "nameVi",
      type: FORM_TYPES.INPUT,
      subType: FORM_TYPES.TEXT,
      label: "NameVi",
      placeholder: "Enter nameVi",
      required: true,
    },
    {
      name: "nameEn",
      type: FORM_TYPES.INPUT,
      subType: FORM_TYPES.TEXT,
      label: "NameEn",
      placeholder: "Enter nameEn",
      required: true,
    },
    {
      name: "nameKm",
      type: FORM_TYPES.INPUT,
      subType: FORM_TYPES.TEXT,
      label: "NameKm",
      placeholder: "Enter nameKm",
      required: false,
    },
  ];

  return (
    <XDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Size"
      onConfirm={() => formRef.current?.requestSubmit()}
      onCancel={() => onOpenChange(false)}
      confirmText="Update"
      cancelText="Cancel"
      loading={loading}
      size="md"
    >
      <XForm
        ref={formRef}
        schema={updateSizeSchema}
        fields={fields}
        onSubmit={handleSubmit}
        loading={loading || isLoadingData}
        onFormReady={(form: UseFormReturn<FieldValues, unknown, unknown>) => {
          form.reset({
            nameVi: size?.nameVi || "",
            nameEn: size?.nameEn || "",
            nameKm: size?.nameKm || "",
          });
        }}
      />
    </XDialog>
  );
}
