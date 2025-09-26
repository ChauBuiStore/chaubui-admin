"use client";

import {
  XButton,
  XDropzone,
  XFormDialog,
  XInput,
  XRadioGroup,
  XScrollArea,
  XSelect,
  XTextEditor,
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
import { UpdateProductFormData, updateProductSchema } from "../schemas";
import { Product, ProductImage, VariantType } from "../types";

interface EditProductProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FieldValues) => Promise<void>;
  loading: boolean;
  product?: Product | null;
  categories?: Array<{ id: string; name: string }>;
  colors?: Color[];
  sizes?: Size[];
}

interface ProductEditFormFieldsProps {
  form: UseFormReturn<UpdateProductFormData>;
  categories: Array<{ id: string; name: string }>;
  colors: Color[];
  sizes: Size[];
  productImages?: ProductImage[];
}

function ProductEditFormFields({
  form,
  categories,
  colors,
  sizes,
  productImages,
}: ProductEditFormFieldsProps) {
  const [uploadResponseImages, setUploadResponseImages] = useState<
    FileUpload[]
  >([]);

  useEffect(() => {
    if (productImages && productImages.length > 0) {
      const convertedImages = productImages
        .filter((img) =>
          Boolean(img && img.file && img.file.id && img.file.url)
        )
        .map((img) => ({
          id: img.file!.id,
          fileName: img.file!.fileName || img.alt || "Image",
          url: img.file!.url!,
          alt: img.alt || img.file!.fileName || "Image",
          sortOrder: img.sortOrder || 1,
          size: img.file!.size || "0",
          mimeType: img.file!.mimeType || "image/jpeg",
          key: img.file!.key || "",
          createdAt: img.file!.createdAt || new Date().toISOString(),
          updatedAt: img.file!.updatedAt || new Date().toISOString(),
        }));
      setUploadResponseImages((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(convertedImages)) {
          return convertedImages;
        }
        return prev;
      });
    } else {
      setUploadResponseImages([]);
    }
  }, [productImages]);

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariantField,
  } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const [, setUploadedFiles] = useState<FileUpload[]>([]);

  const variantType = form.watch("variantType");

  useEffect(() => {
    if (!variantType || variantType === VariantType.NONE) {
      if (variantFields.length > 0) {
        for (let i = variantFields.length - 1; i >= 0; i--) {
          removeVariantField(i);
        }
      }
      return;
    }

    if (variantFields.length === 0) {
      appendVariant({
        sizeId: undefined,
        colorId: undefined,
        originalPrice: 0,
        salePrice: undefined,
        discountPercent: undefined,
        stock: 0,
      });
    }
  }, [variantType, variantFields.length, appendVariant, removeVariantField]);

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
      originalPrice: 0,
      salePrice: undefined,
      discountPercent: undefined,
      stock: 0,
    });
  };

  const removeVariant = (index: number) => {
    if (variantFields.length > 1) {
      removeVariantField(index);
    }
  };

  const safeColors = Array.isArray(colors) ? colors : [];
  const safeSizes = Array.isArray(sizes) ? sizes : [];

  return (
    <XScrollArea className="h-[600px]">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="md:col-span-3">
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <XInput placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <FormControl>
                    <XSelect
                      placeholder="Select category"
                      options={categories.map((cat) => ({
                        value: cat.id,
                        label: cat.name,
                      }))}
                      value={field.value}
                      onValueChange={field.onChange}
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
                    <XInput
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

            {variantType === VariantType.NONE && (
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <XInput
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
            )}
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <XTextEditor
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

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <XDropzone
                    maxFiles={5}
                    maxSize={5}
                    initialFiles={uploadResponseImages}
                    onUploadSuccess={(files) => {
                      setUploadedFiles(files);
                      const currentImages = field.value || [];
                      field.onChange(mergeNewUploads(currentImages, files));
                    }}
                    onFileDelete={(fileId) => {
                      const currentImages = field.value || [];
                      field.onChange(removeImageById(currentImages, fileId));
                      setUploadResponseImages((prev) =>
                        prev.filter((f) => f.id !== fileId)
                      );
                    }}
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
            name="variantType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variant Type *</FormLabel>
                <FormControl>
                  <XRadioGroup
                    options={[
                      { value: VariantType.NONE, label: "None" },
                      { value: VariantType.COLOR, label: "Color" },
                      { value: VariantType.SIZE, label: "Size" },
                      {
                        value: VariantType.COMBO,
                        label: "Combo (Color + Size)",
                      },
                    ]}
                    value={field.value}
                    onValueChange={field.onChange}
                    size="sm"
                    name="variantType"
                    orientation="horizontal"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {variantType && variantType !== VariantType.NONE && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-foreground">Variants</h3>
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
              {variantFields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-muted rounded-lg p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">
                      Variant {index + 1}
                    </h4>
                    {variantFields.length > 1 && (
                      <XButton
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariant(index)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </XButton>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      {(variantType === VariantType.COLOR ||
                        variantType === VariantType.COMBO) && (
                        <FormField
                          control={form.control}
                          name={`variants.${index}.colorId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Color *
                              </FormLabel>
                              <FormControl>
                                <XSelect
                                  placeholder="Select color"
                                  options={safeColors.map((color) => ({
                                    value: color.id,
                                    label: color.name,
                                  }))}
                                  value={field.value}
                                  onValueChange={field.onChange}
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
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Size *
                              </FormLabel>
                              <FormControl>
                                <XSelect
                                  placeholder="Select size"
                                  options={safeSizes.map((size) => ({
                                    value: size.id,
                                    label: size.name,
                                  }))}
                                  value={field.value}
                                  onValueChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {variantType === VariantType.COMBO && (
                        <>
                          <FormField
                            control={form.control}
                            name={`variants.${index}.colorId`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">
                                  Color *
                                </FormLabel>
                                <FormControl>
                                  <XSelect
                                    placeholder="Select color"
                                    options={safeColors.map((color) => ({
                                      value: color.id,
                                      label: color.name,
                                    }))}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`variants.${index}.sizeId`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">
                                  Size *
                                </FormLabel>
                                <FormControl>
                                  <XSelect
                                    placeholder="Select size"
                                    options={safeSizes.map((size) => ({
                                      value: size.id,
                                      label: size.name,
                                    }))}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      <FormField
                        control={form.control}
                        name={`variants.${index}.originalPrice`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Original Price (VND) *
                            </FormLabel>
                            <FormControl>
                              <XInput
                                type="number"
                                placeholder="0"
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

                    <div className="space-y-3">
                      <FormField
                        control={form.control}
                        name={`variants.${index}.stock`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Stock *
                            </FormLabel>
                            <FormControl>
                              <XInput
                                type="number"
                                placeholder="0"
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

                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name={`variants.${index}.salePrice`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Sale Price (VND)
                              </FormLabel>
                              <FormControl>
                                <XInput
                                  type="number"
                                  placeholder="0"
                                  hideSpinner
                                  {...field}
                                  value={field.value ?? ""}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value
                                        ? Number(e.target.value)
                                        : null
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
                                <XInput
                                  type="number"
                                  placeholder="0"
                                  hideSpinner
                                  {...field}
                                  value={field.value ?? ""}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value
                                        ? Number(e.target.value)
                                        : null
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </XScrollArea>
  );
}

export function EditProduct({
  open,
  onOpenChange,
  onSubmit,
  loading,
  product,
  categories = [],
  colors = [],
  sizes = [],
}: EditProductProps) {
  const safeColors = Array.isArray(colors) ? colors : [];
  const safeSizes = Array.isArray(sizes) ? sizes : [];

  const handleSubmit = async (data: FieldValues) => {
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch {}
  };

  const defaultValues = product
    ? {
        name: product.name,
        description: product.description,
        price: Number(product.price) || 0,
        categoryId: product.category.id,
        variantType:
          product.variants?.length > 0 ? VariantType.COMBO : VariantType.NONE,
        stock: product.variants?.length ? undefined : 0,
        images:
          product.images
            ?.filter((img) => {
              const hasValidFile = img.file && img.file.id && img.file.url;
              if (!hasValidFile) {
                return false;
              }
              return true;
            })
            ?.map((img, index) => ({
              fileId: img.file.id,
              alt: img.alt || img.file.fileName || `Image ${index + 1}`,
              sortOrder: index + 1,
              isThumbnail: index === 0,
            })) || [],
        variants:
          product.variants?.map((variant) => ({
            sizeId: variant.size?.id || "",
            colorId: variant.color?.id || "",
            originalPrice: Number(variant.originalPrice) || 0,
            salePrice: variant.salePrice
              ? Number(variant.salePrice)
              : undefined,
            discountPercent: variant.discountPercent
              ? Number(variant.discountPercent)
              : undefined,
            stock: Number(variant.stock) || 0,
          })) || [],
      }
    : {
        name: "",
        description: "",
        price: 0,
        categoryId: "",
        variantType: VariantType.NONE,
        images: [],
        variants: [
          {
            sizeId: "",
            colorId: "",
            originalPrice: 0,
            salePrice: undefined,
            discountPercent: undefined,
            stock: 0,
          },
        ],
      };

  return (
    <XFormDialog
      size="3xl"
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Product"
      onSubmit={handleSubmit}
      loading={loading}
      schema={updateProductSchema}
      defaultValues={defaultValues}
      saveText="Update"
      onCancel={() => onOpenChange(false)}
    >
      {(form) => (
        <ProductEditFormFields
          form={form}
          categories={categories}
          colors={safeColors}
          sizes={safeSizes}
          productImages={product?.images}
        />
      )}
    </XFormDialog>
  );
}
