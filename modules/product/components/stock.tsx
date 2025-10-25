"use client";

import { AlertCircle, Info } from "lucide-react";

import { XButton, XPopover } from "@/components/common";
import { formatPrice } from "@/lib/utils/currency.utils";
import { Color } from "@/modules/color/types/color.type";
import { Product, ProductVariant } from "@/modules/product/types";

interface StockProps {
  product: Product;
}

export function Stock({ product }: StockProps) {
  const totalStock =
    product.variants && product.variants.length > 0
      ? product.variants.reduce((sum, variant) => sum + variant.stock, 0)
      : product.stock || 0;

  const hasVariants = product.variants && product.variants.length > 0;

  return (
    <div className="text-right">
      <div className="flex items-center justify-end gap-2">
        <span className={`font-medium ${totalStock > 0 ? "text-primary" : "text-destructive"}`}>
          {totalStock}
        </span>
        {hasVariants && (
          <XPopover
            trigger={
              <XButton
                variant="ghost"
                className="w-0 h-0 hover:opacity-70 transition-opacity"
                title="View variant details"
              >
                {totalStock > 0 ? (
                  <Info className="w-4 h-4 text-primary" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-destructive" />
                )}
              </XButton>
            }
            align="start"
            contentClassName="w-72 p-3"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <h4 className="font-semibold text-sm">{product.name}</h4>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {product.variants && product.variants.length > 0 ? (
                  (() => {
                    const groupedByColor = product.variants.reduce(
                      (acc, variant) => {
                        const colorKey = variant.color?.id || "no-color";
                        if (!acc[colorKey]) {
                          acc[colorKey] = {
                            color: variant.color || null,
                            variants: [],
                            totalStock: 0,
                          };
                        }
                        acc[colorKey].variants.push(variant);
                        acc[colorKey].totalStock += variant.stock;
                        return acc;
                      },
                      {} as Record<
                        string,
                        { color: Color | null; variants: ProductVariant[]; totalStock: number }
                      >,
                    );

                    return Object.values(groupedByColor).map((colorGroup, groupIndex) => (
                      <div key={groupIndex} className="border rounded-lg overflow-hidden">
                        <div
                          className={`px-3 py-2 flex items-center justify-between ${colorGroup.totalStock > 0 ? "bg-muted" : "bg-destructive/10"}`}
                        >
                          <div className="flex items-center gap-2">
                            {colorGroup.color ? (
                              <>
                                <div
                                  className={`w-4 h-4 rounded-full border ${colorGroup.totalStock > 0 ? "" : "opacity-60"}`}
                                  style={{ backgroundColor: colorGroup.color.code }}
                                />
                                <span
                                  className={`font-medium text-sm ${colorGroup.totalStock > 0 ? "text-foreground" : "text-destructive"}`}
                                >
                                  {colorGroup.color.nameEn}
                                </span>
                              </>
                            ) : (
                              <span className="font-medium text-sm text-muted-foreground">
                                No Color
                              </span>
                            )}
                          </div>
                          <div className="text-sm">
                            <span
                              className={`font-medium ${colorGroup.totalStock > 0 ? "text-primary" : "text-destructive"}`}
                            >
                              {colorGroup.totalStock} pcs
                            </span>
                          </div>
                        </div>

                        <div className="divide-y">
                          {colorGroup.variants.map((variant, variantIndex) => (
                            <div
                              key={variantIndex}
                              className={`px-3 py-2 flex items-center justify-between text-sm ${variant.stock === 0 ? "bg-destructive/5 opacity-75" : ""}`}
                            >
                              <div className="flex items-center gap-2">
                                {variant.size?.nameEn && (
                                  <span
                                    className={`px-2 py-0.5 text-xs rounded border ${
                                      variant.stock > 0
                                        ? "bg-primary/10 text-primary border-primary/20"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    {variant.size.nameEn}
                                  </span>
                                )}
                                {(() => {
                                  const original = parseFloat(String(variant.originalPrice || 0));
                                  const sale = parseFloat(String(variant.salePrice || 0));
                                  const discount =
                                    variant.discountPercent ||
                                    (original > sale
                                      ? Math.round(((original - sale) / original) * 100)
                                      : 0);

                                  return (
                                    discount > 0 && (
                                      <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded">
                                        -{discount}%
                                      </span>
                                    )
                                  );
                                })()}
                              </div>
                              <div className="flex flex-col items-end gap-0.5 text-right">
                                <div
                                  className={`text-sm font-medium ${
                                    variant.originalPrice &&
                                    variant.originalPrice !== variant.salePrice
                                      ? "text-destructive"
                                      : ""
                                  } ${variant.stock === 0 ? "text-muted-foreground" : ""}`}
                                >
                                  {formatPrice(variant.salePrice)}
                                </div>
                                {variant.originalPrice &&
                                  variant.originalPrice !== variant.salePrice && (
                                    <div className="text-xs text-muted-foreground line-through">
                                      {formatPrice(variant.originalPrice)}
                                    </div>
                                  )}
                                <div
                                  className={`text-xs px-2 py-0.5 rounded ${
                                    variant.stock > 0
                                      ? "bg-primary/10 text-primary"
                                      : "bg-destructive/10 text-destructive"
                                  }`}
                                >
                                  {variant.stock} pcs
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ));
                  })()
                ) : (
                  <div className="text-center py-4 space-y-2">
                    <p className="text-xs text-muted-foreground">No variants</p>
                    <div className="flex items-center justify-between px-4 py-2 bg-muted rounded-lg">
                      <span className="text-sm font-medium">Product Stock:</span>
                      <span
                        className={`text-sm font-bold ${product.stock > 0 ? "text-primary" : "text-destructive"}`}
                      >
                        {product.stock || 0} pcs
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t pt-2 flex justify-between items-center text-sm">
                <span className="font-medium">Total Stock:</span>
                <span
                  className={`font-bold ${totalStock > 0 ? "text-primary" : "text-destructive"}`}
                >
                  {totalStock} products
                </span>
              </div>
            </div>
          </XPopover>
        )}
      </div>
    </div>
  );
}
