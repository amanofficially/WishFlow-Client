const AuthBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-brand-900">
    <div className="absolute inset-0 bg-brand-gradient" />

    <div className="absolute -top-40 -left-32 w-[32rem] h-[32rem] bg-white/10 rounded-full blur-[110px] animate-blob" />
    <div
      className="absolute -bottom-32 -right-24 w-[28rem] h-[28rem] bg-white/10 rounded-full blur-[110px] animate-blob"
      style={{ animationDelay: "3s" }}
    />

    <div className="absolute inset-0 bg-grid opacity-[0.12]" />
  </div>
);

export default AuthBackground;
