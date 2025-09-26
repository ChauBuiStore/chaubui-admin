"use client";

import { XDialog, XForm, XFormField } from "@/components/common";
import { FORM_TYPES } from "@/lib/constants";
import { useRef } from "react";
import { FieldValues } from "react-hook-form";
import { updateSizeSchema } from "../schemas";
import { Size } from "../types";

interface EditSizeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FieldValues) => Promise<void>;
  loading: boolean;
  size?: Size | null;
}

export function EditSize({
  open,
  onOpenChange,
  onSubmit,
  loading,
  size,
}: EditSizeProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (data: FieldValues) => {
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch { }
  };

  const fields: XFormField[] = [
    {
      name: "name",
      type: FORM_TYPES.INPUT,
      subType: FORM_TYPES.TEXT,
      label: "Size Name",
      placeholder: "Enter size name",
      required: true,
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
        loading={loading}
        onSuccess={() => onOpenChange(false)}
        onFormReady={(form) => {
          form.reset({
            name: size?.name || "",
          });
        }}
      />
    </XDialog>
  );
}
