import { ENDPOINTS, httpClient } from "@/lib/configs";
import type { ApiResponse, Upload } from "@/lib/types";

class UploadService {
  static async upload(files: File | File[]): Promise<ApiResponse<Upload>> {
    const fileArray = Array.isArray(files) ? files : [files];

    if (fileArray.length === 0) {
      throw new Error("No files to upload");
    }

    const formData = new FormData();
    fileArray.forEach((file) => {
      formData.append(`files`, file);
    });

    const response = await httpClient.postFormData<Upload>(
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
