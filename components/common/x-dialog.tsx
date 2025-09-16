"use client";

import * as React from "react";
import { useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  AlertTriangleIcon,
  InfoIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "lucide-react";
import {
  useForm,
  FormProvider,
  FieldValues,
  UseFormReturn,
  DefaultValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export type DialogVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info";
export type DialogSize = "sm" | "md" | "lg" | "xl" | "full";

interface XDialogAction {
  label: string;
  onClick: () => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  disabled?: boolean;
  loading?: boolean;
}

interface XDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  title?: string;
  description?: string | React.ReactNode;
  variant?: DialogVariant;
  size?: DialogSize;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  actions?: XDialogAction[];
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: XDialogAction["variant"];
  cancelVariant?: XDialogAction["variant"];
  loading?: boolean;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  showFooter?: boolean;
  customFooter?: React.ReactNode;
  icon?: React.ReactNode;
  showIcon?: boolean;
}

const variantIcons = {
  success: <CheckCircleIcon className="h-6 w-6 text-green-600" />,
  warning: <AlertTriangleIcon className="h-6 w-6 text-yellow-600" />,
  error: <XCircleIcon className="h-6 w-6 text-red-600" />,
  info: <InfoIcon className="h-6 w-6 text-blue-600" />,
  default: null,
} as const;

const sizeStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-[95vw] h-[95vh]",
} as const;

export function XDialog({
  open,
  onOpenChange,
  children,
  trigger,
  title,
  description,
  variant = "default",
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  actions = [],
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "default",
  cancelVariant = "outline",
  loading = false,
  className,
  contentClassName,
  headerClassName,
  footerClassName,
  showFooter = true,
  customFooter,
  icon,
  showIcon = true,
}: XDialogProps) {
  const [isOpen, setIsOpen] = React.useState(open ?? false);
  const currentOpen = open !== undefined ? open : isOpen;

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (onOpenChange) {
        onOpenChange(newOpen);
      } else {
        setIsOpen(newOpen);
      }
    },
    [onOpenChange]
  );

  const handleConfirm = useCallback(() => {
    onConfirm?.();
  }, [onConfirm]);

  const handleCancel = useCallback(() => {
    onCancel?.();
    handleOpenChange(false);
  }, [onCancel, handleOpenChange]);

  const defaultActions = React.useMemo(() => {
    if (actions.length > 0) return actions;

    const actionsList: XDialogAction[] = [];

    if (onCancel || cancelText) {
      actionsList.push({
        label: cancelText,
        onClick: handleCancel,
        variant: cancelVariant,
        disabled: loading,
      });
    }

    if (onConfirm || confirmText) {
      actionsList.push({
        label: confirmText,
        onClick: handleConfirm,
        variant: confirmVariant,
        disabled: loading,
        loading: loading,
      });
    }

    return actionsList;
  }, [
    actions,
    onCancel,
    onConfirm,
    cancelText,
    confirmText,
    cancelVariant,
    confirmVariant,
    loading,
    handleCancel,
    handleConfirm,
  ]);

  const variantIcon = variantIcons[variant];
  const shouldShowIcon = showIcon && (icon || variantIcon);
  const hasHeader = title || description || shouldShowIcon;
  const hasFooter = showFooter && (defaultActions.length > 0 || customFooter);

  return (
    <Dialog open={currentOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        className={cn(sizeStyles[size], contentClassName)}
        showCloseButton={showCloseButton}
        onPointerDownOutside={
          closeOnOverlayClick ? undefined : (e) => e.preventDefault()
        }
        onEscapeKeyDown={closeOnEscape ? undefined : (e) => e.preventDefault()}
      >
        <div className={cn("space-y-4", className)}>
          {hasHeader && (
            <DialogHeader className={cn("space-y-3", headerClassName)}>
              <div className="flex items-start gap-3">
                {shouldShowIcon && (
                  <div className="flex-shrink-0">{icon || variantIcon}</div>
                )}
                <div className="flex-1 space-y-2">
                  {title && (
                    <DialogTitle className="text-left">{title}</DialogTitle>
                  )}
                  {description && (
                    <DialogDescription className="text-left">
                      {typeof description === 'string' ? description : description}
                    </DialogDescription>
                  )}
                </div>
              </div>
            </DialogHeader>
          )}

          {children && <div className="space-y-4">{children}</div>}

          {hasFooter && (
            <DialogFooter className={cn("gap-2", footerClassName)}>
              {customFooter || (
                <div className="flex justify-end gap-2">
                  {defaultActions.map((action, index) => (
                    <Button
                      key={`${action.label}-${index}`}
                      variant={action.variant || "default"}
                      onClick={action.onClick}
                      disabled={action.disabled || action.loading}
                      className="min-w-[80px]"
                    >
                      {action.loading && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                      )}
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </DialogFooter>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const XConfirmDialog = ({
  title = "Confirm",
  description,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  ...props
}: Omit<XDialogProps, "actions">) => (
  <XDialog
    title={title}
    description={description}
    onConfirm={onConfirm}
    onCancel={onCancel}
    confirmText={confirmText}
    cancelText={cancelText}
    {...props}
  />
);

interface XFormDialogProps<T extends FieldValues = FieldValues>
  extends Omit<
    XDialogProps,
    | "actions"
    | "onConfirm"
    | "onCancel"
    | "confirmText"
    | "cancelText"
    | "children"
  > {
  schema?: z.ZodType<T>;
  defaultValues?: Partial<T>;
  onSubmit?: (data: T) => void;
  onCancel?: () => void;
  saveText?: string;
  cancelText?: string;
  children: (form: UseFormReturn<T>) => React.ReactNode;
}

export const XFormDialog = <T extends FieldValues = FieldValues>({
  title,
  description,
  schema,
  defaultValues,
  onSubmit,
  onCancel,
  saveText = "Save",
  cancelText = "Hủy",
  loading = false,
  children,
  ...props
}: XFormDialogProps<T>) => {
  const form = useForm<T>({
    resolver: schema ? zodResolver(schema as never) : undefined,
    defaultValues: defaultValues as DefaultValues<T>,
    mode: "onChange",
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues as DefaultValues<T>);
    }
  }, [form, defaultValues]);

  const handleSubmit = (data: T) => {
    onSubmit?.(data);
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  const handleFormSubmit = () => {
    form.handleSubmit(handleSubmit)();
  };

  return (
    <XDialog
      title={title}
      description={description}
      onConfirm={handleFormSubmit}
      onCancel={handleCancel}
      confirmText={saveText}
      cancelText={cancelText}
      loading={loading || form.formState.isSubmitting}
      {...props}
    >
      <ScrollArea>
        <FormProvider {...form}>{children(form)}</FormProvider>
      </ScrollArea>
    </XDialog>
  );
};
