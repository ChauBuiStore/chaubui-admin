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
import { CreateProductFormData, createProductSchema } from "../schemas";
import { VariantType } from "../types";

interface CreateProductProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateProductFormData) => Promise<void>;
  loading: boolean;
  categories?: Array<{ id: string; nameEn: string }>;
  colors?: Color[];
  sizes?: Size[];
}

export function CreateProduct({
  open,
  onOpenChange,
  onSubmit,
  loading,
  categories = [],
  colors = [],
  sizes = [],
}: CreateProductProps) {
  const handleSubmit = async (data: CreateProductFormData) => {
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch (error) {
      throw error;
    }
  };

  return (
    <XFormDialog
      size="4xl"
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Product"
      onSubmit={handleSubmit}
      loading={loading}
      schema={createProductSchema}
      defaultValues={{
        nameVi: "",
        nameEn: "",
        nameKm: "",
        description: "",
        originalPrice: undefined,
        salePrice: undefined,
        discountPercent: undefined,
        stock: undefined,
        categoryId: "",
        variantType: VariantType.NONE,
        thumbnailUrl: "",
        thumbnailId: "",
        images: [],
        variants: [],
      }}
      saveText="Add"
      onCancel={() => onOpenChange(false)}
    >
      {(form: UseFormReturn<CreateProductFormData>) => (
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
                          label="Discount %"
                          placeholder="Enter discount %"
                          value={field.value ?? ""}
                          onChange={(value) => field.onChange(value ?? undefined)}
                          onBlur={field.onBlur}
                          ref={field.ref}
                          size="md"
                          min={0}
                          hasError={!!fieldState.error}
                          wrapperClassName="space-y-1"
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
                          wrapperClassName="space-y-1"
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
                      <ProductThumbnail form={form} isEdit={false} hasError={!!fieldState.error} />
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
            <ProductUpload form={form} isEdit={false} multiple={true} />
            <ProductVariantForm form={form} colors={colors} sizes={sizes} />
          </div>
        </XScrollArea>
      )}
    </XFormDialog>
  );
}
