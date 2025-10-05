"use client";

import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Lock, LogIn, Mail, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import { XButton, XCard, XForm, XFormField } from "@/components/common";
import { AUTH_MESSAGES, FORM_TYPES, ROUTES } from "@/lib/constants";
import { useAuth, useToast } from "@/lib/hooks";
import { type LoginFormData, loginSchema } from "@/modules/auth/schema";

export function LoginPage() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const { success, error } = useToast();

  const loginMutation = useMutation({
    mutationFn: authLogin,
    onSuccess: (result) => {
      if (result?.status === "success" && result?.data?.accessToken) {
        success(result.message || AUTH_MESSAGES.LOGIN_SUCCESS);
        router.push(ROUTES.DASHBOARD);
      } else {
        error(result?.message || AUTH_MESSAGES.LOGIN_FAILED);
      }
    },
    onError: (err: Error) => {
      error(err.message || AUTH_MESSAGES.LOGIN_ERROR);
    },
  });

  const handleSubmit = async (data: LoginFormData) => {
    loginMutation.mutateAsync(data);
  };

  const fields: XFormField[] = [
    {
      name: "email",
      type: FORM_TYPES.INPUT,
      subType: FORM_TYPES.EMAIL,
      label: "Email",
      placeholder: "Enter your email",
      required: true,
      leftIcon: <Mail className="h-4 w-4" />,
    },
    {
      name: "password",
      type: FORM_TYPES.INPUT,
      subType: FORM_TYPES.PASSWORD,
      label: "Password",
      placeholder: "Enter your password",
      required: true,
      leftIcon: <Lock className="h-4 w-4" />,
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary/80 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-125">
                <LogIn className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-3">Welcome Back</h1>
          <p className="text-muted-foreground text-lg">Sign in to continue with your account</p>
        </div>

        <XCard
          variant="elevated"
          className="animate-in fade-in slide-in-from-bottom-8 duration-500"
        >
          <XForm
            ref={formRef}
            schema={loginSchema}
            onSubmit={handleSubmit}
            fields={fields}
            spacing="lg"
            className="space-y-6"
          />
          <div className="mt-6">
            <XButton
              fullWidth
              disabled={loginMutation.isPending}
              rightIcon={<ArrowRight className="h-5 w-5" />}
              className="bg-primary text-primary-foreground hover:opacity-90 font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              onClick={() => formRef.current?.requestSubmit()}
              enableEnterKey={true}
            >
              {loginMutation.isPending ? "Signing in..." : "Sign In"}
            </XButton>
          </div>
        </XCard>
      </div>
    </div>
  );
}
