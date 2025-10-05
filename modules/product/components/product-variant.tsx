"use client";

import { PlusIcon, TrashIcon } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";

import { XButton, XRadioGroup } from "@/components/common";
import { FormField } from "@/components/ui";
import { Color } from "@/modules/color/types";
import { Size } from "@/modules/size/types";

import { CreateProductFormData } from "../schemas";
import { VariantType } from "../types";
import { VariantColor, VariantCombo, VariantSize } from "./index";

interface ProductVariantProps {
  form: UseFormReturn<CreateProductFormData>;
  colors: Color[];
  sizes: Size[];
}

export function ProductVariantForm({ form, colors, sizes }: ProductVariantProps) {
  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control: form.control,
    name: "variants",
  });
  const variantType = form.watch("variantType");

  useEffect(() => {
    if (variantType && variantType !== VariantType.NONE && variantFields.length === 0) {
      appendVariant({
        sizeId: undefined,
        colorId: undefined,
        originalPrice: undefined,
        salePrice: undefined,
        discountPercent: undefined,
        stock: undefined,
      });
    } else if (variantType === VariantType.NONE && variantFields.length > 0) {
      for (let i = variantFields.length - 1; i >= 0; i--) {
        removeVariant(i);
      }
    }
  }, [variantType, variantFields.length, appendVariant, removeVariant]);

  useEffect(() => {
    if (variantType) {
      form.clearErrors("variants");
      variantFields.forEach((_, index) => {
        form.clearErrors(`variants.${index}.colorId`);
        form.clearErrors(`variants.${index}.sizeId`);
      });
    }
  }, [variantType, form, variantFields]);

  const addVariant = () => {
    appendVariant({
      sizeId: undefined,
      colorId: undefined,
      originalPrice: undefined,
      salePrice: undefined,
      discountPercent: undefined,
      stock: undefined,
    });
  };

  const removeVariantHandler = (index: number) => {
    if (variantFields && Array.isArray(variantFields) && variantFields.length > 1) {
      removeVariant(index);
    }
  };

  const renderVariantFields = (index: number) => {
    const variantComponents: Record<VariantType, React.ReactElement | null> = {
      [VariantType.COMBO]: (
        <VariantCombo
          form={form}
          colors={colors}
          sizes={sizes}
          index={index}
          variantType={variantType}
        />
      ),
      [VariantType.COLOR]: (
        <VariantColor form={form} colors={colors} index={index} variantType={variantType} />
      ),
      [VariantType.SIZE]: (
        <VariantSize form={form} sizes={sizes} index={index} variantType={variantType} />
      ),
      [VariantType.NONE]: null,
    };

    return variantComponents[variantType] || null;
  };

  return (
    <>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="variantType"
          render={({ field }) => (
            <XRadioGroup
              label="Variant Type"
              options={[
                { value: VariantType.NONE, label: "None" },
                { value: VariantType.COLOR, label: "Color" },
                { value: VariantType.SIZE, label: "Size" },
                { value: VariantType.COMBO, label: "Combo (Color + Size)" },
              ]}
              value={field.value}
              onValueChange={field.onChange}
              orientation="horizontal"
              size="sm"
              name="variantType"
            />
          )}
        />
      </div>

      {variantType !== VariantType.NONE && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">Variants</h4>
            <XButton
              type="button"
              variant="outline"
              size="sm"
              onClick={addVariant}
              className="flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              Add Variant
            </XButton>
          </div>

          <div className="space-y-4">
            {variantFields &&
              Array.isArray(variantFields) &&
              variantFields.map((field, index) => (
                <div
                  key={field.id || `variant-${index}`}
                  className="bg-muted rounded-lg p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">Variant {index + 1}</h4>
                    {variantFields && Array.isArray(variantFields) && variantFields.length > 1 && (
                      <XButton
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariantHandler(index)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </XButton>
                    )}
                  </div>

                  {renderVariantFields(index)}
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
}
