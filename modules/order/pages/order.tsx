"use client";

import { ShoppingCartIcon } from "lucide-react";
import { useCallback } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";

import { OrdersList } from "../components/order-list";
import { useOrder } from "../hooks/use-order";
import { CancelOrder } from "../modals/cancel";
import { OrderDetail } from "../modals/detail";
import { OrderStatus } from "../types/order.type";

const ORDER_TABS: { key: OrderStatus; label: string }[] = [
  { key: "NEW", label: "New" },
  { key: "PENDING_CONFIRMATION", label: "Pending confirmation" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "IN_PRODUCTION", label: "In production" },
  { key: "SHIPPING", label: "Shipping" },
  { key: "COMPLETED", label: "Completed" },
  { key: "CANCELLED", label: "Cancelled" },
];

export function OrdersPage() {
  const {
    orders,
    pagination,
    isLoading,
    isLoadingDetail,
    isSubmitting,
    selectedOrder,
    showDetail,
    setShowDetail,
    showCancel,
    setShowCancel,
    handleViewDetail,
    handleCancelOrder,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleStatusChange,
    updateStatus,
    currentStatus,
  } = useOrder();

  const onSubmitCancel = useCallback(
    async (data: { status: OrderStatus; reason: string }) => {
      if (!selectedOrder) return;
      await updateStatus(selectedOrder.id, { status: data.status, reason: data.reason });
      setShowCancel(false);
    },
    [selectedOrder, updateStatus, setShowCancel],
  );

  const onSubmitChangeStatus = useCallback(
    async (data: { status: OrderStatus; reason?: string }) => {
      if (!selectedOrder) return;
      await updateStatus(selectedOrder.id, { status: data.status, reason: data.reason });
      setShowDetail(false);
    },
    [selectedOrder, updateStatus, setShowDetail],
  );

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl">
            <ShoppingCartIcon className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Order Management</h1>
        </div>
      </div>

      <Tabs
        value={currentStatus}
        className="w-full"
        onValueChange={(v) => handleStatusChange(v as OrderStatus)}
      >
        <TabsList className="grid grid-cols-3 md:grid-cols-7 w-full mb-4">
          {ORDER_TABS.map((t) => (
            <TabsTrigger key={t.key} value={t.key}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {ORDER_TABS.map((t) => (
          <TabsContent key={t.key} value={t.key}>
            <OrdersList
              data={orders}
              loading={isLoading}
              pagination={pagination}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onSearchChange={handleSearchChange}
              onViewDetail={handleViewDetail}
              onCancel={handleCancelOrder}
            />
          </TabsContent>
        ))}
      </Tabs>

      <OrderDetail
        open={showDetail}
        onOpenChange={setShowDetail}
        order={selectedOrder}
        loading={isLoadingDetail}
        onSubmitChangeStatus={onSubmitChangeStatus}
      />
      <CancelOrder
        open={showCancel}
        onOpenChange={setShowCancel}
        order={selectedOrder}
        onSubmit={onSubmitCancel}
        loading={isSubmitting}
      />
    </>
  );
}
