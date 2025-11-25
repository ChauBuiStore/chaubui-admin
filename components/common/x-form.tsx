"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { forwardRef, useEffect, useState } from "react";
import { ControllerRenderProps, FieldPath, FieldValues, useForm } from "react-hook-form";
import { z } from "zod";

import {
  XCheckbox,
  XCombobox,
  XInput,
  XLabel,
  XRadioGroup,
  XSelect,
  XTextarea,
} from "@/components/common";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui";
import { FORM_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const getFieldType = (type?: string): XFormField["type"] => {
  const validTypes = [
    FORM_TYPES.INPUT,
    FORM_TYPES.SELECT,
    FORM_TYPES.COMBOBOX,
    FORM_TYPES.TEXTAREA,
    FORM_TYPES.RADIO,
    FORM_TYPES.CHECKBOX,
    FORM_TYPES.NUMBER,
  ] as const;
  return validTypes.includes(type as (typeof validTypes)[number])
    ? (type as XFormField["type"])
    : FORM_TYPES.INPUT;
};

export interface XFormField {
  name: string;
  type?: string;
  subType?: "text" | "email" | "password" | "number" | "tel" | "url";
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
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
  component?: React.ComponentType<Record<string, unknown>>;
  componentProps?: Record<string, unknown>;
  fields?: string[];
  isMultiField?: boolean;
  isArray?: boolean;
  arrayItemSchema?: z.ZodSchema<unknown>;
  maxItems?: number;
  minItems?: number;
}

export interface XFormProps<T = Record<string, unknown>> {
  schema: z.ZodSchema<T>;
  fields: XFormField[];
  onSubmit: (data: T) => Promise<unknown> | unknown;
  spacing?: "none" | "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onFormReady?: (form: ReturnType<typeof useForm>) => void;
  shouldResetOnSubmit?: boolean;
}

function XFormInner<T extends Record<string, unknown>>(
  props: XFormProps<T>,
  ref: React.ForwardedRef<HTMLFormElement>,
) {
  const {
    schema,
    fields,
    onSubmit,
    spacing = "md",
    loading = false,
    disabled = false,
    className,
    onFormReady,
    shouldResetOnSubmit = false,
    ...restProps
  } = props;
  const [showPasswordStates, setShowPasswordStates] = useState<Record<string, boolean>>({});

  const form = useForm<FieldValues>({
    // @ts-expect-error - schema is not typed
    resolver: zodResolver(schema),
    defaultValues: fields.reduce((acc, field) => {
      acc[field.name] = field.type === FORM_TYPES.NUMBER ? 0 : "";
      return acc;
    }, {} as FieldValues),
  });

  useEffect(() => {
    if (onFormReady) {
      onFormReady(form);
    }
  }, [form, onFormReady]);

  const handleSubmit = form.handleSubmit(async (data: FieldValues) => {
    try {
      const result = onSubmit(data as T);
      await (result instanceof Promise ? result : Promise.resolve(result));
      if (shouldResetOnSubmit) {
        form.reset();
      }
    } catch (error) {
      throw error;
    }
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

  const isFormLoading = loading;

  return (
    <Form {...form}>
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className={cn(
          spacingClasses[spacing],
          (isFormLoading || disabled) && "opacity-50 pointer-events-none",
          className,
        )}
        {...restProps}
      >
        {fields.map((field) => {
          const fieldType = getFieldType(field.type);
          const fieldError = form.formState.errors[field.name];
          const hasError = !!fieldError;
          const errorMessage = fieldError?.message as string;
          const isFieldDisabled = disabled || isFormLoading || !!field.disabled;

          if (fieldType === FORM_TYPES.SELECT) {
            return (
              <FormField
                key={field.name}
                name={field.name as never}
                render={({
                  field: rhfField,
                }: {
                  field: ControllerRenderProps<FieldValues, FieldPath<FieldValues>>;
                }) => (
                  <FormItem>
                    {field.label && (
                      <FormLabel className="gap-1" required={field.required}>
                        {field.label}
                      </FormLabel>
                    )}
                    <FormControl>
                      <XSelect
                        options={field.options || []}
                        value={rhfField.value ? String(rhfField.value) : ""}
                        onValueChange={(value) => {
                          rhfField.onChange(value);
                        }}
                        disabled={isFieldDisabled}
                        placeholder={field.placeholder}
                        className={cn(
                          hasError &&
                            "border-destructive focus:border-destructive focus:ring-destructive",
                        )}
                      />
                    </FormControl>
                    {!hasError && field.helperText && (
                      <FormDescription>{field.helperText}</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          }

          if (fieldType === FORM_TYPES.COMBOBOX) {
            return (
              <FormField
                key={field.name}
                name={field.name as never}
                render={({
                  field: rhfField,
                }: {
                  field: ControllerRenderProps<FieldValues, FieldPath<FieldValues>>;
                }) => (
                  <FormItem>
                    {field.label && (
                      <FormLabel className="gap-1" required={field.required}>
                        {field.label}
                      </FormLabel>
                    )}
                    <FormControl>
                      <XCombobox
                        options={field.options || []}
                        value={rhfField.value ? String(rhfField.value) : ""}
                        onValueChange={(value) => {
                          rhfField.onChange(value);
                        }}
                        disabled={isFieldDisabled}
                        placeholder={field.placeholder}
                        searchPlaceholder={field.searchPlaceholder}
                        className={cn(
                          hasError &&
                            "border-destructive focus:border-destructive focus:ring-destructive",
                        )}
                      />
                    </FormControl>
                    {!hasError && field.helperText && (
                      <FormDescription>{field.helperText}</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          }

          if (field.component) {
            const CustomComponent = field.component;
            const customComponentClassName = cn(
              (field.componentProps as { className?: string } | undefined)?.className,
              hasError && "border-destructive focus:border-destructive focus:ring-destructive",
            );

            if (field.isArray) {
              const arrayValue = (form.watch(field.name) as unknown[]) || [];
              const rawErrors = form.formState.errors[field.name];
              const arrayErrors =
                rawErrors && typeof rawErrors === "object" && !Array.isArray(rawErrors)
                  ? (rawErrors as { [key: number]: { message: string } })
                  : {};

              return (
                <div key={field.name} className="space-y-2">
                  {field.label && (
                    <XLabel className="gap-1" required={field.required}>
                      {field.label}
                    </XLabel>
                  )}
                  <CustomComponent
                    values={arrayValue}
                    onChange={(newValues: unknown[]) => {
                      form.setValue(field.name, newValues, {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                    }}
                    disabled={isFieldDisabled}
                    errors={arrayErrors}
                    maxItems={field.maxItems}
                    minItems={field.minItems}
                    className={customComponentClassName}
                    placeholder={field.placeholder}
                    {...(field.componentProps || {})}
                  />
                </div>
              );
            }

            if (field.isMultiField && field.fields) {
              const multiFieldValues = field.fields.reduce(
                (acc, fieldName) => {
                  acc[fieldName] = form.watch(fieldName) ?? "";
                  return acc;
                },
                {} as Record<string, unknown>,
              );

              const multiFieldErrors = field.fields.reduce(
                (acc, fieldName) => {
                  const fieldError = form.formState.errors[fieldName];
                  if (fieldError) {
                    acc[fieldName] = fieldError.message as string;
                  }
                  return acc;
                },
                {} as Record<string, string>,
              );

              return (
                <div key={field.name} className="space-y-2">
                  {field.label && (
                    <XLabel className="gap-1" required={field.required}>
                      {field.label}
                    </XLabel>
                  )}
                  <CustomComponent
                    values={multiFieldValues}
                    onChange={(values: Record<string, unknown>) => {
                      Object.entries(values).forEach(([key, fieldValue]) => {
                        form.setValue(key, fieldValue, {
                          shouldValidate: true,
                          shouldDirty: true,
                          shouldTouch: true,
                        });
                      });
                    }}
                    disabled={isFieldDisabled}
                    errors={multiFieldErrors}
                    className={customComponentClassName}
                    placeholder={field.placeholder}
                    {...(field.componentProps || {})}
                  />
                </div>
              );
            }

            return (
              <div key={field.name} className="space-y-2">
                {field.label && (
                  <XLabel className="gap-1" required={field.required}>
                    {field.label}
                  </XLabel>
                )}
                <CustomComponent
                  value={form.watch(field.name) ?? ""}
                  onChange={(value: unknown) => {
                    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
                      Object.entries(value).forEach(([key, fieldValue]) => {
                        form.setValue(key, fieldValue, {
                          shouldValidate: true,
                          shouldDirty: true,
                          shouldTouch: true,
                        });
                      });
                    } else {
                      form.setValue(field.name, value as never, {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                    }
                  }}
                  disabled={isFieldDisabled}
                  hasError={hasError}
                  errorMessage={errorMessage}
                  className={customComponentClassName}
                  placeholder={field.placeholder}
                  {...(field.componentProps || {})}
                />
              </div>
            );
          }

          if (fieldType === FORM_TYPES.TEXTAREA) {
            return (
              <FormField
                key={field.name}
                name={field.name as never}
                render={({
                  field: rhfField,
                }: {
                  field: ControllerRenderProps<FieldValues, FieldPath<FieldValues>>;
                }) => (
                  <FormItem>
                    {field.label && (
                      <FormLabel className="gap-1" required={field.required}>
                        {field.label}
                      </FormLabel>
                    )}
                    <FormControl>
                      <XTextarea
                        {...(rhfField as unknown as Record<string, unknown>)}
                        placeholder={field.placeholder}
                        disabled={isFieldDisabled}
                        rows={field.rows || 4}
                        className={cn(
                          "resize-none",
                          hasError &&
                            "border-destructive focus:border-destructive focus:ring-destructive",
                        )}
                      />
                    </FormControl>
                    {!hasError && field.helperText && (
                      <FormDescription>{field.helperText}</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          }

          if (fieldType === FORM_TYPES.RADIO) {
            return (
              <FormField
                key={field.name}
                name={field.name as never}
                render={({
                  field: rhfField,
                }: {
                  field: ControllerRenderProps<FieldValues, FieldPath<FieldValues>>;
                }) => (
                  <FormItem>
                    {field.label && (
                      <FormLabel className="gap-1" required={field.required}>
                        {field.label}
                      </FormLabel>
                    )}
                    <FormControl>
                      <XRadioGroup
                        options={field.options || []}
                        value={rhfField.value ?? ""}
                        onValueChange={(value) => rhfField.onChange(value)}
                        orientation={field.orientation}
                        disabled={isFieldDisabled}
                        label={field.label}
                        required={field.required}
                        error={hasError ? String(errorMessage) : undefined}
                        name={field.name}
                      />
                    </FormControl>
                    {!hasError && field.helperText && (
                      <FormDescription>{field.helperText}</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          }

          if (fieldType === FORM_TYPES.CHECKBOX) {
            return (
              <FormField
                key={field.name}
                name={field.name as never}
                render={({
                  field: rhfField,
                }: {
                  field: ControllerRenderProps<FieldValues, FieldPath<FieldValues>>;
                }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <XCheckbox
                          id={field.name}
                          checked={!!rhfField.value}
                          onCheckedChange={(checked) => rhfField.onChange(checked)}
                          disabled={isFieldDisabled}
                          label={field.checkboxLabel || field.label}
                        />
                      </div>
                    </FormControl>
                    {!hasError && field.helperText && (
                      <FormDescription>{field.helperText}</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          }

          return (
            <FormField
              key={field.name}
              name={field.name as never}
              render={({
                field: rhfField,
              }: {
                field: ControllerRenderProps<FieldValues, FieldPath<FieldValues>>;
              }) => (
                <FormItem>
                  {field.label && (
                    <FormLabel className="gap-1" required={field.required}>
                      {field.label}
                    </FormLabel>
                  )}
                  <FormControl>
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
                      <XInput
                        {...(rhfField as unknown as Record<string, unknown>)}
                        type={
                          fieldType === FORM_TYPES.INPUT && field.subType === FORM_TYPES.PASSWORD
                            ? FORM_TYPES.PASSWORD
                            : field.subType || FORM_TYPES.TEXT
                        }
                        showPassword={
                          fieldType === FORM_TYPES.INPUT && field.subType === FORM_TYPES.PASSWORD
                            ? !!showPasswordStates[field.name]
                            : undefined
                        }
                        onTogglePassword={
                          fieldType === FORM_TYPES.INPUT && field.subType === FORM_TYPES.PASSWORD
                            ? () => togglePassword(field.name)
                            : undefined
                        }
                        placeholder={field.placeholder}
                        disabled={isFieldDisabled}
                        className={cn(
                          "h-10",
                          field.leftIcon || field.prefix ? "pl-10" : "",
                          field.rightIcon || field.suffix ? "pr-10" : "",
                          hasError &&
                            "border-destructive focus:border-destructive focus:ring-destructive",
                        )}
                      />
                      {(field.rightIcon || field.suffix) && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          {field.rightIcon}
                          {field.suffix && (
                            <span className="text-sm text-muted-foreground">{field.suffix}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  {!hasError && field.helperText && (
                    <FormDescription>{field.helperText}</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
      </form>
    </Form>
  );
}

const XForm = forwardRef(XFormInner) as unknown as <T extends Record<string, unknown>>(
  props: XFormProps<T> & React.RefAttributes<HTMLFormElement>,
) => React.ReactElement & { displayName?: string };

(XForm as unknown as { displayName?: string }).displayName = "XForm";

export default XForm;
export { XForm };
