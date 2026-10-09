import { useEffect, useState } from "react";
import Modal from "../../shared/components/Modal";
import Button from "../../shared/components/Button";
import { Field, PasswordField, selectClass } from "../../shared/components/Field";
import FormError from "../../auth/components/FormError";
import { getErrorMessage } from "../../../lib/api";
import { isEmail, splitInterests } from "../../auth/validation";
import { createUser, updateUser } from "../services/admin.api";

const empty = { name: "", email: "", password: "", role: "user", interests: "" };

// add user (user = null) or edit user
const UserFormModal = ({ open, onClose, user, currentUserId, onSaved }) => {
  const isEdit = Boolean(user);
  const isSelf = isEdit && user._id === currentUserId;
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(
      user
        ? { name: user.name, email: user.email, password: "", role: user.role, interests: user.interests.join(", ") }
        : empty,
    );
    setErrors({});
    setServerError("");
  }, [open, user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!isEmail(form.email)) newErrors.email = "Enter a valid email address";
    if (!isEdit && form.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (isEdit && form.password && form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    const data = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      interests: splitInterests(form.interests),
    };
    if (form.password) data.password = form.password;

    setSaving(true);
    setServerError("");
    try {
      const res = isEdit ? await updateUser(user._id, data) : await createUser(data);
      onSaved(res.user, isEdit);
      onClose();
    } catch (err) {
      setServerError(getErrorMessage(err, "Could not save the user"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={saving ? () => {} : onClose}
      title={isEdit ? "Edit user" : "Add user"}
      description={isEdit ? `Update ${user?.name}'s account.` : "Create a new account. They can sign in right away."}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormError message={serverError} />
        <Field label="Full name" name="name" value={form.name} onChange={handleChange} error={errors.name} data-autofocus />
        <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
        <PasswordField
          label={isEdit ? "New password" : "Password"}
          name="password"
          autoComplete="new-password"
          placeholder={isEdit ? "Leave empty to keep the current one" : "At least 8 characters"}
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />
        <Field label="Role" hint={isSelf ? "You can't remove your own admin role." : undefined}>
          {({ id, describedBy }) => (
            <select
              id={id}
              name="role"
              value={form.role}
              onChange={handleChange}
              disabled={isSelf}
              aria-describedby={describedBy}
              className={selectClass}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          )}
        </Field>
        <Field
          label="Interests"
          name="interests"
          placeholder="chess, reading"
          hint="Separate with commas"
          value={form.interests}
          onChange={handleChange}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {isEdit ? "Save changes" : "Add user"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserFormModal;
