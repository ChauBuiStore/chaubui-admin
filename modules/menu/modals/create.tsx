"use client";

import { XDialog, XForm, XFormField } from "@/components/common";
import { FORM_TYPES } from "@/lib/constants";
import { useRef } from "react";
import { FieldValues } from "react-hook-form";
import { createMenuSchema } from "../schemas";

interface CreateMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FieldValues) => Promise<void>;
  loading: boolean;
}

export function CreateMenu({
  open,
  onOpenChange,
  onSubmit,
  loading,
}: CreateMenuProps) {
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
      label: "Menu Name",
      placeholder: "Enter menu name",
      required: true,
    },
  ];

  return (
    <XDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Menu"
      onConfirm={() => formRef.current?.requestSubmit()}
      onCancel={() => onOpenChange(false)}
      confirmText="Add"
      cancelText="Cancel"
      loading={loading}
      size="md"
    >
      <XForm
        ref={formRef}
        schema={createMenuSchema}
        fields={fields}
        loading={loading}
        onSubmit={handleSubmit}
        spacing="md"
        onSuccess={() => onOpenChange(false)}
      />
    </XDialog>
  );
}
