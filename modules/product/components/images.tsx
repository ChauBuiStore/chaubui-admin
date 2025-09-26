"use client";

import { XButton, XDialog } from "@/components/common";
import { Product } from "@/modules/product/types";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  title?: string;
  sizes?: string;
  fill?: boolean;
}

function ImageWithFallback({
  src,
  alt,
  className,
  title,
  sizes,
  fill,
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src || typeof src !== "string") {
    return (
      <div className="w-full h-full rounded-lg bg-muted flex flex-col items-center justify-center p-1">
        <ImageIcon className="w-4 h-4 text-muted-foreground" />
        <span className="text-[8px] text-muted-foreground text-center leading-none">
          No image
        </span>
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

interface ImagesProps {
  product: Product;
}

export function Images({ product }: ImagesProps) {
  const images =
    product.images
      ?.map((image) => image.file)
      ?.filter((file) => file && file.url) || [];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="w-12 h-12 bg-muted rounded-lg flex flex-col items-center justify-center p-1">
        <ImageIcon className="w-4 h-4 text-muted-foreground" />
        <span className="text-[8px] text-muted-foreground text-center leading-none">
          No images
        </span>
      </div>
    );
  }

  const currentImage = images[currentImageIndex];
  const firstImage = images[0];

  if (!currentImage || !currentImage.url) {
    return (
      <div className="w-12 h-12 bg-muted rounded-lg flex flex-col items-center justify-center p-1">
        <ImageIcon className="w-4 h-4 text-muted-foreground" />
        <span className="text-[8px] text-muted-foreground text-center leading-none">
          No image
        </span>
      </div>
    );
  }

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
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
      title={product.name}
      trigger={
        <div className="relative w-12 h-12 rounded-lg overflow-hidden cursor-pointer group">
          <ImageWithFallback
            src={firstImage.url}
            alt={firstImage.alt || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
            title={product.name}
            sizes="48px"
          />
          {images.length > 1 && (
            <div className="absolute bottom-0 right-0 bg-black bg-opacity-60 text-white text-xs px-1 rounded-tl">
              {1}/{images.length}
            </div>
          )}
        </div>
      }
    >
      <div
        className="relative w-full h-[70vh] flex items-center justify-center"
        onKeyDown={handleKeyDown}
      >
        {images.length > 1 && (
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
            alt={currentImage.alt || product.name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />
        </div>

        {images.length > 1 && (
          <XButton
            variant="ghost"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-card/80 hover:bg-card text-foreground hover:text-foreground rounded-full shadow-lg border transition-all duration-200 hover:scale-105 cursor-pointer"
            onClick={handleNext}
          >
            <ChevronRight className="w-6 h-6" />
          </XButton>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-foreground text-background px-3 py-1 rounded-full text-sm shadow-lg">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-sm">
            {images
              .slice(
                Math.max(0, currentImageIndex - 2),
                Math.min(images.length, currentImageIndex + 3)
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
                      alt={image.alt || `${product.name} ${actualIndex + 1}`}
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
