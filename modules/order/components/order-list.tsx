import { ColumnDef, FilterFnOption } from "@tanstack/react-table";
import { EyeIcon, XCircleIcon } from "lucide-react";

import { XBadge } from "@/components/common";
import { XTable } from "@/components/common/x-table";
import { PaginationMeta } from "@/lib/types";
import { formatVND } from "@/lib/utils/currency.utils";

import { statusColor, statusLabel } from "../constants/order.constant";
import { Order } from "../types/order.type";

interface OrdersListProps {
  data: Order[];
  loading?: boolean;
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onSearchChange?: (value: string) => void;
  onViewDetail: (order: Order) => void;
  onCancel: (order: Order) => void;
}

export function OrdersList({
  data,
  loading,
  pagination,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  onViewDetail,
  onCancel,
}: OrdersListProps) {
  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "orderId",
      header: "Order ID",
      cell: ({ row }) => <>{row.original.orderId}</>,
    },
    {
      accessorKey: "fullName",
      header: "Customer",
      cell: ({ row }) => <>{row.original.fullName}</>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => <>{row.original.phone}</>,
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => <>{row.original.address}</>,
    },
    {
      accessorKey: "items",
      header: "Products",
      cell: ({ row }) => {
        const items = row.original.items || [];
        if (items.length === 0) {
          return <>{"-"}</>;
        }

        const firstItem = items[0];
        const firstProduct = firstItem?.product;
        const productName = firstProduct?.nameVi || firstProduct?.nameEn || "N/A";
        const totalItems = items.length;

        return (
          <div className="flex flex-col">
            <span className="font-medium">{productName}</span>
            {totalItems > 1 && (
              <span className="text-xs text-muted-foreground">
                + {totalItems - 1} more products
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => {
        const items = row.original.items || [];
        const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
        return <span className="font-medium">{totalQuantity}</span>;
      },
    },
    {
      accessorKey: "totalAmount",
      header: "Total",
      cell: ({ row }) => <span>{formatVND(row.original.totalAmount)}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <XBadge variant={statusColor[row.original.status]}>
          {statusLabel[row.original.status]}
        </XBadge>
      ),
      filterFn: "exact" as FilterFnOption<Order>,
    },
    {
      accessorKey: "createdAt",
      header: "Created at",
      cell: ({ row }) => {
        const d = new Date(row.original.createdAt);
        return <span>{d.toLocaleString("en-US")}</span>;
      },
    },
  ];

  return (
    <XTable<Order>
      data={data}
      columns={columns}
      loading={loading}
      pagination={pagination}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      searchConfig={{ enabled: true, columnKey: "fullName", placeholder: "Search by customer..." }}
      onSearchChange={onSearchChange}
      actionsConfig={{
        customActions: [
          {
            label: "View details",
            onClick: onViewDetail,
            icon: <EyeIcon className="h-4 w-4" />,
          },
          {
            label: "Cancel order",
            onClick: onCancel,
            icon: <XCircleIcon className="h-4 w-4" />,
            disabled: (row) => {
              const cancellableStatuses: Order["status"][] = [
                "PENDING_CONFIRMATION",
                "IN_PRODUCTION",
                "SHIPPING",
              ];
              return !cancellableStatuses.includes(row.status);
            },
          },
        ],
      }}
    />
  );
}
