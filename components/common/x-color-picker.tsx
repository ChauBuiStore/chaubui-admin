"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CheckIcon, PaletteIcon } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface XColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  hasError?: boolean;
}

const PRESET_COLORS = [
  "#000000",
  "#374151",
  "#6B7280",
  "#9CA3AF",
  "#D1D5DB",
  "#F3F4F6",
  "#FFFFFF",
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#EAB308",
  "#84CC16",
  "#22C55E",
  "#10B981",
  "#06B6D4",
  "#0EA5E9",
  "#3B82F6",
  "#6366F1",
  "#8B5CF6",
  "#A855F7",
  "#D946EF",
  "#EC4899",
  "#F43F5E",
  "#F87171",
  "#FBBF24",
  "#A3E635",
  "#34D399",
  "#2DD4BF",
  "#38BDF8",
  "#60A5FA",
  "#818CF8",
  "#A78BFA",
  "#C084FC",
  "#E879F9",
  "#FB7185",
];

const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  if (!hex || !/^#[0-9A-Fa-f]{6}$/.test(hex)) {
    return { h: 0, s: 0, l: 0 };
  }

  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return { h: 0, s: 0, l: 0 };
  }

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  const result = { h: h * 360, s: s * 100, l: l * 100 };
  return {
    h: isNaN(result.h) ? 0 : result.h,
    s: isNaN(result.s) ? 0 : result.s,
    l: isNaN(result.l) ? 0 : result.l,
  };
};

const hslToHex = (h: number, s: number, l: number): string => {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export function XColorPicker({
  value = "#000000",
  onChange,
  placeholder = "Select color",
  className,
  disabled = false,
  hasError = false,
}: XColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hsl, setHsl] = useState(() => hexToHsl(value));

  const colorPickerRef = useRef<HTMLDivElement>(null);
  const hueSliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleColorSelect = (color: string) => {
    setInputValue(color);
    onChange?.(color);
    setHsl(hexToHsl(color));
    setIsOpen(false);
  };

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
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              className="w-auto h-9 px-3"
            >
              <div
                className="w-4 h-4 rounded border border-gray-300 mr-2"
                style={{ backgroundColor: value }}
              />
              <PaletteIcon className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="start">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Select Color</div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-xs"
                >
                  {showAdvanced ? "Simple" : "Advanced"}
                </Button>
              </div>

              {showAdvanced ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Color Palette</Label>
                    <div className="relative">
                      <div
                        ref={colorPickerRef}
                        className="w-full h-32 rounded border border-gray-300 cursor-crosshair relative overflow-hidden"
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

                  <Separator />

                  <div className="space-y-2">
                    <Label className="text-xs">Color</Label>
                    <div className="relative">
                      <div
                        ref={hueSliderRef}
                        className="w-full h-4 rounded border border-gray-300 cursor-pointer relative overflow-hidden"
                        style={{
                          background:
                            "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
                        }}
                        onMouseDown={handleHueSliderMouseDown}
                      >
                        <div
                          className="absolute w-1 h-full bg-white border border-gray-400 pointer-events-none"
                          style={{
                            left: `${(hsl.h / 360) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <Label className="text-xs">H</Label>
                      <Input
                        type="number"
                        value={
                          isNaN(hsl.h) ? "0" : Math.round(hsl.h).toString()
                        }
                        onChange={(e) => {
                          const h = Math.max(
                            0,
                            Math.min(360, Number(e.target.value))
                          );
                          setHsl((prev) => ({ ...prev, h }));
                          updateColorFromHsl(h, hsl.s, hsl.l);
                        }}
                        className="h-8 text-xs"
                        min="0"
                        max="360"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">S</Label>
                      <Input
                        type="number"
                        value={
                          isNaN(hsl.s) ? "0" : Math.round(hsl.s).toString()
                        }
                        onChange={(e) => {
                          const s = Math.max(
                            0,
                            Math.min(100, Number(e.target.value))
                          );
                          setHsl((prev) => ({ ...prev, s }));
                          updateColorFromHsl(hsl.h, s, hsl.l);
                        }}
                        className="h-8 text-xs"
                        min="0"
                        max="100"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">L</Label>
                      <Input
                        type="number"
                        value={
                          isNaN(hsl.l) ? "0" : Math.round(hsl.l).toString()
                        }
                        onChange={(e) => {
                          const l = Math.max(
                            0,
                            Math.min(100, Number(e.target.value))
                          );
                          setHsl((prev) => ({ ...prev, l }));
                          updateColorFromHsl(hsl.h, hsl.s, l);
                        }}
                        className="h-8 text-xs"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-7 gap-1">
                    {PRESET_COLORS.map((color) => (
                      <Button
                        key={color}
                        type="button"
                        variant="outline"
                        size="sm"
                        className={cn(
                          "w-6 h-6 p-0 hover:scale-110 transition-transform",
                          value === color &&
                            "ring-2 ring-blue-500 ring-offset-1"
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorSelect(color)}
                      >
                        {value === color && (
                          <CheckIcon className="w-3 h-3 text-white" />
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {!showAdvanced && (
                <div className="space-y-2">
                  <Label className="text-xs">Hex color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      placeholder="#000000"
                      value={inputValue}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      className={cn(
                        "flex-1 text-xs",
                        (hasError ||
                          (inputValue &&
                            !/^#[0-9A-Fa-f]{6}$/.test(inputValue))) &&
                          "border-red-500 focus:border-red-500"
                      )}
                    />
                    <div
                      className={cn(
                        "w-9 h-9 rounded border border-gray-300",
                        (hasError ||
                          (inputValue &&
                            !/^#[0-9A-Fa-f]{6}$/.test(inputValue))) &&
                          "border-red-500"
                      )}
                      style={{
                        backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(inputValue)
                          ? inputValue
                          : "#f3f4f6",
                      }}
                    />
                  </div>
                  {inputValue && !/^#[0-9A-Fa-f]{6}$/.test(inputValue) && (
                    <p className="text-xs text-red-500">
                      Color code must be in hex format (#RRGGBB)
                    </p>
                  )}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <Input
          type="text"
          value={value}
          onChange={(e) => {
            setInputValue(e.target.value);
            onChange?.(e.target.value);
          }}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "flex-1",
            hasError && "border-red-500 focus:border-red-500 focus:ring-red-500"
          )}
        />
      </div>
    </div>
  );
}
