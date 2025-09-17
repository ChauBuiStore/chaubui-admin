"use client";

import { XDropzone } from "@/components/common";
import { UploadResponse } from "@/lib/types";
import { useState } from "react";

export default function DemoDropzoneMultiplePage() {
  const [uploadedImages, setUploadedImages] = useState<UploadResponse[]>([]);

  const handleUploadSuccess = (responses: UploadResponse[]) => {
    setUploadedImages(responses);
  };

  console.log("📸 Uploaded images:", uploadedImages);

  return (
    <div className="space-y-8 p-6">
      <XDropzone
        multiple={false}
        onUploadSuccess={(files) => handleUploadSuccess(files)}
      />
      <XDropzone
        multiple={true}
        maxFiles={5}
        onUploadSuccess={(files) => handleUploadSuccess(files)}
      />
    </div>
  );
}
