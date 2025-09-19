"use client";

import { ActionsConfig, XTable } from "@/components/common/x-table";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Product } from "../types/product.type";
import { PaginationMeta } from "@/lib/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductsListProps {
  products: Product[];
  pagination?: PaginationMeta;
  isLoading: boolean;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
  onBulkDelete: (selectedProducts: Product[]) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSearchChange?: (searchTerm: string) => void;
}

export function ProductsList({
  products,
  pagination,
  isLoading,
  onEditProduct,
  onDeleteProduct,
  onBulkDelete,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
}: ProductsListProps) {
  const [selectedRows, setSelectedRows] = useState<Product[]>([]);

  const handleSelectionChange = (selectedProducts: Product[]) => {
    setSelectedRows(selectedProducts);
  };

  const columns: ColumnDef<Product>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Product Name",
        cell: ({ row }) => {
          const product = row.original;
          return <span className="font-medium">{product.name}</span>;
        },
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {product.category?.name || "N/A"}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "price",
        header: "Base Price",
        cell: ({ row }) => {
          const product = row.original;
          return (
            <span className="font-medium">
              ${product.price ? product.price.toLocaleString() : "N/A"}
            </span>
          );
        },
      },
      {
        accessorKey: "colors",
        header: "Colors",
        cell: ({ row }) => {
          const product = row.original;

          const variantColors =
            product.variants?.map((variant) => variant.color).filter(Boolean) ||
            [];

          const uniqueColors = variantColors.filter(
            (color, index, self) =>
              index === self.findIndex((c) => c.id === color.id)
          );

          if (uniqueColors.length === 0) {
            return <span className="text-gray-400 text-sm">No colors</span>;
          }

          return (
            <div className="flex items-center gap-1">
              {uniqueColors.slice(0, 6).map((color, index) => (
                <div
                  key={color.id || index}
                  className="w-5 h-5 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform cursor-pointer"
                  style={{ backgroundColor: color.code }}
                  title={`${color.name} (${color.code})`}
                />
              ))}
              {uniqueColors.length > 6 && (
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full border-2 border-white shadow-sm bg-gray-200 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      +{uniqueColors.length - 6}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "totalStock",
        header: "Total Stock",
        cell: ({ row }) => {
          const product = row.original;
          const totalStock =
            product.variants?.reduce(
              (sum, variant) => sum + variant.stock,
              0
            ) || 0;
          return (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
              <span
                  className={`font-medium ${
                    totalStock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {totalStock}
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost"
                      className="w-0 h-0 hover:opacity-70 transition-opacity"
                       title="View variant details"
                    >
                      {totalStock > 0 ? (
                        <Info className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-3" align="start">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h4 className="font-semibold text-sm">
                          {product.name}
                        </h4>
                      </div>

                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {product.variants && product.variants.length > 0 ? (
                          product.variants.map((variant, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between py-2 px-2 bg-gray-50 rounded"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full border border-gray-300"
                                  style={{
                                    backgroundColor: variant.color?.code,
                                  }}
                                  title={variant.color?.name}
                                />
                                <span className="text-sm font-medium">
                                  {variant.color?.name}
                                </span>
                                {variant.discountPercent > 0 && (
                                  <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs rounded">
                                    -{variant.discountPercent}%
                                  </span>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium">
                                  $
                                  {variant.salePrice?.toLocaleString() || "N/A"}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {variant.stock} pcs
                                </div>
                              </div>
                            </div>
                          ))
                         ) : (
                           <div className="text-center py-3 text-gray-500">
                             <p className="text-xs">No variants</p>
                           </div>
                         )}
                      </div>

                       <div className="border-t pt-2 flex justify-between items-center text-sm">
                         <span className="font-medium">Total Stock:</span>
                         <span
                           className={`font-bold ${
                             totalStock > 0 ? "text-green-600" : "text-red-600"
                           }`}
                         >
                           {totalStock} products
                         </span>
                       </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created Date",
        cell: ({ row }) => {
          const product = row.original;
          return new Date(product.createdAt).toLocaleDateString("en-US");
        },
      },
    ],
    []
  );

  const actionsConfig: ActionsConfig<Product> = useMemo(
    () => ({
      onEdit: (product) => onEditProduct(product),
      onDelete: (product) => onDeleteProduct(product),
    }),
    [onEditProduct, onDeleteProduct]
  );

  return (
    <>
      <XTable
        data={products}
        columns={columns}
        enableSelection={true}
        enableActions={true}
        actionsConfig={actionsConfig}
        onBulkDelete={onBulkDelete}
        onSelectionChange={handleSelectionChange}
        selectedRows={selectedRows}
        loading={isLoading}
        pagination={pagination}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        searchConfig={{
          enabled: true,
          columnKey: "keyword",
          placeholder: "Search Products...",
        }}
        filterConfig={{
          enabled: false,
          filters: [],
        }}
        onSearchChange={onSearchChange}
      />
    </>
  );
}
