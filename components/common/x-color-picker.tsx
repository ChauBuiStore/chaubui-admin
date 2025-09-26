"use client";

import {
  XButton,
  XInput,
  XLabel,
  XPopover,
  XSeparator,
} from "@/components/common";
import { hexToHsl, hslToHex } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { PaletteIcon } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface XColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  hasError?: boolean;
  errorMessage?: string;
}

export function XColorPicker({
  value = "#000000",
  onChange,
  placeholder = "Select color",
  className,
  disabled = false,
  hasError = false,
  errorMessage,
}: XColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [hsl, setHsl] = useState(() => hexToHsl(value));

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const colorPickerRef = useRef<HTMLDivElement>(null);
  const hueSliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (/^#[0-9A-Fa-f]{6}$/.test(newValue)) {
      const normalizedValue = newValue.toUpperCase();
      onChange?.(normalizedValue);
      setHsl(hexToHsl(normalizedValue));
    } else if (newValue === "") {
      onChange?.("");
    }
  };

  const handleInputBlur = () => {
    if (!/^#[0-9A-Fa-f]{6}$/.test(inputValue) && inputValue !== "") {
      setInputValue(value);
    }
  };

  const updateColorFromHsl = useCallback(
    (h: number, s: number, l: number) => {
      const hex = hslToHex(h, s, l);
      setInputValue(hex);
      onChange?.(hex);
    },
    [onChange]
  );

  const handleColorPickerMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!colorPickerRef.current) return;

      isDragging.current = true;
      const rect = colorPickerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const saturation = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const lightness = Math.max(
        0,
        Math.min(100, 100 - (y / rect.height) * 100)
      );

      setHsl((prev) => ({ ...prev, s: saturation, l: lightness }));
      updateColorFromHsl(hsl.h, saturation, lightness);
    },
    [hsl.h, updateColorFromHsl]
  );

  const handleHueSliderMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!hueSliderRef.current) return;

      isDragging.current = true;
      const rect = hueSliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const hue = Math.max(0, Math.min(360, (x / rect.width) * 360));

      setHsl((prev) => ({ ...prev, h: hue }));
      updateColorFromHsl(hue, hsl.s, hsl.l);
    },
    [hsl.s, hsl.l, updateColorFromHsl]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current) return;

      if (colorPickerRef.current && e.target === colorPickerRef.current) {
        const rect = colorPickerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const saturation = Math.max(0, Math.min(100, (x / rect.width) * 100));
        const lightness = Math.max(
          0,
          Math.min(100, 100 - (y / rect.height) * 100)
        );

        setHsl((prev) => ({ ...prev, s: saturation, l: lightness }));
        updateColorFromHsl(hsl.h, saturation, lightness);
      }

      if (hueSliderRef.current && e.target === hueSliderRef.current) {
        const rect = hueSliderRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const hue = Math.max(0, Math.min(360, (x / rect.width) * 360));

        setHsl((prev) => ({ ...prev, h: hue }));
        updateColorFromHsl(hue, hsl.s, hsl.l);
      }
    },
    [hsl.h, hsl.s, hsl.l, updateColorFromHsl]
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    if (isDragging.current) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <XPopover
          open={isOpen}
          onOpenChange={setIsOpen}
          trigger={
            <XButton
              type="button"
              variant="outline"
              disabled={disabled}
              className={cn(
                "w-auto h-9 px-3",
                hasError && "border-destructive"
              )}
            >
              <div
                className={cn(
                  "w-4 h-4 rounded border mr-2",
                  hasError && "border-destructive"
                )}
                style={{ backgroundColor: value }}
              />
              <PaletteIcon className="w-4 h-4" />
            </XButton>
          }
          align="start"
          contentClassName="w-80 p-4"
        >
          <div className="space-y-4">
            <div className="text-sm font-medium">Select Color</div>

            <div className="space-y-4">
              <div className="space-y-2">
                <XLabel className="text-xs">Color Palette</XLabel>
                <div className="relative">
                  <div
                    ref={colorPickerRef}
                    className="w-full h-32 rounded border cursor-crosshair relative overflow-hidden"
                    style={{
                      background: `linear-gradient(to right, hsl(${hsl.h}, 100%, 50%), hsl(${hsl.h}, 0%, 50%)), linear-gradient(to top, hsl(${hsl.h}, 100%, 0%), hsl(${hsl.h}, 100%, 50%))`,
                    }}
                    onMouseDown={handleColorPickerMouseDown}
                  >
                    <div
                      className="absolute w-3 h-3 rounded-full border-2 border-white shadow-lg pointer-events-none"
                      style={{
                        left: `${hsl.s}%`,
                        top: `${100 - hsl.l}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  </div>
                </div>
              </div>

              <XSeparator />

              <div className="space-y-2">
                <XLabel className="text-xs">Hue</XLabel>
                <div className="relative">
                  <div
                    ref={hueSliderRef}
                    className="w-full h-4 rounded border cursor-pointer relative overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
                    }}
                    onMouseDown={handleHueSliderMouseDown}
                  >
                    <div
                      className="absolute w-1 h-full bg-white border pointer-events-none"
                      style={{ left: `${(hsl.h / 360) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <XSeparator />

            <div className="space-y-2">
              <XLabel className="text-xs">Hex color</XLabel>
              <div className="flex items-center gap-2">
                <XInput
                  type="text"
                  placeholder={placeholder || "#000000"}
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  aria-invalid={
                    hasError ||
                    !!(inputValue && !/^#[0-9A-Fa-f]{6}$/.test(inputValue))
                  }
                  className="flex-1 text-xs"
                />
                <div
                  className={cn(
                    "w-9 h-9 rounded border flex-shrink-0",
                    (hasError ||
                      (inputValue && !/^#[0-9A-Fa-f]{6}$/.test(inputValue))) &&
                      "border-destructive"
                  )}
                  style={{
                    backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(inputValue)
                      ? inputValue
                      : "#f3f4f6",
                  }}
                />
              </div>
            </div>
          </div>
        </XPopover>

        <span className="text-xs font-mono text-muted-foreground select-all">
          {inputValue?.toUpperCase()}
        </span>
      </div>
      {errorMessage && (
        <p className="text-xs text-destructive mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
