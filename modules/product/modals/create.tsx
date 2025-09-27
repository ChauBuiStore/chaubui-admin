"use client";

import {
  XButton,
  XDropzone,
  XFormDialog,
  XInput,
  XRadioGroup,
  XScrollArea,
  XSelect,
  XTextEditor
} from "@/components/common";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui";
import { mergeNewUploads, removeImageById } from "@/lib/helpers";
import { FileUpload } from "@/lib/types";
import { Color } from "@/modules/color/types";
import { Size } from "@/modules/size/types";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { FieldValues, useFieldArray, UseFormReturn } from "react-hook-form";
import { CreateProductFormData, createProductSchema } from "../schemas";
import { VariantType } from "../types";

interface CreateProductProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FieldValues) => Promise<void>;
  loading: boolean;
  categories?: Array<{ id: string; name: string }>;
  colors?: Color[];
  sizes?: Size[];
}

interface ProductFormFieldsProps {
  form: UseFormReturn<CreateProductFormData>;
  categories: Array<{ id: string; name: string }>;
  colors: Color[];
  sizes: Size[];
}

function ProductFormFields({
  form,
  categories,
  colors,
  sizes,
}: ProductFormFieldsProps) {
  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const [, setUploadedFiles] = useState<FileUpload[]>([]);

  const variantType = form.watch("variantType");

  useEffect(() => {
    const currentVariantsLength = variantFields.length;
    for (let i = currentVariantsLength - 1; i >= 0; i--) {
      removeVariant(i);
    }

    if (variantType && variantType !== VariantType.NONE) {
      appendVariant({
        sizeId: undefined,
        colorId: undefined,
        originalPrice: undefined,
        salePrice: undefined,
        discountPercent: undefined,
        stock: undefined,
      });
    }
  }, [variantType, variantFields.length, appendVariant, removeVariant]);

  useEffect(() => {
    if (variantType && variantFields && Array.isArray(variantFields)) {
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
    if (
      variantFields &&
      Array.isArray(variantFields) &&
      variantFields.length > 1
    ) {
      removeVariant(index);
    }
  };

  const handleImageUpload = (responses: FileUpload[]) => {
    const responseArray = Array.isArray(responses) ? responses : [];
    setUploadedFiles((prev: FileUpload[]) => [...prev, ...responseArray]);
    const currentImages = form.getValues("images") || [];
    form.setValue("images", mergeNewUploads(currentImages, responseArray));
  };

  const safeColors = Array.isArray(colors) ? colors : [];
  const safeSizes = Array.isArray(sizes) ? sizes : [];

  return (
    <XScrollArea className="h-[500px]">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="md:col-span-3">
                  <FormControl>
                    <XInput
                      label="Name"
                      required
                      placeholder="Enter name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <FormControl>
                    <XSelect
                      options={categories.map((category) => ({
                        value: category.id,
                        label: category.name,
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <XInput
                      label="Price"
                      type="number"
                      placeholder="Enter price"
                      hideSpinner
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <XInput
                      label="Stock"
                      type="number"
                      placeholder="Enter stock"
                      hideSpinner
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <XTextEditor
                    label="Description"
                    required
                    placeholder="Nhập mô tả sản phẩm..."
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <XDropzone
          onUploadSuccess={handleImageUpload}
          onFileDelete={(fileId) => {
            const currentImages = form.getValues("images") || [];
            form.setValue("images", removeImageById(currentImages, fileId));
            setUploadedFiles((prev) =>
              prev.filter((file) => file.id !== fileId)
            );
          }}
          multiple={true}
        />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="variantType"
            render={({ field }) => (
              <XRadioGroup
                label="Variant Type"
                options={[
                  {
                    value: VariantType.NONE,
                    label: "None",
                  },
                  {
                    value: VariantType.COLOR,
                    label: "Color",
                  },
                  {
                    value: VariantType.SIZE,
                    label: "Size",
                  },
                  {
                    value: VariantType.COMBO,
                    label: "Combo (Color + Size)",
                  },
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
                Add
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
                      <h4 className="font-medium text-foreground">
                        Variant {index + 1}
                      </h4>
                      {variantFields &&
                        Array.isArray(variantFields) &&
                        variantFields.length > 1 && (
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

                    {variantType === VariantType.COMBO ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name={`variants.${index}.colorId`}
                            render={({ field, fieldState }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">
                                  Color *
                                </FormLabel>
                                <FormControl>
                                  <XSelect
                                    options={safeColors.map((color) => ({
                                      value: color.id,
                                      label: color.name,
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
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
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
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
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
                                <FormLabel className="text-sm font-medium">
                                  Size *
                                </FormLabel>
                                <FormControl>
                                  <XSelect
                                    options={safeSizes.map((size) => ({
                                      value: size.id,
                                      label: size.name,
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
                                    {...field}
                                    value={field.value ?? ""}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value
                                          ? Number(e.target.value)
                                          : undefined
                                      )
                                    }
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
                                    {...field}
                                    value={field.value ?? ""}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value
                                          ? Number(e.target.value)
                                          : undefined
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          {variantType === VariantType.COLOR && (
                            <FormField
                              control={form.control}
                              name={`variants.${index}.colorId`}
                              render={({ field, fieldState }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium">
                                    Color *
                                  </FormLabel>
                                  <FormControl>
                                    <XSelect
                                      options={safeColors.map((color) => ({
                                        value: color.id,
                                        label: color.name,
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
                          )}

                          {variantType === VariantType.SIZE && (
                            <FormField
                              control={form.control}
                              name={`variants.${index}.sizeId`}
                              render={({ field, fieldState }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium">
                                    Size *
                                  </FormLabel>
                                  <FormControl>
                                    <XSelect
                                      options={safeSizes.map((size) => ({
                                        value: size.id,
                                        label: size.name,
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
                          )}

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
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                      }
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
                                      {...field}
                                      value={field.value ?? ""}
                                      onChange={(e) =>
                                        field.onChange(
                                          e.target.value
                                            ? Number(e.target.value)
                                            : undefined
                                        )
                                      }
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
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
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
                                    {...field}
                                    value={field.value ?? ""}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value
                                          ? Number(e.target.value)
                                          : undefined
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </XScrollArea>
  );
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
  const safeColors = Array.isArray(colors) ? colors : [];
  const safeSizes = Array.isArray(sizes) ? sizes : [];

  const handleSubmit = async (data: FieldValues) => {
    try {
      await onSubmit(data);
    } catch {
      // Handle error silently
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
        name: "",
        description: "",
        price: undefined,
        stock: undefined,
        categoryId: "",
        variantType: VariantType.NONE,
        images: [],
        variants: [],
      }}
      saveText="Add"
      onCancel={() => onOpenChange(false)}
    >
      {(form) => (
        <ProductFormFields
          form={form}
          categories={categories}
          colors={safeColors}
          sizes={safeSizes}
        />
      )}
    </XFormDialog>
  );
}
