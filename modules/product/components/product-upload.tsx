"use client";

import { useCallback, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";

import { XDropzone } from "@/components/common";
import { mergeNewUploads, removeImageById } from "@/lib/helpers";
import { FileUpload } from "@/lib/types";

import { CreateProductFormData, UpdateProductFormData } from "../schemas";
import { ProductImage } from "../types";

interface ProductUploadProps {
  form: UseFormReturn<CreateProductFormData> | UseFormReturn<UpdateProductFormData>;
  productImages?: ProductImage[];
  isEdit?: boolean;
  multiple?: boolean;
  hasError?: boolean;
}

export function ProductUpload({
  form,
  productImages = [],
  isEdit = false,
  multiple = true,
  hasError = false,
}: ProductUploadProps) {
  const uploadResponseImages = useMemo(() => {
    if (isEdit && productImages && productImages.length > 0) {
      return productImages
        .filter((img) => Boolean(img && img.file && img.file.id && img.file.url))
        .map((img) => ({
          id: img.file!.id,
          fileName: img.file!.fileName || img.alt || "Image",
          url: img.file!.url!,
          alt: img.alt || img.file!.fileName || "Image",
          sortOrder: img.sortOrder || 1,
          size: img.file!.size || "0",
          mimeType: img.file!.mimeType || "image/jpeg",
          key: img.file!.key || "",
          createdAt: img.file!.createdAt || new Date().toISOString(),
          updatedAt: img.file!.updatedAt || new Date().toISOString(),
        }));
    }
    return [];
  }, [isEdit, productImages]);

  const handleImageUpload = useCallback(
    (files: FileUpload[]) => {
      const currentImages = form.getValues("images") || [];
      const mergedImages = mergeNewUploads(currentImages, files);
      form.setValue("images", mergedImages);
      form.trigger("images");
    },
    [form],
  );

  const handleFileDelete = useCallback(
    (fileId: string) => {
      const currentImages = form.getValues("images") || [];
      const updatedImages = removeImageById(currentImages, fileId);
      form.setValue("images", updatedImages);
      form.trigger("images");
    },
    [form],
  );

  return (
    <XDropzone
      initialFiles={isEdit ? uploadResponseImages : []}
      onUploadSuccess={handleImageUpload}
      onFileDelete={handleFileDelete}
      multiple={multiple}
      hasError={hasError}
    />
  );
}
