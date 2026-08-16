const LEVELS = [
  { label: "Too weak", color: "bg-red-400", text: "text-red-500" },
  { label: "Weak", color: "bg-orange-400", text: "text-orange-500" },
  { label: "Fair", color: "bg-yellow-400", text: "text-yellow-600" },
  { label: "Strong", color: "bg-emerald-500", text: "text-emerald-600" },
];

const scorePassword = (value = "") => {
  if (!value) return 0;
  let score = 0;
  if (value.length >= 6) score++;
  if (value.length >= 10) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/[0-9]/.test(value) && /[^A-Za-z0-9]/.test(value)) score++;
  return Math.min(score, 4);
};

const PasswordStrength = ({ value }) => {
  if (!value) return null;
  const score = scorePassword(value);
  const level = LEVELS[Math.max(score - 1, 0)];

  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              i < score ? level.color : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs mt-1.5 font-medium ${level.text}`}>{level.label} password</p>
    </div>
  );
};

export default PasswordStrength;
