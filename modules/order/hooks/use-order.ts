import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams as useNextSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { PAGINATION_CONSTANTS, QUERY_KEYS } from "@/lib/constants";
import { ORDER_MESSAGES } from "@/lib/constants/message.constants";
import { useSearchParams, useToast } from "@/lib/hooks";
import { orderService } from "@/lib/services/order-service";
import { PaginationMeta } from "@/lib/types";

import { Order, OrderStatus, UpdateOrderStatusRequest } from "../types/order.type";

export function useOrder() {
  const queryClient = useQueryClient();
  const searchParams = useNextSearchParams();
  const { filters, setFilter } = useSearchParams({
    search: undefined,
    status: "NEW",
  });
  const { toast } = useToast();

  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>(undefined);
  const [showDetail, setShowDetail] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showChangeStatus, setShowChangeStatus] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<OrderStatus | undefined>(undefined);
  const [viewOrderId, setViewOrderId] = useState<string | null>(null);

  const {
    data: ordersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.ORDERS, filters],
    queryFn: () => orderService.getOrders(filters),
  });

  if (error) {
    toast((error as Error).message, { type: "error" });
  }

  const {
    data: orderDetailData,
    isLoading: isLoadingDetail,
    error: orderDetailError,
  } = useQuery({
    queryKey: [QUERY_KEYS.ORDER_BY_ID, viewOrderId],
    queryFn: () => orderService.getOrderById(viewOrderId!),
    enabled: !!viewOrderId,
  });

  useEffect(() => {
    if (orderDetailData?.data) {
      setSelectedOrder(orderDetailData.data);
    }
  }, [orderDetailData]);

  useEffect(() => {
    if (orderDetailError) {
      toast((orderDetailError as Error).message, { type: "error" });
    }
  }, [orderDetailError, toast]);

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateOrderStatusRequest }) =>
      orderService.updateStatus(id, payload),
    onSuccess: (_data: unknown, variables: { id: string; payload: UpdateOrderStatusRequest }) => {
      toast(ORDER_MESSAGES.STATUS_UPDATED, { type: "success" });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDER_BY_ID, variables.id] });
    },
    onError: () => {
      toast(ORDER_MESSAGES.STATUS_UPDATE_FAILED, { type: "error" });
    },
  });

  const handleViewDetail = useCallback((order: Order) => {
    setSelectedOrder(order);
    setViewOrderId(order.id);
    setShowDetail(true);
  }, []);

  const handleCloseDetail = useCallback((open: boolean) => {
    setShowDetail(open);
    if (!open) {
      setTimeout(() => {
        setSelectedOrder(undefined);
        setViewOrderId(null);
      }, 300);
    }
  }, []);

  const handleCancelOrder = useCallback((order: Order) => {
    setSelectedOrder(order);
    setShowCancel(true);
  }, []);

  const handleChangeStatus = useCallback((nextStatus?: OrderStatus) => {
    setDefaultStatus(nextStatus);
    setShowChangeStatus(true);
  }, []);

  const handleCloseChangeStatus = useCallback((open: boolean) => {
    setShowChangeStatus(open);
    if (!open) {
      setTimeout(() => {
        setDefaultStatus(undefined);
      }, 300);
    }
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      setFilter({
        page,
        limit: filters.limit || PAGINATION_CONSTANTS.LIMIT,
        search: filters.search || "",
        status: filters.status || "NEW",
      });
    },
    [setFilter, filters.limit, filters.search, filters.status],
  );

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      setFilter({
        limit: pageSize,
        page: PAGINATION_CONSTANTS.PAGE,
        search: filters.search || "",
        status: filters.status || "NEW",
      });
    },
    [setFilter, filters.search, filters.status],
  );

  const handleSearchChange = useCallback(
    (searchTerm: string) => {
      setFilter({
        search: searchTerm,
        page: PAGINATION_CONSTANTS.PAGE,
        limit: filters.limit || PAGINATION_CONSTANTS.LIMIT,
        status: filters.status || "NEW",
      });
    },
    [setFilter, filters.limit, filters.status],
  );

  const handleStatusChange = useCallback(
    (st: OrderStatus) => {
      setFilter({
        status: st,
        page: PAGINATION_CONSTANTS.PAGE,
        limit: filters.limit || PAGINATION_CONSTANTS.LIMIT,
        search: filters.search || "",
      });
    },
    [setFilter, filters.limit, filters.search],
  );

  const orders = ordersData?.data || [];
  const pagination: PaginationMeta | undefined = ordersData?.meta;
  const isSubmitting = updateStatusMutation.isPending;
  const updateStatus = (id: string, payload: UpdateOrderStatusRequest) =>
    updateStatusMutation.mutateAsync({ id, payload });

  const statusFromUrl = searchParams.get("status");
  const currentStatus: OrderStatus =
    (statusFromUrl as OrderStatus) || (filters.status as OrderStatus) || "NEW";

  return {
    orders,
    pagination,
    isLoading,
    isLoadingDetail,
    isSubmitting,
    selectedOrder,
    showDetail,
    setShowDetail: handleCloseDetail,
    showCancel,
    setShowCancel,
    showChangeStatus,
    setShowChangeStatus: handleCloseChangeStatus,
    defaultStatus,
    currentStatus,
    handleViewDetail,
    handleCancelOrder,
    handleChangeStatus,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleStatusChange,
    updateStatus,
  };
}
