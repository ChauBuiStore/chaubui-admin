import { ENDPOINTS, httpClient } from "../configs";
import type {
  UploadApiResponse,
  UploadSingleApiResponse,
} from "../types";

class UploadService {
  async uploadSingle(file: File): Promise<UploadSingleApiResponse> {
    if (!file) {
      throw new Error("No file to upload");
    }

    const formData = new FormData();
    formData.append(`files`, file);

    const response = await httpClient.postFormData<UploadSingleApiResponse>(
      ENDPOINTS.UPLOAD.UPLOAD,
      formData
    );

    return response.data;
  }

  async uploadMultiple(files: File[]): Promise<UploadApiResponse> {
    if (files.length === 0) {
      throw new Error("No files to upload");
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append(`files`, file);
    });

    const response = await httpClient.postFormData<UploadApiResponse>(
      ENDPOINTS.UPLOAD.UPLOAD,
      formData
    );

    return response.data;
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete<void>(ENDPOINTS.UPLOAD.DELETE.replace(":id", id));
  }

}

export const uploadService = new UploadService();
