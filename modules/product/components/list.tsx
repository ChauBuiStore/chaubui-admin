"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { useMemo, useState } from "react";

import { ActionsConfig, XTable } from "@/components/common/x-table";
import { PaginationMeta } from "@/lib/types";
import { formatDate } from "@/lib/utils/date.ultis";
import { Product } from "@/modules/product/types";

import { Price } from "./price";
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

          if (!product.thumbnailUrl) {
            return (
              <div className="w-[80px] h-[80px] bg-muted rounded-md flex items-center justify-center">
                <span className="text-muted-foreground text-xs">No Image</span>
              </div>
            );
          }

          return (
            <Image
              src={product.thumbnailUrl}
              alt={product.name || "Product Image"}
              width={80}
              height={80}
              className="rounded-md object-cover h-20"
            />
          );
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
          const total =
            Array.isArray(product.variants) && product.variants.length > 0
              ? product.variants.reduce((sum, v) => sum + (v?.stock || 0), 0)
              : product.stock || 0;
          return <span className="text-right block">{total}</span>;
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
        renderExpanded={(row) => <Stock product={row.original} />}
        getRowCanExpand={(row) =>
          Array.isArray((row.original as Product).variants) &&
          (row.original as Product).variants!.length > 0
        }
        searchConfig={{
          enabled: true,
          columnKey: "search",
          placeholder: "Search product by name...",
        }}
        onSearchChange={onSearchChange}
      />
    </>
  );
}
