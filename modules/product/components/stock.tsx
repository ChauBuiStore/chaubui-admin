"use client";

import { ColumnDef } from "@tanstack/react-table";

import { XTable } from "@/components/common/x-table";
import { PAGINATION_CONSTANTS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils/currency.utils";
import { Product, ProductVariant } from "@/modules/product/types";

interface StockProps {
  product: Product;
}

export function Stock({ product }: StockProps) {
  const columns: ColumnDef<ProductVariant>[] = [
    {
      accessorKey: "color",
      header: "Color",
      cell: ({ row }) => {
        const v = row.original as ProductVariant;
        return v.color ? (
          <div className="flex items-center gap-2">
            <div
              className="w-3.5 h-3.5 rounded-full border"
              style={{ backgroundColor: v.color.code }}
            />
            <span className="text-sm">{v.color.nameEn}</span>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        );
      },
    },
    {
      accessorKey: "size",
      header: "Size",
      cell: ({ row }) => {
        const v = row.original as ProductVariant;
        return v.size?.nameEn ? (
          <span className="px-2 py-0.5 text-xs rounded border bg-muted">{v.size.nameEn}</span>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        );
      },
    },
    {
      accessorKey: "salePrice",
      header: () => <div className="text-right">Sale Price</div>,
      cell: ({ row }) => {
        const v = row.original as ProductVariant;
        return <div className="text-right">{formatPrice(v.salePrice)}</div>;
      },
    },
    {
      accessorKey: "originalPrice",
      header: () => <div className="text-right">Original Price</div>,
      cell: ({ row }) => {
        const v = row.original as ProductVariant;
        return v.originalPrice && v.originalPrice !== v.salePrice ? (
          <div className="text-right text-muted-foreground line-through text-sm">
            {formatPrice(v.originalPrice)}
          </div>
        ) : (
          <div className="text-right text-muted-foreground text-sm">—</div>
        );
      },
    },
    {
      id: "discount",
      header: () => <div className="text-right">Discount</div>,
      cell: ({ row }) => {
        const v = row.original as ProductVariant;
        const original = parseFloat(String(v.originalPrice || 0));
        const sale = parseFloat(String(v.salePrice || 0));
        const discount =
          v.discountPercent ||
          (original > sale ? Math.round(((original - sale) / original) * 100) : 0);
        return (
          <div className="text-right">
            {discount > 0 ? (
              <span className="text-primary font-medium">-{discount}%</span>
            ) : (
              <span className="text-muted-foreground">0%</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "stock",
      header: () => <div className="text-right">Stock</div>,
      cell: ({ row }) => {
        const v = row.original as ProductVariant;
        return (
          <div className="text-right">
            <span className={v.stock > 0 ? "text-primary" : "text-destructive"}>{v.stock}</span>
          </div>
        );
      },
    },
  ];

  return (
    <XTable<ProductVariant>
      data={product.variants as ProductVariant[]}
      columns={columns}
      enableSelection={false}
      enableActions={false}
      pageSize={PAGINATION_CONSTANTS.LIMIT}
      showFooter={false}
    />
  );
}
