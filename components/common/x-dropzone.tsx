"use client";

import { useToast } from "@/lib/hooks";
import { UploadService } from "@/lib/services";
import { UploadResponse } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { UploadIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button, Input, Label } from "../ui";

interface XDropzoneProps {
  onUploadSuccess?: (responses: UploadResponse[]) => void;
  maxFiles?: number;
  maxSize?: number;
  accept?: Record<string, string[]>;
  className?: string;
  disabled?: boolean;
  multiple?: boolean;
}

export function XDropzone({
  onUploadSuccess,
  maxFiles = 5,
  maxSize = 5,
  accept = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
  },
  className,
  disabled = false,
  multiple = true,
}: XDropzoneProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadResponse[]>([]);
  const { success, error: showError } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      if (multiple) {
        const response = await UploadService.uploadMultiple(files);
        return response.data || [];
      } else {
        const response = await UploadService.uploadSingle(files[0]);
        return response.data ? [response.data] : [];
      }
    },
    onSuccess: (responses) => {
      if (multiple) {
        setUploadedFiles((prev) => [...prev, ...responses]);
      } else {
        setUploadedFiles(responses);
      }

      onUploadSuccess?.(responses);
      success(`Successfully uploaded ${responses.length} file${responses.length > 1 ? 's' : ''}`);
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const handleUpload = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;
      await uploadMutation.mutateAsync(files);
    },
    [uploadMutation]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const filesToUpload = multiple ? acceptedFiles : acceptedFiles.slice(0, 1);
      await handleUpload(filesToUpload);
    },
    [handleUpload, multiple]
  );

  const deleteMutation = useMutation({
    mutationFn: (fileId: string) => UploadService.delete(fileId),
    onSuccess: (_, fileId) => {
      setUploadedFiles((prev) =>
        prev.filter((file) => file.id !== fileId)
      );
      success(`File deleted successfully`);
    },
    onError: (error) => {
      showError((error as Error).message);
    },
  });

  const removeFile = async (index: number) => {
    const fileToDelete = uploadedFiles[index];
    if (!fileToDelete) return;

    await deleteMutation.mutateAsync(fileToDelete.id);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize: maxSize * 1024 * 1024,
    maxFiles: multiple ? maxFiles : 1,
    disabled: disabled || uploadMutation.isPending || deleteMutation.isPending,
  });

  const renderSingleModePreview = () => {
    if (uploadedFiles.length === 0) return null;

    const file = uploadedFiles[0];
    return (
      <div className="relative group">
        <Image
          src={file.url}
          alt={file.fileName || "Uploaded file"}
          className="w-full h-32 object-cover rounded-lg border"
          width={200}
          height={128}
        />
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            removeFile(0);
          }}
          disabled={disabled || uploadMutation.isPending || deleteMutation.isPending}
        >
          <XIcon className="h-3 w-3" />
        </Button>
      </div>
    );
  };

  const renderMultipleModePreviews = () => {
    if (uploadedFiles.length === 0) return null;

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {uploadedFiles.map((file, index) => (
          <div key={file.id} className="relative group">
            <Image
              src={file.url}
              alt={file.fileName || `Uploaded file ${index + 1}`}
              className="w-full h-24 object-cover rounded-lg border"
              width={100}
              height={100}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                removeFile(index);
              }}
              disabled={disabled || uploadMutation.isPending || deleteMutation.isPending}
            >
              <XIcon className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Label className="mb-2">
        {multiple ? "Images Upload" : "Image Upload"}
      </Label>

      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragActive && "border-blue-500 bg-blue-50",
          disabled && "opacity-50 cursor-not-allowed",
          (uploadMutation.isPending || deleteMutation.isPending) && "border-blue-500 bg-blue-50 cursor-not-allowed",
          !(uploadMutation.isPending || deleteMutation.isPending) && !disabled && "hover:border-gray-400"
        )}
      >
        <Input {...getInputProps()} />

        {!multiple && uploadedFiles.length > 0 ? (
          renderSingleModePreview()
        ) : (
          <>
            {(uploadMutation.isPending || deleteMutation.isPending) ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-sm text-blue-600 mb-2">
                  {uploadMutation.isPending ? `Uploading ${multiple ? "images" : "image"}...` : "Deleting file..."}
                </p>
              </div>
            ) : (
              <>
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  {isDragActive
                    ? `Drop ${multiple ? "images" : "image"} here to upload...`
                    : `Drag and drop ${multiple ? "images" : "image"} here or click to select`}
                </p>
              </>
            )}

            <p className="text-xs text-gray-500">
              PNG, JPG, JPEG, GIF, WEBP up to {maxSize}MB each
            </p>
            <p className="text-xs text-gray-500">
              {multiple
                ? `Maximum ${maxFiles} images to upload`
                : "Single image upload only"
              }
            </p>
          </>
        )}
      </div>

      {multiple && renderMultipleModePreviews()}
    </div>
  );
}
