"use client";

import { UseFormReturn } from "react-hook-form";

import { XCombobox, XInputNumber } from "@/components/common";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui";
import { Color } from "@/modules/color/types/color.type";

import { CreateProductFormData, UpdateProductFormData } from "../schemas";
import { VariantType } from "../types";

interface VariantColorProps {
  form: UseFormReturn<CreateProductFormData> | UseFormReturn<UpdateProductFormData>;
  colors: Color[];
  index: number;
  variantType: VariantType;
}

export function VariantColor({ form, colors, index, variantType }: VariantColorProps) {
  const watchedVariants = form.watch("variants");

  const getAvailableColors = (currentIndex: number) => {
    if (variantType !== VariantType.COLOR) {
      return colors;
    }

    const selectedColorIds =
      watchedVariants
        ?.map((variant, index) => {
          if (index === currentIndex) return null;
          return variant?.colorId;
        })
        .filter(Boolean) || [];

    const currentColorId = watchedVariants?.[currentIndex]?.colorId;
    const availableColors = colors.filter((color) => !selectedColorIds.includes(color.id));

    if (currentColorId && !availableColors.find((color) => color.id === currentColorId)) {
      const currentColor = colors.find((color) => color.id === currentColorId);
      if (currentColor) {
        availableColors.push(currentColor);
      }
    }

    return availableColors;
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
      </div>
    </div>
  );
}
