// Six-box OTP entry, shared by every "type a code we emailed you" screen
// (email verification, two-factor login). Keeping this in one place means
// the paste-to-fill / auto-advance / backspace behavior only has to be
// gotten right once.

import { useRef } from "react";

const OtpInput = ({ value, onChange, autoFocus = false }) => {
  const inputsRef = useRef([]);

  const setDigit = (index, digit) => {
    const next = value.split("");
    while (next.length < 6) next.push("");
    next[index] = digit;
    onChange(next.join("").slice(0, 6));
  };

  const handleChange = (index, raw) => {
    const clean = raw.replace(/[^0-9]/g, "").slice(-1);
    setDigit(index, clean);
    if (clean && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    onChange(pasted.padEnd(6, "").slice(0, 6).replace(/\0/g, ""));
    inputsRef.current[Math.min(pasted.length, 5)]?.focus();
  };

  const digits = value.split("").concat(Array(6).fill("")).slice(0, 6);

  return (
    <div className="flex justify-between gap-2" onPaste={handlePaste}>
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          autoFocus={autoFocus && i === 0}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          inputMode="numeric"
          maxLength={1}
          className="w-full aspect-square text-center text-xl font-semibold border border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 outline-none input-focus-ring transition-colors"
        />
      ))}
    </div>
  );
};

export default OtpInput;
