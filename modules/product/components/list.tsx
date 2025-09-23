"use client";

import { ActionsConfig, XTable } from "@/components/common/x-table";
import { PaginationMeta } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Product } from "../types/product.type";
import { Colors } from "./colors";
import { Images } from "./images";
import { Sizes } from "./sizes";
import { Stock } from "./stock";
import { formatPrice } from "@/lib/utils/currency";

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

          if (!product.category) {
            return <span className="text-muted-foreground text-sm">N/A</span>;
          }

          return (
            <div className="flex items-center gap-1.5">
              {product.category.group ? (
                <>
                  <span className="px-2 py-0.5 bg-muted text-foreground/80 text-xs rounded font-medium">
                    {product.category.group.name}
                  </span>
                  {product.category.name && (
                    <>
                      <span className="text-muted-foreground">›</span>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded font-medium border border-primary/20">
                        {product.category.name}
                      </span>
                    </>
                  )}
                </>
              ) : (
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded font-medium border border-primary/20">
                  {product.category.name}
                </span>
              )}
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
              {formatPrice(product.price)}
            </span>
          );
        },
      },
      {
        accessorKey: "colors",
        header: "Colors",
        cell: ({ row }) => {
          const product = row.original;
          return <Colors product={product} />;
        },
      },
      {
        accessorKey: "sizes",
        header: "Sizes",
        cell: ({ row }) => {
          const product = row.original;
          return <Sizes product={product} />;
        },
      },
      {
        accessorKey: "totalStock",
        header: () => <div className="text-right">Total Stock</div>,
        cell: ({ row }) => {
          const product = row.original;
          return <Stock product={product} />;
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
          columnKey: "search",
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
