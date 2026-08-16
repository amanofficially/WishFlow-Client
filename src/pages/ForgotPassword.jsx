import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { KeyRound, Mail, Loader2, ArrowRight } from "lucide-react";
import api from "../services/api";
import AuthShell from "../components/AuthShell";
import FormField from "../components/FormField";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      toast.success(res.data.message);
      navigate("/reset-password", { state: { email } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="Enter the email on your account and we'll send you a reset code."
      footer={
        <Link to="/login" className="text-sm text-brand-600 dark:text-brand-300 font-semibold hover:text-brand-700 dark:hover:text-brand-200 transition-colors">
          Back to login
        </Link>
      }
    >
      <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center mb-6">
        <KeyRound className="w-5 h-5 text-brand-600 dark:text-brand-300" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Email"
          icon={Mail}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        <button
          type="submit"
          disabled={submitting}
          className="btn-gradient w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="w-[18px] h-[18px] animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send reset code
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
};

export default ForgotPassword;
