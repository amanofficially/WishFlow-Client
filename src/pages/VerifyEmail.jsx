import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { MailCheck, Loader2 } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import AuthShell from "../components/AuthShell";
import OtpInput from "../components/OtpInput";

const RESEND_WAIT_SECONDS = 30;

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_WAIT_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  useEffect(() => {
    if (!email) navigate("/register");
  }, [email, navigate]);

  if (!email) return null;

  const handleVerify = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post("/auth/verify-email", { email, otp });
      toast.success("Email verified! Welcome to WishFlow");
      login(res.data.data);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      await api.post("/auth/resend-otp", { email });
      toast.success("A new code has been sent to your email.");
      setSecondsLeft(RESEND_WAIT_SECONDS);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not resend code");
    }
  };

  return (
    <AuthShell
      title="Verify your email"
      subtitle={
        <>
          We've sent a 6-digit code to <strong className="text-gray-700 dark:text-slate-300">{email}</strong>
        </>
      }
      footer={
        <Link to="/login" className="text-sm text-brand-600 dark:text-brand-300 font-semibold hover:text-brand-700 dark:hover:text-brand-200 transition-colors">
          Back to login
        </Link>
      }
    >
      <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center mb-6">
        <MailCheck className="w-5 h-5 text-brand-600 dark:text-brand-300" />
      </div>

      <form onSubmit={handleVerify} className="space-y-5">
        <OtpInput value={otp} onChange={setOtp} autoFocus />

        <button
          type="submit"
          disabled={submitting || otp.length !== 6}
          className="btn-gradient w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="w-[18px] h-[18px] animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify email"
          )}
        </button>
      </form>

      <div className="mt-5 text-center text-sm text-gray-500 dark:text-slate-400">
        {secondsLeft > 0 ? (
          <span>Resend code in {secondsLeft}s</span>
        ) : (
          <button onClick={handleResend} className="text-brand-600 dark:text-brand-300 font-semibold hover:text-brand-700 dark:hover:text-brand-200 transition-colors">
            Resend code
          </button>
        )}
      </div>
    </AuthShell>
  );
};

export default VerifyEmail;
