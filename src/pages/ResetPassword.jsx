import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { ShieldCheck, Mail, KeyRound, Lock, Loader2, ArrowRight } from "lucide-react";
import api from "../services/api";
import AuthShell from "../components/AuthShell";
import FormField from "../components/FormField";
import PasswordStrength from "../components/PasswordStrength";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/auth/reset-password", { email, otp, newPassword });
      toast.success(res.data.message || "Password reset. Please log in.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter the code we emailed you and choose a new password."
      footer={
        <Link to="/login" className="text-sm text-brand-600 dark:text-brand-300 font-semibold hover:text-brand-700 dark:hover:text-brand-200 transition-colors">
          Back to login
        </Link>
      }
    >
      <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center mb-6">
        <ShieldCheck className="w-5 h-5 text-brand-600 dark:text-brand-300" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Email"
          icon={Mail}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <FormField
          label="Reset code"
          icon={KeyRound}
          required
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="6-digit code"
          className="tracking-[0.3em] text-center"
        />

        <div>
          <FormField
            label="New password"
            icon={Lock}
            type="password"
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 6 characters"
          />
          <PasswordStrength value={newPassword} />
        </div>

        <FormField
          label="Confirm new password"
          icon={Lock}
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={submitting}
          className="btn-gradient w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="w-[18px] h-[18px] animate-spin" />
              Resetting...
            </>
          ) : (
            <>
              Reset password
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
};

export default ResetPassword;
