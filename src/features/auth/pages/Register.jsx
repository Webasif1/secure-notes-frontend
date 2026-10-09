import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import FormError from "../components/FormError";
import { Field, PasswordField } from "../../shared/components/Field";
import Button from "../../shared/components/Button";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../../../lib/api";
import { isEmail, splitInterests } from "../validation";

const Register = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", interests: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!isEmail(form.email)) newErrors.email = "Enter a valid email address";
    if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (form.confirm !== form.password) newErrors.confirm = "Passwords don't match";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setLoading(true);
    setServerError("");
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        interests: splitInterests(form.interests),
      });
    } catch (err) {
      setServerError(getErrorMessage(err, "Registration failed"));
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start writing secure notes in seconds.">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormError message={serverError} />
        <Field
          label="Full name"
          name="name"
          autoComplete="name"
          placeholder="Jane Doe"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
        />
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
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />
        <PasswordField
          label="Confirm password"
          name="confirm"
          autoComplete="new-password"
          placeholder="Repeat your password"
          value={form.confirm}
          onChange={handleChange}
          error={errors.confirm}
        />
        <Field
          label="Interests (optional)"
          name="interests"
          placeholder="chess, reading, music"
          hint="Separate with commas"
          value={form.interests}
          onChange={handleChange}
        />
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
