"use client";

  import { XColorPicker, XDialog, XForm, XFormField } from "@/components/common";
import { FORM_TYPES } from "@/lib/constants";
import { useRef } from "react";
import { FieldValues } from "react-hook-form";
import { createColorSchema } from "../schemas";

interface CreateColorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FieldValues) => Promise<void>;
  loading: boolean;
}

export function CreateColor({
  open,
  onOpenChange,
  onSubmit,
  loading,
}: CreateColorProps) {
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
      title="Add New Color"
      onConfirm={() => formRef.current?.requestSubmit()}
      onCancel={() => onOpenChange(false)}
      confirmText="Add"
      cancelText="Cancel"
      loading={loading}
      size="md"
    >
      <XForm
        ref={formRef}
        schema={createColorSchema}
        fields={fields}
        onSubmit={handleSubmit}
        spacing="md"
        onSuccess={() => onOpenChange(false)}
      />
    </XDialog>
  );
}
