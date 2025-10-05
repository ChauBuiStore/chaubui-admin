"use client";

import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { XButton } from "./x-button";
import { XDialog } from "./x-dialog";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  title?: string;
  sizes?: string;
  fill?: boolean;
}

function ImageWithFallback({ src, alt, className, title, sizes, fill }: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src || typeof src !== "string") {
    return (
      <div className="w-full h-full rounded-lg bg-muted flex flex-col items-center justify-center p-1">
        <ImageIcon className="w-4 h-4 text-muted-foreground" />
        <span className="text-[8px] text-muted-foreground text-center leading-none">No image</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      title={title}
      sizes={sizes}
      onError={() => setHasError(true)}
    />
  );
}

interface ImageFile {
  url: string;
  alt?: string;
  fileName?: string;
}

interface XImagePreviewProps {
  images: ImageFile[];
  title?: string;
  mode?: "thumbnail" | "gallery";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function XImagePreview({
  images,
  title = "Images",
  mode = "gallery",
  size = "md",
  className = "",
}: XImagePreviewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const validImages = images.filter((file) => file && file.url);

  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const sizePx = {
    sm: "40px",
    md: "48px",
    lg: "64px",
  };

  if (validImages.length === 0) {
    return (
      <div
        className={`${sizeClasses[size]} bg-muted rounded-lg flex flex-col items-center justify-center p-1 ${className}`}
      >
        <ImageIcon className="w-4 h-4 text-muted-foreground" />
        <span className="text-[8px] text-muted-foreground text-center leading-none">
          No image{mode === "gallery" && "s"}
        </span>
      </div>
    );
  }

  const currentImage = validImages[currentImageIndex];
  const firstImage = validImages[0];

  if (!currentImage || !currentImage.url) {
    return (
      <div
        className={`${sizeClasses[size]} bg-muted rounded-lg flex flex-col items-center justify-center p-1 ${className}`}
      >
        <ImageIcon className="w-4 h-4 text-muted-foreground" />
        <span className="text-[8px] text-muted-foreground text-center leading-none">No image</span>
      </div>
    );
  }

  if (mode === "thumbnail") {
    return (
      <div
        className={`relative ${sizeClasses[size]} rounded-lg overflow-hidden border border-border ${className}`}
      >
        <ImageWithFallback
          src={firstImage.url}
          alt={firstImage.alt || firstImage.fileName || title}
          fill
          className="object-cover"
          title={title}
          sizes={sizePx[size]}
        />
      </div>
    );
  }

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : validImages.length - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev < validImages.length - 1 ? prev + 1 : 0));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handlePrevious();
    } else if (e.key === "ArrowRight") {
      handleNext();
    } else if (e.key === "Escape") {
      setIsDialogOpen(false);
    }
  };

  return (
    <XDialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setCurrentImageIndex(0);
        }
      }}
      size="4xl"
      showFooter={false}
      showCloseButton={true}
      title={title}
      trigger={
        <div
          className={`relative ${sizeClasses[size]} rounded-lg overflow-hidden cursor-pointer group ${className}`}
        >
          <ImageWithFallback
            src={firstImage.url}
            alt={firstImage.alt || firstImage.fileName || title}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
            title={title}
            sizes={sizePx[size]}
          />
          {validImages.length > 1 && (
            <div className="absolute bottom-0 right-0 bg-black bg-opacity-60 text-white text-xs px-1 rounded-tl">
              1/{validImages.length}
            </div>
          )}
        </div>
      }
    >
      <div
        className="relative w-full h-[70vh] flex items-center justify-center"
        onKeyDown={handleKeyDown}
      >
        {validImages.length > 1 && (
          <XButton
            variant="ghost"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-card/80 hover:bg-card text-foreground hover:text-foreground rounded-full shadow-lg border transition-all duration-200 hover:scale-105 cursor-pointer"
            onClick={handlePrevious}
          >
            <ChevronLeft className="w-6 h-6" />
          </XButton>
        )}

        <div className="relative w-full h-full">
          <ImageWithFallback
            src={currentImage.url}
            alt={currentImage.alt || currentImage.fileName || title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />
        </div>

        {validImages.length > 1 && (
          <XButton
            variant="ghost"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-card/80 hover:bg-card text-foreground hover:text-foreground rounded-full shadow-lg border transition-all duration-200 hover:scale-105 cursor-pointer"
            onClick={handleNext}
          >
            <ChevronRight className="w-6 h-6" />
          </XButton>
        )}

        {validImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-foreground text-background px-3 py-1 rounded-full text-sm shadow-lg">
            {currentImageIndex + 1} / {validImages.length}
          </div>
        )}

        {validImages.length > 1 && (
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-sm">
            {validImages
              .slice(
                Math.max(0, currentImageIndex - 2),
                Math.min(validImages.length, currentImageIndex + 3),
              )
              .map((image, index) => {
                const actualIndex = Math.max(0, currentImageIndex - 2) + index;
                return (
                  <XButton
                    key={actualIndex}
                    className={`relative w-12 h-12 rounded !bg-transparent overflow-hidden border-2 transition-all ${
                      actualIndex === currentImageIndex
                        ? "border-primary scale-110 shadow-lg"
                        : "opacity-70 hover:opacity-90 border hover:border-foreground/50"
                    }`}
                    onClick={() => setCurrentImageIndex(actualIndex)}
                  >
                    <ImageWithFallback
                      src={image.url}
                      alt={image.alt || image.fileName || `Image ${actualIndex + 1}`}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </XButton>
                );
              })}
          </div>
        )}
      </div>
    </XDialog>
  );
}
