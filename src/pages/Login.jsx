import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import AuthShell from "../components/AuthShell";
import FormField from "../components/FormField";
import OtpInput from "../components/OtpInput";

const RESEND_WAIT_SECONDS = 30;

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: 0.05 * i, ease: "easeOut" },
  }),
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // Two-factor step: once login() reports requires2FA, we stop showing the
  // password form and ask for the emailed code instead. We keep the
  // credentials so "Resend code" can just replay the same login call.
  const [pendingCreds, setPendingCreds] = useState(null); // { email, password }
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_WAIT_SECONDS);

  const startResendCountdown = () => {
    setSecondsLeft(RESEND_WAIT_SECONDS);
    const tick = () => {
      setSecondsLeft((s) => {
        if (s <= 1) return 0;
        setTimeout(tick, 1000);
        return s - 1;
      });
    };
    setTimeout(tick, 1000);
  };

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/login", data);
      if (res.data.requires2FA) {
        setPendingCreds({ email: data.email, password: data.password });
        startResendCountdown();
        toast.success("We've sent a login code to your email.");
        return;
      }
      login(res.data.data);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error(error.response.data.message);
        navigate("/verify-email", { state: { email: data.email } });
        return;
      }
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setVerifying(true);
    try {
      const res = await api.post("/auth/verify-2fa", { email: pendingCreds.email, otp });
      login(res.data.data);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend2FA = async () => {
    setResending(true);
    try {
      await api.post("/auth/login", pendingCreds);
      toast.success("A new code has been sent to your email.");
      startResendCountdown();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not resend code");
    } finally {
      setResending(false);
    }
  };

  if (pendingCreds) {
    return (
      <AuthShell
        title="Enter your login code"
        subtitle={
          <>
            We've sent a 6-digit code to{" "}
            <strong className="text-gray-700 dark:text-slate-300">{pendingCreds.email}</strong>
          </>
        }
        footer={
          <button
            onClick={() => setPendingCreds(null)}
            className="text-sm text-brand-600 dark:text-brand-300 font-semibold hover:text-brand-700 dark:hover:text-brand-200 transition-colors"
          >
            Back to login
          </button>
        }
      >
        <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center mb-6">
          <ShieldCheck className="w-5 h-5 text-brand-600 dark:text-brand-300" />
        </div>

        <form onSubmit={handleVerify2FA} className="space-y-5">
          <OtpInput value={otp} onChange={setOtp} autoFocus />

          <button
            type="submit"
            disabled={verifying || otp.length !== 6}
            className="btn-gradient w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {verifying ? (
              <>
                <Loader2 className="w-[18px] h-[18px] animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify and log in"
            )}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-gray-500 dark:text-slate-400">
          {secondsLeft > 0 ? (
            <span>Resend code in {secondsLeft}s</span>
          ) : (
            <button
              onClick={handleResend2FA}
              disabled={resending}
              className="text-brand-600 dark:text-brand-300 font-semibold hover:text-brand-700 dark:hover:text-brand-200 transition-colors disabled:opacity-60"
            >
              {resending ? "Sending..." : "Resend code"}
            </button>
          )}
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Log in to WishFlow"
      subtitle="Enter your details to access your dashboard."
      footer={
        <p className="text-sm text-gray-500 dark:text-slate-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-brand-600 dark:text-brand-300 font-semibold hover:text-brand-700 dark:hover:text-brand-200 transition-colors">
            Register
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <motion.div variants={fieldVariants} initial="hidden" animate="show" custom={0}>
          <FormField
            label="Email"
            icon={Mail}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
            })}
          />
        </motion.div>

        <motion.div variants={fieldVariants} initial="hidden" animate="show" custom={1}>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[13px] font-semibold text-gray-700 dark:text-slate-300">Password</label>
            <Link to="/forgot-password" className="text-xs font-semibold text-brand-600 dark:text-brand-300 hover:text-brand-700 dark:hover:text-brand-200 transition-colors">
              Forgot password?
            </Link>
          </div>
          <FormField
            icon={Lock}
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-gray-400 dark:text-slate-500 hover:text-brand-600 dark:hover:text-brand-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
              </button>
            }
            {...register("password", { required: "Password is required" })}
          />
        </motion.div>

        <motion.label
          variants={fieldVariants}
          initial="hidden"
          animate="show"
          custom={2}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 cursor-pointer select-none"
        >
          <input type="checkbox" className="rounded border-gray-300 dark:border-slate-600 text-brand-600 focus:ring-brand-400 w-4 h-4" />
          Keep me signed in
        </motion.label>

        <motion.button
          variants={fieldVariants}
          initial="hidden"
          animate="show"
          custom={3}
          type="submit"
          disabled={isSubmitting}
          whileTap={{ scale: 0.98 }}
          className="btn-gradient w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 group"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-[18px] h-[18px] animate-spin" />
              Logging in...
            </>
          ) : (
            <>
              Login
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </motion.button>

        <motion.p
          variants={fieldVariants}
          initial="hidden"
          animate="show"
          custom={4}
          className="flex items-center justify-center gap-1.5 text-xs text-gray-400 dark:text-slate-500 pt-1"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
          Secured with encrypted sessions
        </motion.p>
      </form>
    </AuthShell>
  );
};

export default Login;
