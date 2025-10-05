"use client";

import { useRef } from "react";
import { FieldValues } from "react-hook-form";

import { XDialog, XForm, XFormField } from "@/components/common";
import { FORM_TYPES } from "@/lib/constants";

import { createMenuSchema } from "../schemas";

interface CreateMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FieldValues) => Promise<void>;
  loading: boolean;
}

export function CreateMenu({ open, onOpenChange, onSubmit, loading }: CreateMenuProps) {
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
