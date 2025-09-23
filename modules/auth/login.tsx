"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui";
import { useAuth, useToast } from "@/lib/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Lock, LogIn, Mail, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginFormData } from "./schema";
import { XInput, XButton, XCard } from "@/components/common";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login: authLogin, isAuthenticated } = useAuth();
  const { success, error } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: authLogin,
    onSuccess: (result) => {
      if (result.status === "success" && result.data?.accessToken) {
        console.log('result-1', result);
        success(result.message || "Login successful");
        router.push("/dashboard");
      } else {
        console.log('result-2', result);
        error(result.message || "Login failed");
      }
    },
    onError: (err) => {
      console.log('result-3', err);
      error(err.message || "An error occurred during login");
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

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

          <h1 className="text-4xl font-bold text-foreground mb-3">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-lg">
            Sign in to continue with your account
          </p>
        </div>

        <XCard
          variant="elevated"
          shadow="lg"
          padding="lg"
          className="animate-in fade-in slide-in-from-bottom-8 duration-500"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-foreground font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <XInput
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                        hasError={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                        disabled={loginMutation.isPending}
                        size="lg"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-foreground font-medium flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Password
                    </FormLabel>
                    <FormControl>
                      <XInput
                        {...field}
                        type="password"
                        showPassword={showPassword}
                        onTogglePassword={() => setShowPassword(!showPassword)}
                        placeholder="Enter your password"
                        hasError={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                        disabled={loginMutation.isPending}
                        size="lg"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />

              <XButton
                type="submit"
                size="lg"
                fullWidth
                loading={loginMutation.isPending}
                rightIcon={<ArrowRight className="h-5 w-5" />}
                className="bg-primary text-primary-foreground hover:opacity-90 font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Sign In
              </XButton>
            </form>
          </Form>
        </XCard>
      </div>
    </div>
  );
}
