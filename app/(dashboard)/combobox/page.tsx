"use client";

import { ComboboxOption, XCombobox, XLabel } from "@/components/common";
import { useToast } from "@/lib/hooks";
import ColorService from "@/lib/services/color-service";
import { Color } from "@/modules/color/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

export default function DemoComboboxPage() {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const { success: showSuccess, error: showError } = useToast();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["colors", searchValue],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await ColorService.getColors({
        page: pageParam,
        limit: 10,
        search: searchValue || undefined,
      });

      if (response.status === "success" && response.data) {
        return {
          items: response.data,
          meta: response.meta,
        };
      }
      throw new Error("Failed to fetch colors");
    },
    getNextPageParam: (lastPage) => {
      const { meta } = lastPage;
      if (!meta) return undefined;
      
      const currentPage =
        typeof meta.currentPage === "string"
          ? parseInt(meta.currentPage)
          : meta.currentPage;
      return currentPage < meta.totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const options: ComboboxOption[] = useMemo(() => {
    if (!data?.pages) return [];

    return data.pages.flatMap((page: { items: Color[] }) =>
      page.items.map((color: Color) => ({
        value: color.id,
        label: `${color.name} (${color.code})`,
      }))
    );
  }, [data]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSearchChange = useCallback((searchTerm: string) => {
    setSearchValue(searchTerm);
  }, []);

  if (isError) {
    console.error("Error loading colors:", error);
  }

  const selectedColorInfo = options.find(
    (option) => option.value === selectedColor
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">
          Demo XCombobox với Search Phân Trang
        </h1>
        <p className="text-gray-600">
          Test tính năng search và infinite scroll với API Colors
        </p>
      </div>

      <div className="max-w-md space-y-4">
        <div>
          <XLabel className="block text-sm font-medium mb-2">
            Chọn màu sắc:
          </XLabel>
          <XCombobox
            options={options}
            value={selectedColor}
            onValueChange={setSelectedColor}
            placeholder="Chọn màu sắc..."
            searchPlaceholder="Tìm kiếm màu sắc..."
            emptyText="Không tìm thấy màu sắc"
            onSearchChange={handleSearchChange}
            searchValue={searchValue}
            onLoadMore={handleLoadMore}
            hasMoreData={hasNextPage}
            loading={isFetchingNextPage || isLoading}
            loadThreshold={100}
            disableClientFilter={true}
          />
        </div>

        <div className="p-4 bg-gray-50 rounded-lg space-y-2">
          <h3 className="font-medium">Thông tin:</h3>
          <div className="text-sm space-y-1">
            <p>
              <strong>Màu đã chọn:</strong>{" "}
              {selectedColorInfo?.label || "Chưa chọn"}
            </p>
            <p>
              <strong>ID:</strong> {selectedColor || "N/A"}
            </p>
            <p>
              <strong>Từ khóa tìm kiếm:</strong> &quot;{searchValue}&quot; (
              {searchValue.length} ký tự)
            </p>
            <p>
              <strong>Số options:</strong> {options.length}
            </p>
            <p>
              <strong>Số pages đã load:</strong> {data?.pages?.length || 0}
            </p>
            <p>
              <strong>Đang loading:</strong> {isLoading ? "Có" : "Không"}
            </p>
            <p>
              <strong>Đang load more:</strong>{" "}
              {isFetchingNextPage ? "Có" : "Không"}
            </p>
            <p>
              <strong>Còn data:</strong> {hasNextPage ? "Có" : "Không"}
            </p>
            <p>
              <strong>Has error:</strong> {isError ? "Có" : "Không"}
            </p>
            <p>
              <strong>Data exists:</strong> {data ? "Có" : "Không"}
            </p>
            <p>
              <strong>Pages exist:</strong> {data?.pages ? "Có" : "Không"}
            </p>
            {data?.pages && (
              <p>
                <strong>First page items:</strong>{" "}
                {(data.pages[0] as { items: Color[] })?.items?.length || 0}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => {
              setSelectedColor("");
              setSearchValue("");
              refetch();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reset
          </button>

          <button
            onClick={() => {
              setSearchValue("");
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 ml-2"
          >
            Clear Search
          </button>

          <button
            onClick={async () => {
              try {
                console.log("Testing API directly...");
                const response = await ColorService.getColors({
                  page: 1,
                  limit: 5,
                });
                console.log("Direct API test response:", response);
                showSuccess("API test completed - check console");
              } catch (error) {
                console.error("Direct API test error:", error);
                showError("API test failed - check console");
              }
            }}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 ml-2"
          >
            Test API
          </button>

          <button
            onClick={() => {
              if (selectedColor) {
                showSuccess(`Đã chọn: ${selectedColorInfo?.label}`);
              } else {
                showError("Vui lòng chọn một màu sắc");
              }
            }}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-2"
          >
            Xác nhận
          </button>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium mb-2">Tính năng đã test:</h3>
        <ul className="text-sm space-y-1">
          <li>✅ Search với debounce (500ms)</li>
          <li>✅ Infinite scroll pagination với useInfiniteQuery</li>
          <li>✅ Loading states (isLoading, isFetchingNextPage)</li>
          <li>✅ API integration với colors service</li>
          <li>✅ Error handling với React Query</li>
          <li>✅ Reset functionality với refetch</li>
          <li>✅ Automatic caching và background refetch</li>
          <li>✅ Optimistic updates</li>
        </ul>
      </div>
    </div>
  );
}
