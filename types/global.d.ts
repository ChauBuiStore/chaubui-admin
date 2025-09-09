
declare namespace React {
  type ReactNode = import('react').ReactNode;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: React.HTMLAttributes<HTMLElement>;
  }
}

declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.jpeg" {
  const content: string;
  export default content;
}

declare module "*.gif" {
  const content: string;
  export default content;
}

declare module "next" {
  export interface Metadata {
    title?: string;
    description?: string;
    keywords?: string[];
    authors?: Array<{ name: string; url?: string }>;
    creator?: string;
    publisher?: string;
    formatDetection?: {
      email?: boolean;
      address?: boolean;
      telephone?: boolean;
    };
    metadataBase?: URL;
    alternates?: {
      canonical?: string;
      languages?: Record<string, string>;
    };
    openGraph?: {
      title?: string;
      description?: string;
      url?: string;
      siteName?: string;
      images?: Array<{
        url: string;
        width?: number;
        height?: number;
        alt?: string;
      }>;
      locale?: string;
      type?: string;
    };
    twitter?: {
      card?: string;
      title?: string;
      description?: string;
      images?: string[];
      creator?: string;
    };
    robots?: {
      index?: boolean;
      follow?: boolean;
      googleBot?: {
        index?: boolean;
        follow?: boolean;
        "max-video-preview"?: number;
        "max-image-preview"?: string;
        "max-snippet"?: number;
      };
    };
    verification?: {
      google?: string;
      yandex?: string;
      yahoo?: string;
      other?: Record<string, string>;
    };
  }
}

declare module "next/font/google" {
  import { NextFont } from "next/dist/compiled/@next/font";

  export function Inter(options?: {
    subsets?: string[];
    variable?: string;
    display?: string;
    weight?: string | string[];
    style?: string | string[];
  }): NextFont;

  export function Roboto(options?: {
    subsets?: string[];
    variable?: string;
    display?: string;
    weight?: string | string[];
    style?: string | string[];
  }): NextFont;
}

declare module "next/image" {
  import { ComponentProps } from "react";

  interface ImageProps extends Omit<ComponentProps<"img">, "src" | "alt"> {
    src: string | StaticImageData;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    priority?: boolean;
    placeholder?: "blur" | "empty";
    blurDataURL?: string;
    quality?: number;
    sizes?: string;
    loader?: (props: { src: string; width: number; quality?: number }) => string;
    unoptimized?: boolean;
    onLoadingComplete?: (result: { naturalWidth: number; naturalHeight: number }) => void;
    onLoad?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
    onError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  }

  interface StaticImageData {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
  }

  const Image: React.ForwardRefExoticComponent<ImageProps & React.RefAttributes<HTMLImageElement>>;
  export default Image;
}

declare module "tailwind-merge" {
  export function twMerge(...classes: (string | undefined | null | false)[]): string;
  export function twJoin(...classes: (string | undefined | null | false)[]): string;
  export function getDefaultConfig(): Record<string, unknown>;
  export function extend(config: Record<string, unknown>): Record<string, unknown>;
}

declare module "clsx" {
  type ClassValue = string | number | boolean | undefined | null | ClassValue[] | Record<string, boolean | undefined | null>;

  function clsx(...inputs: ClassValue[]): string;
  export default clsx;
}
