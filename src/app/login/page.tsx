"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginValues = z.infer<typeof loginSchema>;

function getSafeRedirect(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const redirectTo = getSafeRedirect(
    searchParams.get("callbackURL") || searchParams.get("redirect"),
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      const result = await authClient.signIn.email({
        email: values.email,
        password: values.password,
        callbackURL: redirectTo,
      });

      if (result.error) {
        toast.error(result.error.message || "Login failed. Please try again.");
        return;
      }

      toast.success("Welcome back to BookNook!");

      router.replace(redirectTo);
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);

      await authClient.signIn.social({
        provider: "google",
        callbackURL: redirectTo,
      });
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google login failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-[calc(100vh_-_76px)] items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 sm:px-6 lg:py-16">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -left-32 -top-24 h-80 w-80 rounded-full bg-emerald-300/40 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-teal-300/40 blur-3xl" />

      <div className="relative w-full max-w-md animate-in fade-in-0 slide-in-from-bottom-4 duration-500 ease-out">
        {/* Brand */}
        <Link
          href="/"
          className="group mb-6 flex items-center justify-center gap-3"
        >
          <Image
            src="/images/logo.jpg"
            alt="BookNook logo"
            width={1408}
            height={768}
            loading="eager"
            sizes="48px"
            className="h-12 w-12 rounded-2xl object-cover object-center shadow-md shadow-slate-900/10 ring-1 ring-slate-900/5 transition-transform duration-200 group-hover:scale-105"
          />

          <span className="text-2xl font-extrabold tracking-tight text-slate-900">
            Book<span className="text-emerald-600">Nook</span>
          </span>
        </Link>

        {/* Auth Card */}
        <Card className="gap-0 rounded-3xl border border-slate-200/80 bg-white py-0 shadow-[0_32px_70px_-32px_rgba(2,6,23,0.35)] ring-0">
          <CardHeader className="px-6 pt-7 sm:px-8 sm:pt-8">
            <CardTitle className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[28px]">
              Welcome Back
            </CardTitle>

            <CardDescription className="mt-2 text-sm leading-6 text-slate-500">
              Enter your details to access your BookNook account.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-7 sm:px-8 sm:pb-8">
            {/* Email / Password Form (primary action below the fields) */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
              <div className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="font-semibold text-slate-700"
                  >
                    Email Address
                  </Label>

                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={!!errors.email}
                    className="h-12 rounded-xl border-slate-200 bg-white px-4 transition-colors hover:border-slate-300 focus-visible:border-emerald-500 focus-visible:ring-emerald-600/20"
                    {...register("email")}
                  />

                  {errors.email && (
                    <p className="text-xs font-medium text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <Label
                    htmlFor="password"
                    className="mb-2 font-semibold text-slate-700"
                  >
                    Password
                  </Label>

                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      aria-invalid={!!errors.password}
                      className="h-12 rounded-xl border-slate-200 bg-white px-4 pr-12 transition-colors hover:border-slate-300 focus-visible:border-emerald-500 focus-visible:ring-emerald-600/20"
                      {...register("password")}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-emerald-700"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-2 text-xs font-medium text-red-600">
                      {errors.password.message}
                    </p>
                  )}

                  {/* Forgot Password (UI only) */}
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        toast(
                          "Password reset is not available on BookNook yet. Please try again with the correct password.",
                          { icon: "ℹ️", duration: 4000 },
                        )
                      }
                      className="text-xs font-semibold text-slate-500 transition-colors hover:text-emerald-700"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>
              </div>

              {/* Primary Button (below Email & Password) */}
              <Button
                type="submit"
                disabled={isSubmitting || googleLoading}
                className="mt-5 h-12 w-full gap-2 rounded-xl bg-emerald-600 text-base font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* OR Divider (below the primary button) */}
            <div className="my-5 flex items-center gap-3" aria-hidden="true">
              <span className="h-px flex-1 bg-slate-200" />

              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                OR
              </span>

              <span className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Google Sign-In (below the OR divider) */}
            <Button
              type="button"
              variant="outline"
              className="h-12 w-full gap-3 rounded-xl border-slate-200 bg-white text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
              onClick={handleGoogleLogin}
              disabled={googleLoading || isSubmitting}
            >
              {googleLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <FcGoogle className="size-5" />
              )}
              Continue with Google
            </Button>
          </CardContent>

          <CardFooter className="justify-center border-t-0 bg-transparent p-0 pb-7 text-sm text-slate-500 sm:pb-8">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-emerald-700 transition-colors hover:text-emerald-800 hover:underline"
            >
              Create an Account
            </Link>
          </CardFooter>
        </Card>

        <div className="mt-5 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition-colors hover:text-emerald-700"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="animate-spin text-emerald-600" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
