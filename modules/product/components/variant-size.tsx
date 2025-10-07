"use client";

import { UseFormReturn } from "react-hook-form";

import { XInputNumber, XSelect } from "@/components/common";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui";
import { Size } from "@/modules/size/types";

import { CreateProductFormData, UpdateProductFormData } from "../schemas";
import { VariantType } from "../types";

interface VariantSizeProps {
  form: UseFormReturn<CreateProductFormData> | UseFormReturn<UpdateProductFormData>;
  sizes: Size[];
  index: number;
  variantType: VariantType;
}

export function VariantSize({ form, sizes, index, variantType }: VariantSizeProps) {
  const watchedVariants = form.watch("variants");

  const getAvailableSizes = (currentIndex: number) => {
    if (variantType !== VariantType.SIZE) {
      return sizes;
    }

    const selectedSizeIds =
      watchedVariants
        ?.map((variant, index) => {
          if (index === currentIndex) return null;
          return variant?.sizeId;
        })
        .filter(Boolean) || [];

    const currentSizeId = watchedVariants?.[currentIndex]?.sizeId;
    const availableSizes = sizes.filter((size) => !selectedSizeIds.includes(size.id));

    if (currentSizeId && !availableSizes.find((size) => size.id === currentSizeId)) {
      const currentSize = sizes.find((size) => size.id === currentSizeId);
      if (currentSize) {
        availableSizes.push(currentSize);
      }
    }

    return availableSizes;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <FormField
          control={form.control}
          name={`variants.${index}.sizeId`}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Size *</FormLabel>
              <FormControl>
                <XSelect
                  options={getAvailableSizes(index).map((size) => ({
                    value: size.id,
                    label: size.nameEn,
                  }))}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select size"
                  hasError={!!fieldState.error}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name={`variants.${index}.stock`}
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
                    size="sm"
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
            name={`variants.${index}.discountPercent`}
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
                    size="sm"
                    min={0}
                    hasError={!!fieldState.error}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name={`variants.${index}.originalPrice`}
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
                  size="sm"
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
          name={`variants.${index}.salePrice`}
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
                  size="sm"
                  min={0}
                  hasError={!!fieldState.error}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
