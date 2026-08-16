import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { CheckCircle2, XCircle, AlertTriangle, Info, Loader2 } from "lucide-react";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
          {/* Toaster shows little pop-up notifications, e.g. "Logged in!" —
              styled to match the WishFlow brand instead of Sonner's
              generic defaults, with on-brand icons per toast type. */}
          <Toaster
            position="top-right"
            theme="system"
            closeButton
            expand
            gap={10}
            duration={4000}
            icons={{
              success: <CheckCircle2 className="w-[18px] h-[18px]" />,
              error: <XCircle className="w-[18px] h-[18px]" />,
              warning: <AlertTriangle className="w-[18px] h-[18px]" />,
              info: <Info className="w-[18px] h-[18px]" />,
              loading: <Loader2 className="w-[18px] h-[18px] animate-spin" />,
            }}
            toastOptions={{
              unstyled: false,
              classNames: {
                toast:
                  "!rounded-2xl !border !shadow-brand-lg !font-sans !bg-white dark:!bg-slate-900 dark:!border-slate-700 !p-4",
                title: "!font-semibold !text-[13.5px] !text-gray-900 dark:!text-slate-100",
                description: "!text-[12.5px] !text-gray-500 dark:!text-slate-400",
                closeButton:
                  "!bg-transparent !border-gray-200 dark:!border-slate-700 !text-gray-400 hover:!text-gray-600 dark:hover:!text-slate-200",
                success: "!border-l-4 !border-l-emerald-500 [&_svg]:!text-emerald-500",
                error: "!border-l-4 !border-l-rose-500 [&_svg]:!text-rose-500",
                warning: "!border-l-4 !border-l-amber-500 [&_svg]:!text-amber-500",
                info: "!border-l-4 !border-l-brand-500 [&_svg]:!text-brand-500",
                loading: "!border-l-4 !border-l-brand-400 [&_svg]:!text-brand-400",
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
