import { authFetcher, ENDPOINTS } from "@/lib/configs";
import type { ApiResponse, FileUpload } from "@/lib/types";

export const uploadService = {
  upload: async (files: File | File[]): Promise<ApiResponse<FileUpload[]>> => {
    const fileArray = Array.isArray(files) ? files : [files];

    if (fileArray.length === 0) {
      throw new Error("No files to upload");
    }

    const formData = new FormData();
    fileArray.forEach((file) => {
      formData.append(`files`, file);
    });

    const response = await authFetcher.postFormData<FileUpload[]>(
      ENDPOINTS.UPLOAD.UPLOAD,
      formData,
    );

    return response;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await authFetcher.delete<void>(ENDPOINTS.UPLOAD.DELETE.replace(":id", id));
    return response;
  },
};
