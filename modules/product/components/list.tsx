"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { ActionsConfig, XTable } from "@/components/common/x-table";
import { PaginationMeta } from "@/lib/types";
import { formatDate } from "@/lib/utils/date.ultis";
import { Product } from "@/modules/product/types";

import { Color } from "./color";
import { Images } from "./images";
import { Price } from "./price";
import { Size } from "./size";
import { Stock } from "./stock";
import { StockStatus } from "./stock-status";

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
        accessorKey: "images",
        header: "Images",
        cell: ({ row }) => {
          const product = row.original;
          return <Images product={product} />;
        },
      },
      {
        accessorKey: "nameEn",
        header: "Product Name",
        cell: ({ row }) => {
          const product = row.original;
          return <span className="font-medium">{product.nameEn}</span>;
        },
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
          const product = row.original;

          if (!product.category) {
            return <span className="text-muted-foreground text-sm">N/A</span>;
          }

          return (
            <div className="flex items-center gap-1.5 min-w-[180px]">
              {product.category.group ? (
                <>
                  <span className="px-2 py-1 bg-muted text-foreground/80 text-xs rounded-full border border-muted/20 font-medium">
                    {product.category.group.nameEn}
                  </span>
                  {product.category.nameEn && (
                    <>
                      <span className="text-muted-foreground">›</span>
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium border border-primary/20">
                        {product.category.nameEn}
                      </span>
                    </>
                  )}
                </>
              ) : (
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium border border-primary/20">
                  {product.category.nameEn}
                </span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "colors",
        header: "Colors",
        cell: ({ row }) => {
          const product = row.original;
          return <Color product={product} />;
        },
      },
      {
        accessorKey: "sizes",
        header: "Sizes",
        cell: ({ row }) => {
          const product = row.original;
          return <Size product={product} />;
        },
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
          const product = row.original;
          return <Price product={product} />;
        },
      },
      {
        accessorKey: "totalStock",
        header: () => <div className="text-right">Stock</div>,
        cell: ({ row }) => {
          const product = row.original;
          return <Stock product={product} />;
        },
      },
      {
        accessorKey: "stockStatus",
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => {
          const product = row.original;
          return <StockStatus product={product} />;
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => {
          const product = row.original;
          return <span className="text-sm">{formatDate(product.createdAt)}</span>;
        },
      },
    ],
    [],
  );

  const actionsConfig: ActionsConfig<Product> = useMemo(
    () => ({
      onEdit: (product) => onEditProduct(product),
      onDelete: (product) => onDeleteProduct(product),
    }),
    [onEditProduct, onDeleteProduct],
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
          columnKey: "search",
          placeholder: "Search product by name...",
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
