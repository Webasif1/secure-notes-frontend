import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import FormError from "../components/FormError";
import { Field, PasswordField } from "../../shared/components/Field";
import Button from "../../shared/components/Button";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../../../lib/api";
import { isEmail } from "../validation";

const Login = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!isEmail(form.email)) newErrors.email = "Enter a valid email address";
    if (!form.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setLoading(true);
    setServerError("");
    try {
      await login(form);
      // GuestOnly redirects to the app once the user is set
    } catch (err) {
      setServerError(getErrorMessage(err, "Login failed"));
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue to your notes.">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormError message={serverError} />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
        <PasswordField
          name="password"
          autoComplete="current-password"
          placeholder="Your password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        Don't have an account?{" "}
        <Link to="/register" className="font-medium text-primary hover:text-primary-hover">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
