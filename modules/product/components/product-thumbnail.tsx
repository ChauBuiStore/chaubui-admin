"use client";

import { useCallback, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";

import { XDropzoneThumbnail } from "@/components/common";
import { FormControl, FormItem, FormMessage } from "@/components/ui";

import { CreateProductFormData, UpdateProductFormData } from "../schemas";
import { ProductImage } from "../types";

interface ProductThumbnailProps {
  form: UseFormReturn<CreateProductFormData> | UseFormReturn<UpdateProductFormData>;
  productThumbnail?: ProductImage[];
  isEdit?: boolean;
}

export function ProductThumbnail({
  form,
  productThumbnail = [],
  isEdit = false,
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
    },
    [form],
  );

  const handleFileDelete = useCallback(() => {
    form.setValue("thumbnailUrl", "");
    form.setValue("thumbnailId", "");
  }, [form]);

  return (
    <FormItem>
      <FormControl>
        <XDropzoneThumbnail
          className="w-1/3"
          title="Thumbnail"
          initialThumbnail={initialThumbnail}
          onUploadSuccess={handleThumbnailUpload}
          onFileDelete={handleFileDelete}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
