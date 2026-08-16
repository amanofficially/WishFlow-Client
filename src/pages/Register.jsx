import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";

import api from "../services/api";
import AuthShell from "../components/AuthShell";
import FormField from "../components/FormField";
import PasswordStrength from "../components/PasswordStrength";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const { data: response } = await api.post("/auth/register", data);

      toast.success(response.message || "Account created!");

      navigate("/verify-email", {
        state: { email: data.email },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start remembering the moments that matter."
      className="w-full max-w-2xl lg:max-w-3xl"
      footer={
        <p className="text-xs text-gray-500 dark:text-slate-400 sm:text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-brand-600 hover:underline dark:text-brand-300"
          >
            Login
          </Link>
        </p>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-full space-y-3"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-6">
          {/* Personal Information */}
          <div className="space-y-3">
            <FormField
              label="Full name"
              icon={User}
              placeholder="Rahul Sharma"
              error={errors.name?.message}
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name is too short",
                },
              })}
            />

            <FormField
              label="Email"
              icon={Mail}
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email",
                },
              })}
            />

            <FormField
              label="Mobile number"
              icon={Phone}
              type="tel"
              inputMode="numeric"
              placeholder="9876543210"
              error={errors.phone?.message}
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: "Enter a valid phone number",
                },
              })}
            />
          </div>

          {/* Security Information */}
          <div className="space-y-3">
            <FormField
              label="Password"
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="Min. 6 characters"
              error={errors.password?.message}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="text-gray-400 transition-colors hover:text-brand-600 dark:hover:text-brand-300"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Must be at least 6 characters",
                },
              })}
            />

            <FormField
              label="Confirm password"
              icon={Lock}
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter password"
              error={errors.confirmPassword?.message}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowConfirm((value) => !value)}
                  className="text-gray-400 transition-colors hover:text-brand-600 dark:hover:text-brand-300"
                  tabIndex={-1}
                  aria-label={
                    showConfirm
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />

            <PasswordStrength value={password} />
          </div>
        </div>

        {/* Create Account */}
        <div className="flex justify-center pt-1">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileTap={{ scale: 0.98 }}
            className="btn-gradient group flex w-fit items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold shadow-sm transition-shadow hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create account
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </motion.button>
        </div>

        {/* Terms */}
        <p className="flex items-center justify-center gap-1.5 pt-0.5 text-center text-[11px] leading-relaxed text-gray-400 dark:text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-brand-400" />
          <span>
            By creating an account you agree to WishFlow&apos;s Terms & Privacy
            Policy.
          </span>
        </p>
      </form>
    </AuthShell>
  );
};

export default Register;
