"use client";

import { useCallback, useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { XDropzone } from "@/components/common";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui";
import { mergeNewUploads, removeImageById } from "@/lib/helpers";
import { FileUpload } from "@/lib/types";

import { CreateProductFormData, UpdateProductFormData } from "../schemas";
import { ProductImage } from "../types";

interface ProductUploadProps {
  form: UseFormReturn<CreateProductFormData> | UseFormReturn<UpdateProductFormData>;
  productImages?: ProductImage[];
  isEdit?: boolean;
  multiple?: boolean;
}

export function ProductUpload({
  form,
  productImages = [],
  isEdit = false,
  multiple = true,
}: ProductUploadProps) {
  const [, setUploadedFiles] = useState<FileUpload[]>([]);

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
    (responses: FileUpload[]) => {
      const responseArray = Array.isArray(responses) ? responses : [];
      setUploadedFiles((prev: FileUpload[]) => [...prev, ...responseArray]);
      const currentImages = form.getValues("images") || [];
      form.setValue("images", mergeNewUploads(currentImages, responseArray));
    },
    [form],
  );

  const handleFileDelete = useCallback(
    (fileId: string) => {
      const currentImages = form.getValues("images") || [];
      form.setValue("images", removeImageById(currentImages, fileId));
      setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
    },
    [form],
  );

  if (isEdit) {
    return (
      <FormField
        control={form.control}
        name="images"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <XDropzone
                initialFiles={uploadResponseImages}
                onUploadSuccess={(files) => {
                  setUploadedFiles(files);
                  const currentImages = field.value || [];
                  field.onChange(mergeNewUploads(currentImages, files));
                }}
                onFileDelete={handleFileDelete}
                multiple={multiple}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <XDropzone
      onUploadSuccess={handleImageUpload}
      onFileDelete={handleFileDelete}
      multiple={multiple}
    />
  );
}
