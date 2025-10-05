"use client";

import { useRef } from "react";
import { FieldValues } from "react-hook-form";

import { XColorPicker, XDialog, XForm, XFormField } from "@/components/common";
import { FORM_TYPES } from "@/lib/constants";

import { updateColorSchema } from "../schemas";
import { Color } from "../types/color.type";

interface EditColorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FieldValues) => Promise<void>;
  loading: boolean;
  isLoadingData?: boolean;
  color?: Color | null;
}

export function EditColor({
  open,
  onOpenChange,
  onSubmit,
  loading,
  isLoadingData,
  color,
}: EditColorProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = async (data: FieldValues) => {
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch {}
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
    {
      name: "code",
      label: "Color Code",
      required: true,
      component: XColorPicker,
    },
  ];

  return (
    <XDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Color"
      onConfirm={() => formRef.current?.requestSubmit()}
      onCancel={() => onOpenChange(false)}
      confirmText="Update"
      cancelText="Cancel"
      loading={loading}
      size="md"
    >
      <XForm
        ref={formRef}
        schema={updateColorSchema}
        fields={fields}
        onSubmit={handleSubmit}
        loading={loading || isLoadingData}
        spacing="md"
        onSuccess={() => onOpenChange(false)}
        onFormReady={(form) => {
          form.reset({
            nameVi: color?.nameVi || "",
            nameEn: color?.nameEn || "",
            nameKm: color?.nameKm || "",
            code: color?.code || "",
          });
        }}
      />
    </XDialog>
  );
}
