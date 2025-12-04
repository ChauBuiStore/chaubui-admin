"use client";

import { UseFormReturn } from "react-hook-form";

import {
  XCombobox,
  XFormDialog,
  XInput,
  XInputNumber,
  XScrollArea,
  XTextEditor,
} from "@/components/common";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui";
import { Color } from "@/modules/color/types/color.type";
import { Size } from "@/modules/size/types/size.type";

import { ProductThumbnail, ProductUpload, ProductVariantForm } from "../components";
import { UpdateProductFormData, updateProductSchema } from "../schemas";
import { Product } from "../types";

interface EditProductProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UpdateProductFormData) => Promise<void>;
  loading: boolean;
  product: Product | null;
  categories?: Array<{ id: string; nameEn: string }>;
  colors?: Color[];
  sizes?: Size[];
}

export function EditProduct({
  open,
  onOpenChange,
  onSubmit,
  loading,
  product,
  categories = [],
  colors = [],
  sizes = [],
}: EditProductProps) {
  const handleSubmit = async (data: UpdateProductFormData) => {
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch (error) {
      throw error;
    }
  };

  if (!product) {
    return null;
  }

  const defaultValues = {
    nameVi: product.nameVi || "",
    nameEn: product.nameEn || "",
    nameKm: product.nameKm || "",
    description: product.description,
    originalPrice: product.originalPrice != null ? Number(product.originalPrice) : undefined,
    salePrice: product.salePrice != null ? Number(product.salePrice) : undefined,
    discountPercent: product.discountPercent != null ? Number(product.discountPercent) : undefined,
    stock: product.stock != null ? Number(product.stock) : undefined,
    categoryId: product.category?.id || "",
    variantType: product.variantType,
    thumbnailUrl: product.thumbnailUrl || product.thumbnail?.[0]?.file?.url || "",
    thumbnailId: product.thumbnailId || product.thumbnail?.[0]?.file?.id || "",
    images:
      product.images
        ?.filter((img) => {
          const hasValidFile = img.file && img.file.id && img.file.url;
          if (!hasValidFile) {
            return false;
          }
          return true;
        })
        ?.map((img, index) => ({
          fileId: img.file.id,
          alt: img.alt || img.file.fileName || `Image ${index + 1}`,
          sortOrder: index + 1,
        })) || [],
    variants:
      product.variants?.map((variant) => ({
        sizeId: variant.size?.id || "",
        colorId: variant.color?.id || "",
        originalPrice: variant.originalPrice != null ? Number(variant.originalPrice) : undefined,
        salePrice: variant.salePrice != null ? Number(variant.salePrice) : undefined,
        discountPercent:
          variant.discountPercent != null ? Number(variant.discountPercent) : undefined,
        stock: variant.stock != null ? Number(variant.stock) : undefined,
      })) || [],
  };

  return (
    <XFormDialog
      size="4xl"
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Product"
      onSubmit={handleSubmit}
      loading={loading}
      schema={updateProductSchema}
      defaultValues={defaultValues}
      saveText="Update"
      onCancel={() => onOpenChange(false)}
    >
      {(form: UseFormReturn<UpdateProductFormData>) => (
        <XScrollArea className="h-[500px]">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="nameVi"
                  render={({ field }) => (
                    <FormItem className="md:col-span-3">
                      <FormControl>
                        <XInput label="NameVi" required placeholder="Enter nameVi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nameEn"
                  render={({ field }) => (
                    <FormItem className="md:col-span-3">
                      <FormControl>
                        <XInput label="NameEn" required placeholder="Enter nameEn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nameKm"
                  render={({ field }) => (
                    <FormItem className="md:col-span-3">
                      <FormControl>
                        <XInput label="NameKm" placeholder="Enter nameKm" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="originalPrice"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <XInputNumber
                            label="Original Price"
                            placeholder="Enter original price"
                            value={field.value ?? ""}
                            onChange={(value) => field.onChange(value ?? undefined)}
                            onBlur={field.onBlur}
                            ref={field.ref}
                            size="md"
                            min={0}
                            hasError={!!fieldState.error}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="salePrice"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <XInputNumber
                            label="Sale Price"
                            placeholder="Enter sale price"
                            value={field.value ?? ""}
                            onChange={(value) => field.onChange(value ?? undefined)}
                            onBlur={field.onBlur}
                            ref={field.ref}
                            size="md"
                            min={0}
                            hasError={!!fieldState.error}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <FormControl>
                        <XCombobox
                          options={categories.map((category) => ({
                            value: category.id,
                            label: category.nameEn,
                          }))}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select category"
                          hasError={!!fieldState.error}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discountPercent"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <XInputNumber
                          label="Discount (%)"
                          placeholder="Enter discount"
                          value={field.value ?? ""}
                          onChange={(value) => field.onChange(value ?? undefined)}
                          onBlur={field.onBlur}
                          ref={field.ref}
                          size="md"
                          min={0}
                          hasError={!!fieldState.error}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormControl>
                        <XInputNumber
                          label="Stock"
                          placeholder="Enter stock"
                          value={field.value ?? ""}
                          onChange={(value) => field.onChange(value ?? undefined)}
                          onBlur={field.onBlur}
                          ref={field.ref}
                          size="md"
                          min={0}
                          hasError={!!fieldState.error}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="thumbnailUrl"
                render={({ fieldState }) => (
                  <FormItem>
                    <FormLabel>Thumbnail *</FormLabel>
                    <FormControl>
                      <ProductThumbnail form={form} isEdit={true} hasError={!!fieldState.error} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <XTextEditor
                        label="Description"
                        required
                        placeholder="Nhập mô tả sản phẩm..."
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          form.trigger("description");
                        }}
                        error={!!fieldState.error}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="images"
              render={({ fieldState }) => (
                <FormItem>
                  <FormLabel>Files Upload *</FormLabel>
                  <FormControl>
                    <ProductUpload
                      form={form}
                      productImages={product?.images || []}
                      isEdit={true}
                      multiple={true}
                      hasError={!!fieldState.error}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ProductVariantForm form={form} colors={colors} sizes={sizes} />
          </div>
        </XScrollArea>
      )}
    </XFormDialog>
  );
}
