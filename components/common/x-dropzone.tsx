"use client";

import { useMutation } from "@tanstack/react-query";
import { UploadIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

import { XButton, XLabel } from "@/components/common";
import { useToast } from "@/lib/hooks";
import { uploadService } from "@/lib/services";
import { FileUpload } from "@/lib/types";
import { cn } from "@/lib/utils";

interface XDropzoneProps {
  onUploadSuccess?: (responses: FileUpload[]) => void;
  onFileDelete?: (fileId: string) => void;
  maxFiles?: number;
  maxSize?: number;
  accept?: Record<string, string[]>;
  className?: string;
  disabled?: boolean;
  multiple?: boolean;
  initialFiles?: FileUpload[];
  title?: string;
}

export function XDropzone({
  onUploadSuccess,
  onFileDelete,
  maxFiles = 10,
  maxSize = 10,
  accept = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
  },
  className,
  disabled = false,
  multiple = true,
  initialFiles = [],
  title = "Files Upload",
}: XDropzoneProps) {
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>(initialFiles);
  const prevInitialFilesRef = useRef<FileUpload[]>(initialFiles);

  useEffect(() => {
    if (JSON.stringify(prevInitialFilesRef.current) !== JSON.stringify(initialFiles)) {
      setUploadedFiles(initialFiles);
      prevInitialFilesRef.current = initialFiles;
    }
  }, [initialFiles]);

  const { success, error: showError } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const response = await uploadService.upload(files);

      if (response.data) {
        return response.data;
      } else {
        return [];
      }
    },
    onSuccess: (responses) => {
      const responseArray = Array.isArray(responses) ? responses : [responses];

      if (multiple) {
        setUploadedFiles((prev) => [...prev, ...responseArray]);
      } else {
        setUploadedFiles(responseArray);
      }

      onUploadSuccess?.(responseArray as FileUpload[]);
      success(
        `Successfully uploaded ${responseArray.length} file${responseArray.length > 1 ? "s" : ""}`,
      );
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
    [uploadMutation],
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const totalFiles = uploadedFiles.length + acceptedFiles.length;
      if (totalFiles > maxFiles) {
        showError(
          `Maximum ${maxFiles} files allowed. You have ${
            uploadedFiles.length
          } files, can only add ${maxFiles - uploadedFiles.length} more.`,
        );
        return;
      }

      await handleUpload(acceptedFiles);
    },
    [handleUpload, uploadedFiles.length, maxFiles, showError],
  );

  const deleteMutation = useMutation({
    mutationFn: (fileId: string) => uploadService.delete(fileId),
    onSuccess: (_, fileId) => {
      setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
      onFileDelete?.(fileId);
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
    multiple: multiple,
    disabled: disabled || uploadMutation.isPending || deleteMutation.isPending,
  });

  const renderSingleModePreview = () => {
    if (uploadedFiles.length === 0) return null;

    const file = uploadedFiles[0];
    if (!file.url || typeof file.url !== "string") return null;

    return (
      <div className="relative group">
        <Image
          src={file.url}
          alt={file.fileName || "Uploaded file"}
          className="w-full h-32 object-cover rounded-lg border"
          width={200}
          height={128}
        />
        <XButton
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
        </XButton>
      </div>
    );
  };

  const renderMultipleModePreviews = () => {
    if (uploadedFiles.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {uploadedFiles.length} file{uploadedFiles.length > 1 ? "s" : ""} uploaded
          </span>
          <span>Max {maxFiles} files allowed</span>
        </div>

        <div className="max-h-80 overflow-y-auto border rounded-lg p-4 bg-muted">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {uploadedFiles.map((file, index) => {
              if (!file.url || typeof file.url !== "string") return null;

              return (
                <div key={file.id || `file-${index}`} className="relative group">
                  <div className="aspect-square">
                    <Image
                      src={file.url || ""}
                      alt={file.fileName || `Uploaded file ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                      width={120}
                      height={120}
                    />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-primary-foreground text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="truncate">{file.fileName || "Uploaded file"}</p>
                  </div>

                  <XButton
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    disabled={disabled || uploadMutation.isPending || deleteMutation.isPending}
                  >
                    <XIcon className="h-3 w-3" />
                  </XButton>

                  <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      <XLabel className="mb-2">{title}</XLabel>

      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed border rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragActive && "border-primary bg-primary/10",
          disabled && "opacity-50 cursor-not-allowed",
          (uploadMutation.isPending || deleteMutation.isPending) &&
            "border-primary bg-primary/10 cursor-not-allowed",
          !(uploadMutation.isPending || deleteMutation.isPending) && !disabled && "hover:border",
        )}
      >
        <input {...getInputProps()} className="hidden" />

        {!multiple && uploadedFiles.length > 0 ? (
          renderSingleModePreview()
        ) : (
          <>
            {uploadMutation.isPending || deleteMutation.isPending ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-sm text-primary mb-2 font-medium">
                  {uploadMutation.isPending ? `Uploading files...` : "Deleting file..."}
                </p>
                {uploadMutation.isPending && (
                  <p className="text-xs text-muted-foreground">Please wait a moment</p>
                )}
              </div>
            ) : (
              <>
                <UploadIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-xs text-muted-foreground mb-2">
                  {isDragActive
                    ? "Drop files here"
                    : `Click or drag to upload allowed PNG, JPG, JPEG, GIF, WEBP up to ${maxSize}MB each`}
                </p>
                <p className="text-xs text-muted-foreground">
                  Up to {maxSize}MB • {uploadedFiles.length}/{maxFiles} files
                </p>
              </>
            )}
          </>
        )}
      </div>

      {multiple && renderMultipleModePreviews()}
    </div>
  );
}
