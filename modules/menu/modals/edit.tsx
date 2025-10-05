"use client";

import { useRef } from "react";
import { FieldValues } from "react-hook-form";

import { XDialog, XForm, XFormField } from "@/components/common";
import { FORM_TYPES } from "@/lib/constants";

import { updateMenuSchema } from "../schemas";
import { Menu } from "../types";

interface EditMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FieldValues) => Promise<void>;
  loading: boolean;
  isLoadingData?: boolean;
  menu?: Menu | null;
}

export function EditMenu({
  open,
  onOpenChange,
  onSubmit,
  loading,
  isLoadingData,
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
        loading={loading || isLoadingData}
        spacing="md"
        onSuccess={() => onOpenChange(false)}
        onFormReady={(form) => {
          form.reset({
            nameVi: menu?.nameVi || "",
            nameEn: menu?.nameEn || "",
            nameKm: menu?.nameKm || "",
          });
        }}
      />
    </XDialog>
  );
}
