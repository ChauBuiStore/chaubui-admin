"use client";

import { UseFormReturn } from "react-hook-form";

import { XCombobox, XInputNumber } from "@/components/common";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui";
import { Color } from "@/modules/color/types/color.type";
import { Size } from "@/modules/size/types/size.type";

import { CreateProductFormData, UpdateProductFormData } from "../schemas";
import { VariantType } from "../types";

interface VariantComboProps {
  form: UseFormReturn<CreateProductFormData> | UseFormReturn<UpdateProductFormData>;
  colors: Color[];
  sizes: Size[];
  index: number;
  variantType: VariantType;
}

export function VariantCombo({ form, colors, sizes, index, variantType }: VariantComboProps) {
  const watchedVariants = form.watch("variants");

  const getAvailableColors = (currentIndex: number) => {
    if (variantType !== VariantType.COMBO) {
      return colors;
    }

    const currentSizeId = watchedVariants?.[currentIndex]?.sizeId;
    if (!currentSizeId) {
      return colors;
    }

    const selectedColorIdsWithCurrentSize =
      watchedVariants
        ?.map((variant, index) => {
          if (index === currentIndex) return null;
          if (variant?.sizeId === currentSizeId) {
            return variant?.colorId;
          }
          return null;
        })
        .filter(Boolean) || [];

    const currentColorId = watchedVariants?.[currentIndex]?.colorId;
    const availableColors = colors.filter(
      (color) => !selectedColorIdsWithCurrentSize.includes(color.id),
    );

    if (currentColorId && !availableColors.find((color) => color.id === currentColorId)) {
      const currentColor = colors.find((color) => color.id === currentColorId);
      if (currentColor) {
        availableColors.push(currentColor);
      }
    }

    return availableColors;
  };

  const getAvailableSizes = (currentIndex: number) => {
    if (variantType !== VariantType.COMBO) {
      return sizes;
    }

    const currentColorId = watchedVariants?.[currentIndex]?.colorId;
    if (!currentColorId) {
      return sizes;
    }

    const selectedSizeIdsWithCurrentColor =
      watchedVariants
        ?.map((variant, index) => {
          if (index === currentIndex) return null;
          if (variant?.colorId === currentColorId) {
            return variant?.sizeId;
          }
          return null;
        })
        .filter(Boolean) || [];

    const currentSizeId = watchedVariants?.[currentIndex]?.sizeId;
    const availableSizes = sizes.filter(
      (size) => !selectedSizeIdsWithCurrentColor.includes(size.id),
    );

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
          name={`variants.${index}.colorId`}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Color *</FormLabel>
              <FormControl>
                <XCombobox
                  options={getAvailableColors(index).map((color: Color) => ({
                    value: color.id,
                    label: color.nameEn,
                  }))}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select color"
                  hasError={!!fieldState.error}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

      <div className="space-y-4">
        <FormField
          control={form.control}
          name={`variants.${index}.sizeId`}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Size *</FormLabel>
              <FormControl>
                <XCombobox
                  options={getAvailableSizes(index).map((size: Size) => ({
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
    </div>
  );
}
