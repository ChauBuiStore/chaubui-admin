"use client";

import { XSelectPagination } from "@/components/common";
import { CategoryService } from "@/lib/services";
import { PaginatedResponse } from "@/lib/types";
import { Category } from "@/modules/categories/types/categories.type";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export default function DemoSelectPage() {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [selectedMultipleValues, setSelectedMultipleValues] = useState<
    string[]
  >([]);
  const itemsPerPage = 10;

  const getNextPageParam = (lastPage: PaginatedResponse<Category>) => {
    const { meta } = lastPage;
    return meta.page < (meta.totalPages || Math.ceil(meta.total / meta.limit))
      ? meta.page + 1
      : undefined;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery<PaginatedResponse<Category>>({
    queryKey: ["categories", { limit: itemsPerPage }],
    queryFn: async ({ pageParam = 1 }) => {
      return CategoryService.getCategories({
        page: pageParam as number,
        limit: itemsPerPage,
      });
    },
    initialPageParam: 1,
    getNextPageParam,
  });

  const categories = data?.pages.flatMap((page) => page.data) || [];

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: `${category.name} (${category.group?.name || "No Group"})`,
  }));

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);


  const LoadingState = () => (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p>Loading categories...</p>
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="flex items-center justify-center p-8">
      <div className="text-center text-red-600">
        <p>Error loading categories: {(error as Error).message}</p>
      </div>
    </div>
  );

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Single Select</h2>
        <XSelectPagination
          options={categoryOptions}
          value={selectedValue}
          onValueChange={(value) => setSelectedValue(value as string)}
          placeholder="Select category..."
          onLoadMore={handleLoadMore}
          loading={isFetchingNextPage}
          loadThreshold={30}
          hasMoreData={hasNextPage}
        />
        <div className="text-sm text-gray-600">
          Selected value: {selectedValue || "None"}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Multi Select</h2>
        <XSelectPagination
          options={categoryOptions}
          value={selectedMultipleValues}
          onValueChange={(value) =>
            setSelectedMultipleValues(value as string[])
          }
          placeholder="Select multiple categories..."
          onLoadMore={handleLoadMore}
          loading={isFetchingNextPage}
          loadThreshold={30}
          hasMoreData={hasNextPage}
          multiple={true}
        />
        <div className="text-sm text-gray-600">
          Selected values:{" "}
          {selectedMultipleValues.length > 0
            ? selectedMultipleValues.join(", ")
            : "None"}
        </div>
      </div>

    </div>
  );
}
