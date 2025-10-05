"use client";

import { UseFormReturn } from "react-hook-form";

import { XInput, XSelect } from "@/components/common";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui";
import { Color } from "@/modules/color/types";

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

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name={`variants.${index}.stock`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <XInput
                    label="Stock"
                    type="number"
                    placeholder="Enter stock"
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
                    placeholder="Enter discount"
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

      <div className="space-y-4">
        <FormField
          control={form.control}
          name={`variants.${index}.originalPrice`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <XInput
                  label="Original Price"
                  type="number"
                  placeholder="Enter original price"
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
          name={`variants.${index}.salePrice`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <XInput
                  label="Sale Price"
                  type="number"
                  placeholder="Enter sale price"
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
