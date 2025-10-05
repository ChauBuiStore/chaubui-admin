import { ENDPOINTS, httpClient } from "@/lib/configs";
import type { ApiResponse, FileUpload } from "@/lib/types";

class UploadService {
  static async upload(files: File | File[]): Promise<ApiResponse<FileUpload[]>> {
    const fileArray = Array.isArray(files) ? files : [files];

    if (fileArray.length === 0) {
      throw new Error("No files to upload");
    }

    const formData = new FormData();
    fileArray.forEach((file) => {
      formData.append(`files`, file);
    });

    const response = await httpClient.postFormData<FileUpload[]>(ENDPOINTS.UPLOAD.UPLOAD, formData);

    return response;
  }

  static async delete(id: string): Promise<ApiResponse<void>> {
    const response = await httpClient.delete<void>(ENDPOINTS.UPLOAD.DELETE.replace(":id", id));
    return response;
  }
}

export default UploadService;
