const tones = {
  primary: "bg-primary-soft text-primary",
  neutral: "bg-subtle text-muted",
};

const Badge = ({ tone = "neutral", children }) => (
  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>
    {children}
  </span>
);

export default Badge;
