import { motion } from "motion/react";
import Spinner from "./Spinner";

const variants = {
  primary: "bg-primary text-white hover:bg-primary-hover shadow-sm shadow-primary/20",
  secondary: "bg-surface text-text border border-border hover:bg-subtle",
  ghost: "text-muted hover:text-text hover:bg-subtle",
  danger: "bg-danger text-white hover:opacity-90 shadow-sm",
};

const sizes = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-11 px-5 text-[15px] gap-2",
  icon: "h-9 w-9 justify-center",
};

const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  children,
  type = "button",
  ...props
}) => {
  return (
    <motion.button
      type={type}
      whileTap={disabled || loading ? undefined : { scale: 0.97 }}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </motion.button>
  );
};

export default Button;
