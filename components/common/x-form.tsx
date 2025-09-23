"use client";

import {
  Button,
  Checkbox,
  Form,
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import React, { forwardRef, useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";

export interface XFormField {
  name: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "select"
    | "textarea"
    | "radio"
    | "checkbox";
  label?: string;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  showPassword?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  options?: Array<{ value: string; label: string }>;
  rows?: number;
  orientation?: "horizontal" | "vertical";
  checkboxLabel?: string;
}

export interface XFormProps<T = Record<string, unknown>> {
  schema: z.ZodSchema<T>;
  fields: XFormField[];
  onSubmit: (data: T) => Promise<unknown> | unknown;
  spacing?: "none" | "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
  onFormReady?: (form: ReturnType<typeof useForm>) => void;
}

const XForm = forwardRef<HTMLFormElement, XFormProps<Record<string, unknown>>>(
  (props, ref) => {
    const {
      schema,
      fields,
      onSubmit,
      spacing = "md",
      loading = false,
      disabled = false,
      className,
      onSuccess,
      onError,
      onFormReady,
      ...restProps
    } = props;
    const [showPasswordStates, setShowPasswordStates] = useState<
      Record<string, boolean>
    >({});

    const form = useForm<FieldValues>({
      // @ts-expect-error: zodResolver has complex type constraints that don't align perfectly with our generic setup
      resolver: zodResolver(schema),
      defaultValues: fields.reduce((acc, field) => {
        acc[field.name] = field.type === "number" ? 0 : "";
        return acc;
      }, {} as FieldValues),
    });

    const mutation = useMutation({
      mutationFn: async (data: FieldValues) => {
        const result = onSubmit(data as Record<string, unknown>);
        return result instanceof Promise ? await result : result;
      },
      onSuccess: (data) => {
        onSuccess?.(data);
        form.reset();
      },
      onError: (error) => {
        onError?.(error);
      },
    });

    useEffect(() => {
      if (onFormReady) {
        onFormReady(form);
      }
    }, [form, onFormReady]);

    const handleSubmit = form.handleSubmit((data: FieldValues) => {
      mutation.mutate(data);
    });

    const togglePassword = (fieldName: string) => {
      setShowPasswordStates((prev) => ({
        ...prev,
        [fieldName]: !prev[fieldName],
      }));
    };

    const spacingClasses = {
      none: "space-y-0",
      sm: "space-y-3",
      md: "space-y-6",
      lg: "space-y-8",
    };

    const isFormLoading = loading || mutation.isPending;

    return (
      <Form {...form}>
        <form
          ref={ref}
          onSubmit={handleSubmit}
          className={cn(
            spacingClasses[spacing],
            isFormLoading && "opacity-50 pointer-events-none",
            disabled && "opacity-50 pointer-events-none",
            className
          )}
          {...restProps}
        >
          {fields.map((field) => {
            const fieldError = form.formState.errors[field.name];
            const hasError = !!fieldError;
            const errorMessage = fieldError?.message as string;
            const isFieldDisabled = disabled || isFormLoading || field.disabled;

            if (field.type === "select") {
              return (
                <div key={field.name} className="space-y-2">
                  {field.label && (
                    <label className="text-sm font-medium text-foreground">
                      {field.label}
                      {field.required && (
                        <span className="text-destructive ml-1">*</span>
                      )}
                    </label>
                  )}
                  <Select
                    value={form.watch(field.name) || ""}
                    onValueChange={(value) => form.setValue(field.name, value)}
                    disabled={isFieldDisabled}
                  >
                    <SelectTrigger
                      className={cn(
                        hasError &&
                          "border-destructive focus:border-destructive focus:ring-destructive"
                      )}
                    >
                      <SelectValue placeholder={field.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {hasError && (
                    <p className="text-xs text-destructive">{errorMessage}</p>
                  )}
                  {!hasError && field.helperText && (
                    <p className="text-xs text-muted-foreground">
                      {field.helperText}
                    </p>
                  )}
                </div>
              );
            }

            if (field.type === "textarea") {
              return (
                <div key={field.name} className="space-y-2">
                  {field.label && (
                    <label className="text-sm font-medium text-foreground">
                      {field.label}
                      {field.required && (
                        <span className="text-destructive ml-1">*</span>
                      )}
                    </label>
                  )}
                  <Textarea
                    {...form.register(field.name)}
                    placeholder={field.placeholder}
                    disabled={isFieldDisabled}
                    rows={field.rows || 4}
                    className={cn(
                      "resize-none",
                      hasError &&
                        "border-destructive focus:border-destructive focus:ring-destructive"
                    )}
                  />
                  {hasError && (
                    <p className="text-xs text-destructive">{errorMessage}</p>
                  )}
                  {!hasError && field.helperText && (
                    <p className="text-xs text-muted-foreground">
                      {field.helperText}
                    </p>
                  )}
                </div>
              );
            }

            if (field.type === "radio") {
              return (
                <div key={field.name} className="space-y-2">
                  {field.label && (
                    <label className="text-sm font-medium text-foreground">
                      {field.label}
                      {field.required && (
                        <span className="text-destructive ml-1">*</span>
                      )}
                    </label>
                  )}
                  <RadioGroup
                    value={form.watch(field.name) || ""}
                    onValueChange={(value) => form.setValue(field.name, value)}
                    disabled={isFieldDisabled}
                    className={cn(
                      field.orientation === "horizontal"
                        ? "flex flex-row flex-wrap gap-4"
                        : "flex flex-col gap-3"
                    )}
                  >
                    {field.options?.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`${field.name}-${option.value}`}
                          disabled={isFieldDisabled}
                        />
                        <label
                          htmlFor={`${field.name}-${option.value}`}
                          className={cn(
                            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                            isFieldDisabled && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                  {hasError && (
                    <p className="text-xs text-destructive">{errorMessage}</p>
                  )}
                  {!hasError && field.helperText && (
                    <p className="text-xs text-muted-foreground">
                      {field.helperText}
                    </p>
                  )}
                </div>
              );
            }

            if (field.type === "checkbox") {
              return (
                <div key={field.name} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={field.name}
                      checked={form.watch(field.name) || false}
                      onCheckedChange={(checked) =>
                        form.setValue(field.name, checked)
                      }
                      disabled={isFieldDisabled}
                    />
                    <label
                      htmlFor={field.name}
                      className={cn(
                        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                        isFieldDisabled && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {field.checkboxLabel || field.label}
                      {field.required && (
                        <span className="text-destructive ml-1">*</span>
                      )}
                    </label>
                  </div>
                  {hasError && (
                    <p className="text-xs text-destructive">{errorMessage}</p>
                  )}
                  {!hasError && field.helperText && (
                    <p className="text-xs text-muted-foreground">
                      {field.helperText}
                    </p>
                  )}
                </div>
              );
            }

            return (
              <div key={field.name} className="space-y-2">
                {field.label && (
                  <label className="text-sm font-medium text-foreground">
                    {field.label}
                    {field.required && (
                      <span className="text-destructive ml-1">*</span>
                    )}
                  </label>
                )}
                <div className="relative">
                  {field.leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {field.leftIcon}
                    </div>
                  )}
                  {field.prefix && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      {field.prefix}
                    </div>
                  )}
                  <Input
                    {...form.register(field.name)}
                    type={
                      field.type === "password"
                        ? showPasswordStates[field.name]
                          ? "text"
                          : "password"
                        : field.type
                    }
                    placeholder={field.placeholder}
                    disabled={isFieldDisabled}
                    className={cn(
                      "h-12",
                      field.leftIcon || field.prefix ? "pl-10" : "",
                      field.rightIcon ||
                        field.suffix ||
                        field.type === "password"
                        ? "pr-10"
                        : "",
                      hasError &&
                        "border-destructive focus:border-destructive focus:ring-destructive"
                    )}
                  />
                  {(field.rightIcon ||
                    field.suffix ||
                    field.type === "password") && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {field.rightIcon}
                      {field.suffix && (
                        <span className="text-sm text-muted-foreground">
                          {field.suffix}
                        </span>
                      )}
                      {field.type === "password" && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePassword(field.name)}
                          className="h-auto p-0 text-muted-foreground hover:text-foreground"
                        >
                          {showPasswordStates[field.name] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                {hasError && (
                  <p className="text-xs text-destructive">{errorMessage}</p>
                )}
                {!hasError && field.helperText && (
                  <p className="text-xs text-muted-foreground">
                    {field.helperText}
                  </p>
                )}
              </div>
            );
          })}
        </form>
      </Form>
    );
  }
);

XForm.displayName = "XForm";

export default XForm;
