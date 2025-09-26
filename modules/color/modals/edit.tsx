"use client";

import { XColorPicker, XDialog, XForm, XFormField } from "@/components/common";
import { FORM_TYPES } from "@/lib/constants";
import { useRef } from "react";
import { FieldValues } from "react-hook-form";
import { updateColorSchema } from "../schemas";
import { Color } from "../types/color.type";

interface EditColorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FieldValues) => Promise<void>;
  loading: boolean;
  color?: Color | null;
}

export function EditColor({
  open,
  onOpenChange,
  onSubmit,
  loading,
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
      name: "name",
      type: FORM_TYPES.INPUT,
      subType: FORM_TYPES.TEXT,
      label: "Color Name",
      placeholder: "Enter color name",
      required: true,
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
        spacing="md"
        onSuccess={() => onOpenChange(false)}
        onFormReady={(form) => {
          form.reset({
            name: color?.name || "",
            code: color?.code || "",
          });
        }}
      />
    </XDialog>
  );
}
