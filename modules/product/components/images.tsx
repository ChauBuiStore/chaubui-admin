"use client";

import { XImagePreview } from "@/components/common";
import { Product } from "@/modules/product/types";

interface ImagesProps {
  product: Product;
}

export function Images({ product }: ImagesProps) {
  const images =
    product.images?.map((image) => image.file)?.filter((file) => file && file.url) || [];

  return <XImagePreview images={images} title={product.name} mode="gallery" size="md" />;
}
