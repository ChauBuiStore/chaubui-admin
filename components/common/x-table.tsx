"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSearchParams } from "@/lib/hooks";
import { PaginationMeta } from "@/lib/types/pagination";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  FilterFnOption,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  RowSelectionState,
  Table as TanStackTable,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
  Trash2,
} from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { XFilter } from "./x-filter";

interface PaginationControlsProps<T> {
  table: TanStackTable<T>;
  onBulkDelete?: (selectedRows: T[]) => void;
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

interface TableHeaderProps<T> {
  table: TanStackTable<T>;
}

interface TableBodyProps<T> {
  table: TanStackTable<T>;
  columns: ColumnDef<T>[];
  emptyStateMessage?: string;
  loading?: boolean;
}

const SelectAllCheckbox = <T,>({
  table,
}: {
  table: TanStackTable<T>;
  canSelectRow?: (row: T) => boolean;
}) => {
  const checkboxRef = useRef<HTMLButtonElement>(null);
  const isSomeRowsSelected = table.getIsSomeRowsSelected();

  useEffect(() => {
    if (checkboxRef.current) {
      (
        checkboxRef.current as HTMLButtonElement & { indeterminate?: boolean }
      ).indeterminate = isSomeRowsSelected;
    }
  }, [isSomeRowsSelected]);

  return (
    <div className="flex items-center justify-center">
      <Checkbox
        ref={checkboxRef}
        checked={table.getIsAllRowsSelected()}
        onCheckedChange={(value) => {
          if (value) {
            table.toggleAllRowsSelected(true);
          } else {
            table.toggleAllRowsSelected(false);
          }
        }}
        aria-label="Select all"
      />
    </div>
  );
};

const createSelectColumn = <T,>(
  canSelectRow?: (row: T) => boolean
): ColumnDef<T> => ({
  id: "select",
  header: ({ table }) => (
    <SelectAllCheckbox table={table} canSelectRow={canSelectRow} />
  ),
  cell: ({ row }) => {
    const canSelect = !canSelectRow || canSelectRow(row.original);

    if (!canSelect) {
      return <></>;
    }

    return (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    );
  },
  enableSorting: false,
  enableHiding: false,
});

interface ActionItem<T> {
  label: string;
  onClick: (row: T) => void;
  variant?: "default" | "destructive";
  icon?: React.ReactNode;
  disabled?: (row: T) => boolean;
  hidden?: (row: T) => boolean;
}

export interface ActionsConfig<T> {
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  customActions?: ActionItem<T>[];
}

export interface SearchConfig {
  enabled?: boolean;
  columnKey: string;
  placeholder?: string;
  className?: string;
}

export interface FilterOption {
  key: string;
  label: string;
  value: string;
  type: "select" | "input" | "checkbox" | "radio";
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface FilterConfig {
  enabled?: boolean;
  filters: FilterOption[];
  search?: SearchConfig;
  triggerText?: string;
}

const createActionsColumn = <T,>(config?: ActionsConfig<T>): ColumnDef<T> => ({
  id: "actions",
  cell: ({ row }) => {
    const { onEdit, onDelete, customActions = [] } = config || {};

    const actions: ActionItem<T>[] = [];

    if (onEdit) {
      actions.push({
        label: "Edit",
        onClick: onEdit,
      });
    }

    actions.push(...customActions);

    if (onDelete) {
      actions.push({
        label: "Delete",
        onClick: onDelete,
        variant: "destructive",
      });
    }

    if (actions.length === 0) {
      return null;
    }

    return (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <MoreVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            {actions.map((action, index) => {
              const isDisabled = action.disabled?.(row.original) || false;
              const isHidden = action.hidden?.(row.original) || false;

              if (isHidden) {
                return null;
              }

              return (
                <div key={`${action.label}-${index}`}>
                  <DropdownMenuItem
                    onClick={() => !isDisabled && action.onClick(row.original)}
                    disabled={isDisabled}
                    variant={action.variant}
                    className="flex items-center gap-2"
                  >
                    {action.icon}
                    {action.label}
                  </DropdownMenuItem>
                </div>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  },
});

const PaginationControls = <T,>({
  table,
  onBulkDelete,
  pagination,
  onPageChange,
  onPageSizeChange,
}: PaginationControlsProps<T>) => {
  const pageSizes = [10, 20, 30, 40, 50];

  const currentPage = pagination
    ? pagination.page
    : (table.getState().pagination?.pageIndex || 0) + 1;
  const totalPages = pagination
    ? pagination.totalPages || Math.ceil(pagination.total / pagination.limit)
    : table.getPageCount();
  const selectedRows = table.getFilteredSelectedRowModel().rows.length;
  const totalRows = pagination
    ? pagination.total
    : table.getFilteredRowModel().rows.length;

  const handlePageSizeChange = useCallback(
    (value: string) => {
      try {
        const newPageSize = Number(value);
        if (newPageSize > 0 && newPageSize <= 100) {
          if (onPageSizeChange) {
            onPageSizeChange(newPageSize);
          } else {
            table.setPageSize(newPageSize);
          }
        }
      } catch { }
    },
    [table, onPageSizeChange]
  );

  const handleFirstPage = useCallback(() => {
    if (onPageChange) {
      onPageChange(1);
    } else if (table.getCanPreviousPage()) {
      table.setPageIndex(0);
    }
  }, [table, onPageChange]);

  const handlePreviousPage = useCallback(() => {
    if (onPageChange) {
      onPageChange(currentPage - 1);
    } else if (table.getCanPreviousPage()) {
      table.previousPage();
    }
  }, [table, onPageChange, currentPage]);

  const handleNextPage = useCallback(() => {
    if (onPageChange) {
      onPageChange(currentPage + 1);
    } else if (table.getCanNextPage()) {
      table.nextPage();
    }
  }, [table, onPageChange, currentPage]);

  const handleLastPage = useCallback(() => {
    if (onPageChange) {
      onPageChange(totalPages);
    } else if (table.getCanNextPage()) {
      table.setPageIndex(totalPages - 1);
    }
  }, [table, onPageChange, totalPages]);

  const canPreviousPage = pagination
    ? currentPage > 1
    : table.getCanPreviousPage();
  const canNextPage = pagination
    ? currentPage < totalPages
    : table.getCanNextPage();

  return (
    <div
      className="flex items-center justify-between px-4"
      role="navigation"
      aria-label="Table pagination"
    >
      <BulkDeleteButton table={table} onBulkDelete={onBulkDelete} />
      <div className="text-muted-foreground flex-1 text-sm">
        {selectedRows} of {totalRows} row(s) selected.
      </div>
      <div className="flex w-full items-center gap-8 lg:w-fit">
        <div className="flex items-center gap-2">
          <Label htmlFor="rows-per-page" className="text-sm font-medium">
            Rows per page
          </Label>
          <Select
            value={`${pagination
              ? pagination.limit
              : table.getState().pagination?.pageSize || pageSizes[0]
              }`}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
              <SelectValue
                placeholder={
                  pagination
                    ? pagination.limit
                    : table.getState().pagination?.pageSize || pageSizes[0]
                }
              />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizes.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div
          className="flex w-fit items-center justify-center text-sm font-medium"
          aria-live="polite"
        >
          Page {currentPage} of {totalPages}
        </div>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={handleFirstPage}
            disabled={!canPreviousPage}
            aria-label="Go to first page"
            title="Go to first page"
          >
            <ChevronsLeft />
          </Button>

          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={handlePreviousPage}
            disabled={!canPreviousPage}
            aria-label="Go to previous page"
            title="Go to previous page"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={handleNextPage}
            disabled={!canNextPage}
            aria-label="Go to next page"
            title="Go to next page"
          >
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={handleLastPage}
            disabled={!canNextPage}
            aria-label="Go to last page"
            title="Go to last page"
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

interface BulkDeleteButtonProps<T> {
  table: TanStackTable<T>;
  onBulkDelete?: (selectedRows: T[]) => void;
}

const BulkDeleteButton = <T,>({
  table,
  onBulkDelete,
}: BulkDeleteButtonProps<T>) => {
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const hasSelectedRows = selectedRows.length > 0;

  if (!hasSelectedRows || !onBulkDelete) {
    return null;
  }

  const handleBulkDelete = () => {
    const selectedData = selectedRows.map((row) => row.original);
    onBulkDelete(selectedData);
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleBulkDelete}
      className="flex items-center mr-4 ml-0"
    >
      <Trash2 className="h-4 w-4" />
      Xóa ({selectedRows.length})
    </Button>
  );
};

const XTableHeader = <T,>({ table }: TableHeaderProps<T>) => {
  return (
    <TableHeader className="bg-muted sticky top-0 z-10">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead
                key={header.id}
                colSpan={header.colSpan}
                scope="col"
                className="text-left font-medium"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
};

const XTableBody = <T,>({
  table,
  columns,
  loading = false,
}: TableBodyProps<T>) => {
  const rows = table.getRowModel().rows;

  return (
    <TableBody className="**:data-[slot=table-cell]:first:w-8">
      {loading ? (
        <TableRow>
          <TableCell
            colSpan={columns.length}
            className="h-24 text-center"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
              Đang tải...
            </div>
          </TableCell>
        </TableRow>
      ) : rows?.length ? (
        rows.map((row) => (
          <TableRow
            key={row.id}
            className={row.getIsSelected() ? "bg-muted/50" : ""}
            aria-selected={row.getIsSelected()}
          >
            {row.getVisibleCells().map((cell, cellIndex) => (
              <TableCell
                key={cell.id}
                className={cellIndex === 0 ? "font-medium" : ""}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell
            colSpan={columns.length}
            className="h-24 text-center text-muted-foreground"
            role="status"
            aria-live="polite"
          >
            Không tìm thấy dữ liệu.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

interface XTableProps<T = Record<string, unknown>> {
  data: T[];
  columns: ColumnDef<T>[];
  enableSelection?: boolean;
  enableActions?: boolean;
  onBulkDelete?: (selectedRows: T[]) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  selectedRows?: T[];
  getRowId?: (row: T) => string;
  canSelectRow?: (row: T) => boolean;
  pageSize?: number;
  className?: string;
  loading?: boolean;
  actionsConfig?: ActionsConfig<T>;
  searchConfig?: SearchConfig;
  filterConfig?: FilterConfig;
  onSearchChange?: (searchTerm: string) => void;
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

const defaultGetRowId = <T,>(row: T): string => {
  const record = row as Record<string, unknown>;
  return record.id?.toString() || Math.random().toString();
};

const applyFilterFnToColumns = <T,>(
  columns: ColumnDef<T>[],
  filterConfig?: FilterConfig
): ColumnDef<T>[] => {
  if (!filterConfig?.filters) return columns;

  return columns.map((column) => {
    const columnKey =
      "accessorKey" in column ? (column.accessorKey as string) : undefined;
    if (!columnKey) return column;

    const filterOption = filterConfig.filters.find(
      (filter) => filter.key === columnKey
    );
    if (!filterOption) return column;

    let filterFn: FilterFnOption<T> | undefined;

    switch (filterOption.type) {
      case "checkbox":
        filterFn = "arrayIncludes" as FilterFnOption<T>;
        break;
      case "radio":
        filterFn = "exact" as FilterFnOption<T>;
        break;
      case "input":
        filterFn = "contains" as FilterFnOption<T>;
        break;
      case "select":
        filterFn = "exact" as FilterFnOption<T>;
        break;
      default:
        filterFn = "exact" as FilterFnOption<T>;
    }

    return {
      ...column,
      filterFn,
    };
  });
};

export function XTable<T = Record<string, unknown>>({
  data,
  columns,
  enableSelection = false,
  enableActions = true,
  onBulkDelete,
  onSelectionChange,
  selectedRows: externalSelectedRows,
  getRowId = defaultGetRowId,
  canSelectRow,
  pageSize = 10,
  className = "",
  loading = false,
  actionsConfig,
  searchConfig,
  filterConfig,
  onSearchChange,
  pagination: serverPagination,
  onPageChange,
  onPageSizeChange,
}: XTableProps<T>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: serverPagination ? serverPagination.limit : pageSize,
  });

  const { filters: urlFilters, setFilter } = useSearchParams();

  const columnFilters: ColumnFiltersState = useMemo(() => {
    const availableColumnKeys = columns
      .map((col) =>
        "accessorKey" in col ? (col.accessorKey as string) : undefined
      )
      .filter(Boolean);

    return Object.entries(urlFilters)
      .filter(([key]) => availableColumnKeys.includes(key))
      .map(([key, value]) => ({
        id: key,
        value: value,
      }));
  }, [urlFilters, columns]);

  const isExternalUpdate = useRef(false);
  const lastExternalSelection = useRef<T[] | undefined>(undefined);

  const finalColumns: ColumnDef<T>[] = useMemo(() => {
    const actionsColumn = enableActions
      ? createActionsColumn<T>(actionsConfig)
      : null;

    const columnsWithFilterFn = applyFilterFnToColumns(columns, filterConfig);

    const baseColumns = [
      ...(enableSelection ? [createSelectColumn<T>(canSelectRow)] : []),
      ...columnsWithFilterFn,
    ];

    if (actionsColumn) {
      baseColumns.push(actionsColumn);
    }

    return baseColumns;
  }, [
    enableSelection,
    enableActions,
    columns,
    actionsConfig,
    filterConfig,
    canSelectRow,
  ]);

  const memoizedGetRowId = useCallback(getRowId, [getRowId]);

  useEffect(() => {
    if (
      externalSelectedRows &&
      externalSelectedRows !== lastExternalSelection.current
    ) {
      isExternalUpdate.current = true;
      lastExternalSelection.current = externalSelectedRows;

      const selectedRowIds: RowSelectionState = {};
      externalSelectedRows.forEach((row) => {
        const rowId = memoizedGetRowId(row);
        selectedRowIds[rowId] = true;
      });

      setRowSelection(selectedRowIds);

      setTimeout(() => {
        isExternalUpdate.current = false;
      }, 0);
    }
  }, [externalSelectedRows, memoizedGetRowId]);

  const handleRowSelectionChange = useCallback(
    (
      updaterOrValue:
        | RowSelectionState
        | ((old: RowSelectionState) => RowSelectionState)
    ) => {
      const newRowSelection =
        typeof updaterOrValue === "function"
          ? updaterOrValue(rowSelection)
          : updaterOrValue;

      setRowSelection(newRowSelection);

      if (onSelectionChange && !isExternalUpdate.current) {
        const newSelectedRows = data.filter((row) => {
          const rowId = memoizedGetRowId(row);
          return newRowSelection[rowId];
        });
        onSelectionChange(newSelectedRows);
      }
    },
    [rowSelection, onSelectionChange, data, memoizedGetRowId]
  );

  const table = useReactTable({
    data,
    columns: finalColumns,
    state: {
      rowSelection,
      columnFilters,
      ...(serverPagination ? {} : { pagination }),
    },
    getRowId: memoizedGetRowId,
    enableRowSelection: enableSelection,
    onRowSelectionChange: handleRowSelectionChange,
    onColumnFiltersChange: () => { },
    onPaginationChange: serverPagination ? undefined : setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: serverPagination
      ? undefined
      : getPaginationRowModel(),
    ...(serverPagination
      ? {
        pageCount:
          serverPagination.totalPages ||
          Math.ceil(
            (serverPagination.total || 0) / (serverPagination.limit || 10)
          ),
        manualPagination: true,
      }
      : {}),
    filterFns: {
      exact: ((row, columnId, value) => {
        try {
          const cellValue = row.getValue(columnId);
          return cellValue === value;
        } catch {
          return true;
        }
      }) as FilterFn<unknown>,
      arrayIncludes: ((row, columnId, filterValue) => {
        try {
          const cellValue = row.getValue(columnId) as string;
          if (Array.isArray(filterValue)) {
            return filterValue.length === 0 || filterValue.includes(cellValue);
          }
          return cellValue === filterValue;
        } catch {
          return true;
        }
      }) as FilterFn<unknown>,
      contains: ((row, columnId, value) => {
        try {
          const cellValue = row.getValue(columnId) as string;
          if (!value) return true;
          return cellValue.toLowerCase().includes(value.toLowerCase());
        } catch {
          return true;
        }
      }) as FilterFn<unknown>,
    },
  });

  return (
    <div
      className={`${className} relative`}
      role="region"
      aria-label="Data table"
    >
      {(filterConfig?.enabled ||
        filterConfig?.search?.enabled ||
        searchConfig?.enabled) && (
          <div className="mb-4">
            <div className="inline-flex items-center">
              {filterConfig?.enabled ? (
                <XFilter
                  filters={filterConfig?.filters || []}
                  triggerText={filterConfig?.triggerText || "Advanced Search"}
                  filterValues={urlFilters as Record<string, string | string[]>}
                  setFilter={setFilter}
                  clearFilters={() => {
                    Object.keys(urlFilters).forEach((key) => {
                      setFilter(key, "");
                    });
                  }}
                  searchConfig={filterConfig?.search || searchConfig}
                  onSearchChange={onSearchChange}
                />
              ) : (
                (filterConfig?.search?.enabled || searchConfig?.enabled) && (
                  <XFilter
                    filters={[]}
                    triggerText=""
                    filterValues={urlFilters as Record<string, string | string[]>}
                    setFilter={setFilter}
                    clearFilters={() => {
                      Object.keys(urlFilters).forEach((key) => {
                        setFilter(key, "");
                      });
                    }}
                    searchConfig={filterConfig?.search || searchConfig}
                    onSearchChange={onSearchChange}
                  />
                )
              )}
            </div>
          </div>
        )}
      <Table className="mb-4">
        <XTableHeader table={table} />
        <XTableBody table={table} columns={finalColumns} loading={loading} />
      </Table>
      {data.length > 0 && (
        <PaginationControls
          table={table}
          onBulkDelete={onBulkDelete}
          pagination={serverPagination}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
}
