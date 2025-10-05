"use client";

import { useMutation } from "@tanstack/react-query";
import { UploadIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

import { XButton, XLabel } from "@/components/common";
import { useToast } from "@/lib/hooks";
import { UploadService } from "@/lib/services";
import { FileUpload } from "@/lib/types";
import { cn } from "@/lib/utils";

interface XDropzoneThumbnailProps {
  onUploadSuccess?: (thumbnailUrl: string, thumbnailId: string) => void;
  onFileDelete?: () => void;
  maxSize?: number;
  accept?: Record<string, string[]>;
  className?: string;
  disabled?: boolean;
  initialThumbnail?: {
    url: string;
    id: string;
  };
  title?: string;
}

export function XDropzoneThumbnail({
  onUploadSuccess,
  onFileDelete,
  maxSize = 10,
  accept = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
  },
  className,
  disabled = false,
  initialThumbnail,
  title = "Thumbnail Upload",
}: XDropzoneThumbnailProps) {
  const [uploadedFile, setUploadedFile] = useState<FileUpload | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialThumbnail) {
      // Extract filename from URL
      const getFileNameFromUrl = (url: string) => {
        try {
          const urlObj = new URL(url);
          const pathname = urlObj.pathname;
          const fileName = pathname.split("/").pop() || "thumbnail";
          return fileName;
        } catch {
          return "thumbnail";
        }
      };

      setUploadedFile({
        id: initialThumbnail.id,
        url: initialThumbnail.url,
        fileName: getFileNameFromUrl(initialThumbnail.url),
        alt: "thumbnail",
        sortOrder: 1,
        size: "0",
        mimeType: "image/jpeg",
        key: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }, [initialThumbnail]);

  const { success, error: showError } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const response = await UploadService.upload([file]);

      if (response.data && response.data.length > 0) {
        return response.data[0];
      } else {
        throw new Error("Upload failed");
      }
    },
    onSuccess: (file: FileUpload) => {
      setUploadedFile(file);
      onUploadSuccess?.(file.url, file.id);
      success("Thumbnail uploaded successfully");
    },
    onError: (error) => {
      showError((error as Error).message);
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  const handleUpload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      await uploadMutation.mutateAsync(file);
    },
    [uploadMutation],
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      await handleUpload(file);
    },
    [handleUpload],
  );

  const deleteMutation = useMutation({
    mutationFn: (fileId: string) => UploadService.delete(fileId),
    onSuccess: () => {
      setUploadedFile(null);
      onFileDelete?.();
      success("Thumbnail deleted successfully");
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const removeFile = async () => {
    if (!uploadedFile) return;
    await deleteMutation.mutateAsync(uploadedFile.id);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize: maxSize * 1024 * 1024,
    maxFiles: 1,
    multiple: false,
    disabled: disabled || isUploading || deleteMutation.isPending,
  });

  const renderPreview = () => {
    if (!uploadedFile?.url) return null;

    return (
      <div className="relative group">
        <Image
          src={uploadedFile.url}
          alt={uploadedFile.fileName || "Thumbnail"}
          className="w-full h-48 object-cover rounded-lg border"
          width={300}
          height={192}
        />

        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-primary-foreground text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="truncate">{uploadedFile.fileName || "Thumbnail"}</p>
        </div>

        <XButton
          type="button"
          variant="destructive"
          size="sm"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            removeFile();
          }}
          disabled={disabled || isUploading || deleteMutation.isPending}
        >
          <XIcon className="h-3 w-3" />
        </XButton>
      </div>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      <XLabel className="mb-2">{title}</XLabel>

      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed border rounded-lg p-2 text-center cursor-pointer transition-colors",
          isDragActive && "border-primary bg-primary/10",
          disabled && "opacity-50 cursor-not-allowed",
          (isUploading || deleteMutation.isPending) &&
            "border-primary bg-primary/10 cursor-not-allowed",
          !(isUploading || deleteMutation.isPending) && !disabled && "hover:border",
        )}
      >
        <input {...getInputProps()} className="hidden" />

        {uploadedFile ? (
          renderPreview()
        ) : (
          <>
            {isUploading || deleteMutation.isPending ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-sm text-primary mb-2 font-medium">
                  {isUploading ? "Uploading thumbnail..." : "Deleting thumbnail..."}
                </p>
                {isUploading && (
                  <p className="text-xs text-muted-foreground">Please wait a moment</p>
                )}
              </div>
            ) : (
              <>
                <UploadIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-xs text-muted-foreground mb-2">
                  {isDragActive
                    ? "Drop thumbnail here"
                    : `Click or drag to upload thumbnail (PNG, JPG, JPEG, GIF, WEBP up to ${maxSize}MB)`}
                </p>
                <p className="text-xs text-muted-foreground">
                  Single file only • Up to {maxSize}MB
                </p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
