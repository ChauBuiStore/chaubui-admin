"use client";

import { useCallback, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";

import { XDropzoneThumbnail } from "@/components/common";

import { CreateProductFormData, UpdateProductFormData } from "../schemas";
import { ProductImage } from "../types";

interface ProductThumbnailProps {
  form: UseFormReturn<CreateProductFormData> | UseFormReturn<UpdateProductFormData>;
  productThumbnail?: ProductImage[];
  isEdit?: boolean;
  hasError?: boolean;
}

export function ProductThumbnail({
  form,
  productThumbnail = [],
  isEdit = false,
  hasError = false,
}: ProductThumbnailProps) {
  const initialThumbnail = useMemo(() => {
    const thumbnailId = form.getValues("thumbnailId");
    const thumbnailUrl = form.getValues("thumbnailUrl");

    if (thumbnailId && thumbnailUrl) {
      return {
        id: thumbnailId,
        url: thumbnailUrl,
      };
    }

    if (isEdit && productThumbnail && productThumbnail.length > 0) {
      const firstThumbnail = productThumbnail[0];
      if (firstThumbnail?.file?.id && firstThumbnail?.file?.url) {
        return {
          id: firstThumbnail.file.id,
          url: firstThumbnail.file.url,
        };
      }
    }
    return undefined;
  }, [isEdit, productThumbnail, form]);

  const handleThumbnailUpload = useCallback(
    (thumbnailUrl: string, thumbnailId: string) => {
      form.setValue("thumbnailUrl", thumbnailUrl);
      form.setValue("thumbnailId", thumbnailId);
      form.trigger(["thumbnailUrl", "thumbnailId"]);
    },
    [form],
  );

  const handleFileDelete = useCallback(() => {
    form.setValue("thumbnailUrl", "");
    form.setValue("thumbnailId", "");
    form.trigger(["thumbnailUrl", "thumbnailId"]);
  }, [form]);

  return (
    <XDropzoneThumbnail
      className="w-1/3"
      initialThumbnail={initialThumbnail}
      onUploadSuccess={handleThumbnailUpload}
      onFileDelete={handleFileDelete}
      hasError={hasError}
    />
  );
}
