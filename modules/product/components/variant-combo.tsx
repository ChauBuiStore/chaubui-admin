"use client";

import { UseFormReturn } from "react-hook-form";

import { XInput, XSelect } from "@/components/common";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui";
import { Color } from "@/modules/color/types";
import { Size } from "@/modules/size/types";

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

    // Include the currently selected color for this variant
    const currentColorId = watchedVariants?.[currentIndex]?.colorId;
    const availableColors = colors.filter(
      (color) => !selectedColorIdsWithCurrentSize.includes(color.id),
    );

    // If there's a currently selected color, make sure it's included in the options
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

    // Include the currently selected size for this variant
    const currentSizeId = watchedVariants?.[currentIndex]?.sizeId;
    const availableSizes = sizes.filter(
      (size) => !selectedSizeIdsWithCurrentColor.includes(size.id),
    );

    // If there's a currently selected size, make sure it's included in the options
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
                <XSelect
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
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <XInput
                  label="Original Price"
                  type="number"
                  hideSpinner
                  name={field.name}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                  }
                  onBlur={field.onBlur}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`variants.${index}.stock`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <XInput
                  label="Stock"
                  type="number"
                  hideSpinner
                  name={field.name}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                  }
                  onBlur={field.onBlur}
                  ref={field.ref}
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
                <XSelect
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
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <XInput
                  label="Sale Price"
                  type="number"
                  hideSpinner
                  name={field.name}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                  }
                  onBlur={field.onBlur}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`variants.${index}.discountPercent`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <XInput
                  label="Discount (%)"
                  type="number"
                  hideSpinner
                  name={field.name}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                  }
                  onBlur={field.onBlur}
                  ref={field.ref}
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
