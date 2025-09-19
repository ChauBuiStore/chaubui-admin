"use client";

import { XFormDialog } from "@/components/common/x-dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea, ScrollArea } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { FieldValues, useFieldArray, UseFormReturn } from "react-hook-form";
import { updateProductSchema, UpdateProductFormData } from "../schemas";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Product } from "../types/product.type";
import { Color } from "@/modules/color/types";

interface EditProductProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FieldValues) => Promise<void>;
  loading: boolean;
  product?: Product | null;
  categories?: Array<{ id: string; name: string }>;
  colors?: Color[];
}

interface ProductEditFormFieldsProps {
  form: UseFormReturn<UpdateProductFormData>;
  categories: Array<{ id: string; name: string }>;
  colors: Color[];
}

function ProductEditFormFields({ form, categories, colors }: ProductEditFormFieldsProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "colors",
  });

  const addColor = () => {
    append({
      id: "",
      originPrice: 0,
      salePrice: null,
      discountPercent: null,
      stock: 0,
    });
  };

  const removeColor = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const safeColors = Array.isArray(colors) ? colors : [];

  return (
    <ScrollArea className="h-[550px]">
      <div className="space-y-6">
        <div className="space-y-4">                
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Product Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Price (VND) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter product price"
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
                <FormLabel>Product Description *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter product description"
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

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Colors and Pricing</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addColor}
              className="flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              Add Color
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-800">Color {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeColor(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name={`colors.${index}.id`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Color *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select color">
                                  {field.value && safeColors.find(c => c.id === field.value) && (
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="w-4 h-4 rounded-full border border-gray-300"
                                        style={{
                                          backgroundColor: safeColors.find(c => c.id === field.value)?.code,
                                        }}
                                      />
                                      {safeColors.find(c => c.id === field.value)?.name}
                                    </div>
                                  )}
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {safeColors.map((color) => (
                                <SelectItem key={color.id} value={color.id}>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-4 h-4 rounded-full border border-gray-300"
                                      style={{ backgroundColor: color.code }}
                                    />
                                    {color.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`colors.${index}.originPrice`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Base Price (VND) *</FormLabel>
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

                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name={`colors.${index}.stock`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Stock *</FormLabel>
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

                    <div className="grid grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name={`colors.${index}.salePrice`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Sale Price</FormLabel>
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
                        name={`colors.${index}.discountPercent`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Discount (%)</FormLabel>
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
      </div>
    </ScrollArea>
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
}: EditProductProps) {
  const safeColors = Array.isArray(colors) ? colors : [];

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
        price: product.price,
        categoryId: product.category.id,
        colors: product.variants.map((pc) => ({
          id: pc.color.id,
          originPrice: pc.originalPrice,
          salePrice: pc.salePrice,
          discountPercent: pc.discountPercent,
          stock: pc.stock,
          sku: pc.sku,
        })),
      }
    : {
        name: "",
        description: "",
        price: 0,
        categoryId: "",
        colors: [
          {
            id: "",
            originPrice: 0,
            salePrice: null,
            discountPercent: null,
            stock: 0,
            sku: null,
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
        />
      )}
    </XFormDialog>
  );
}
