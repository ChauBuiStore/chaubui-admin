"use client";

import { XDialog, XForm, XFormField } from "@/components/common";
import { FORM_TYPES } from "@/lib/constants";
import { useRef } from "react";
import { FieldValues } from "react-hook-form";
import { updateMenuSchema } from "../schemas";
import { Menu } from "../types";

interface EditMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FieldValues) => Promise<void>;
  loading: boolean;
  menu?: Menu | null;
}

export function EditMenu({
  open,
  onOpenChange,
  onSubmit,
  loading,
  menu,
}: EditMenuProps) {
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
      title="Edit Menu"
      onConfirm={() => formRef.current?.requestSubmit()}
      onCancel={() => onOpenChange(false)}
      confirmText="Update"
      cancelText="Cancel"
      loading={loading}
      size="md"
    >
      <XForm
        ref={formRef}
        schema={updateMenuSchema}
        fields={fields}
        onSubmit={handleSubmit}
        spacing="md"
        onSuccess={() => onOpenChange(false)}
        onFormReady={(form) => {
          form.reset({
            name: menu?.name || "",
          });
        }}
      />
    </XDialog>
  );
}
