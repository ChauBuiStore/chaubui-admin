import { ENDPOINTS, httpClient } from "@/lib/configs";
import type { UploadResponse, ApiResponse } from "@/lib/types";

class UploadService {
  static async uploadSingle(file: File): Promise<ApiResponse<UploadResponse>> {
    if (!file) {
      throw new Error("No file to upload");
    }

    const formData = new FormData();
    formData.append(`files`, file);

    const response = await httpClient.postFormData<UploadResponse>(
      ENDPOINTS.UPLOAD.UPLOAD,
      formData
    );

    return response;
  }

  static async uploadMultiple(files: File[]): Promise<ApiResponse<UploadResponse[]>> {
    if (files.length === 0) {
      throw new Error("No files to upload");
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append(`files`, file);
    });

    const response = await httpClient.postFormData<UploadResponse[]>(
      ENDPOINTS.UPLOAD.UPLOAD,
      formData
    );

    return response;
  }

  static async delete(id: string): Promise<ApiResponse<void>> {
    const response = await httpClient.delete<void>(ENDPOINTS.UPLOAD.DELETE.replace(":id", id));
    return response;
  }
}

export default UploadService;
