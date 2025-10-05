"use client";

import { UseFormReturn } from "react-hook-form";

import { XInput, XSelect } from "@/components/common";
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

    // Include the currently selected size for this variant
    const currentSizeId = watchedVariants?.[currentIndex]?.sizeId;
    const availableSizes = sizes.filter((size) => !selectedSizeIds.includes(size.id));

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
