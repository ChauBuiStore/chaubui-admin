"use client";

import {
  XDropzone,
  XFormDialog,
  XRadioGroup,
  XSelect,
} from "@/components/common";
import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  ScrollArea,
  Textarea,
} from "@/components/ui";
import { FileUpload } from "@/lib/types";
import { Color } from "@/modules/color/types";
import { Size } from "@/modules/size/types";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { FieldValues, useFieldArray, UseFormReturn } from "react-hook-form";
import { CreateProductFormData, createProductSchema } from "../schemas";
import { mergeNewUploads, removeImageById } from "@/lib/helpers";
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
        originalPrice: 0,
        salePrice: undefined,
        discountPercent: undefined,
        stock: 0,
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
      originalPrice: 0,
      salePrice: undefined,
      discountPercent: undefined,
      stock: 0,
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
    <ScrollArea className="h-[500px]">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
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
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter price"
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
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter description"
                    className="resize-none"
                    rows={3}
                    {...field}
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
            setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
          }}
          maxFiles={10}
          maxSize={5}
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
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addVariant}
                className="flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Add
              </Button>
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
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeVariantHandler(index)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
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
                                <FormLabel className="text-sm font-medium">
                                  Original Price
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0"
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
                                <FormLabel className="text-sm font-medium">
                                  Stock
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0"
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
                                <FormLabel className="text-sm font-medium">
                                  Sale Price
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0"
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
                                <FormLabel className="text-sm font-medium">
                                  Discount (%)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0"
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
                                  <FormLabel className="text-sm font-medium">
                                    Stock
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="0"
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
                                  <FormLabel className="text-sm font-medium">
                                    Discount (%)
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="0"
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
                                <FormLabel className="text-sm font-medium">
                                  Original Price
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0"
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
                                <FormLabel className="text-sm font-medium">
                                  Sale Price
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0"
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
    </ScrollArea>
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
      size="3xl"
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Product"
      onSubmit={handleSubmit}
      loading={loading}
      schema={createProductSchema}
      defaultValues={{
        name: "",
        description: "",
        price: 0,
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
