import { useState } from "react";
import { X } from "lucide-react";
import PageTransition from "../../shared/components/PageTransition";
import PageHeader from "../../shared/components/PageHeader";
import Avatar from "../../shared/components/Avatar";
import Badge from "../../shared/components/Badge";
import Button from "../../shared/components/Button";
import { Field, PasswordField } from "../../shared/components/Field";
import { useToast } from "../../shared/components/Toast";
import { useAuth } from "../../auth/hooks/useAuth";
import FormError from "../../auth/components/FormError";
import { getErrorMessage } from "../../../lib/api";
import { updateMe } from "../../auth/services/auth.api";

const Card = ({ title, description, children }) => (
  <section className="rounded-xl border border-border bg-surface p-6">
    <h2 className="font-semibold text-text">{title}</h2>
    {description && <p className="mt-1 text-sm text-muted">{description}</p>}
    <div className="mt-5">{children}</div>
  </section>
);

const Profile = () => {
  const { user, setUser } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(user.name);
  const [interests, setInterests] = useState(user.interests || []);
  const [interestInput, setInterestInput] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [passwords, setPasswords] = useState({ password: "", confirm: "" });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [savingPassword, setSavingPassword] = useState(false);

  const addInterest = () => {
    const value = interestInput.trim().toLowerCase();
    if (value && !interests.includes(value) && interests.length < 20) setInterests([...interests, value]);
    setInterestInput("");
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setProfileError("Name is required");
      return;
    }
    setSavingProfile(true);
    setProfileError("");
    try {
      const res = await updateMe({ name: name.trim(), interests });
      setUser(res.user);
      toast.success("Profile saved");
    } catch (err) {
      setProfileError(getErrorMessage(err, "Could not save your profile"));
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    const errors = {};
    if (passwords.password.length < 8) errors.password = "Password must be at least 8 characters";
    if (passwords.confirm !== passwords.password) errors.confirm = "Passwords don't match";
    setPasswordErrors(errors);
    if (Object.keys(errors).length) return;

    setSavingPassword(true);
    try {
      await updateMe({ password: passwords.password });
      setPasswords({ password: "", confirm: "" });
      toast.success("Password changed");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not change your password"));
    } finally {
      setSavingPassword(false);
    }
  };

  const profileChanged = name !== user.name || interests.join() !== (user.interests || []).join();

  return (
    <PageTransition className="mx-auto max-w-2xl">
      <PageHeader title="Profile settings" description="Manage your account details." />

      <div className="mb-6 flex items-center gap-4 rounded-xl border border-border bg-surface p-6">
        <Avatar name={user.name} size="lg" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold text-text">{user.name}</p>
            <Badge tone={user.role === "admin" ? "primary" : "neutral"}>{user.role}</Badge>
          </div>
          <p className="truncate text-sm text-muted">{user.email}</p>
        </div>
      </div>

      <div className="space-y-6">
        <Card title="Personal info" description="Your name and interests are visible to other users.">
          <form onSubmit={saveProfile} noValidate className="space-y-4">
            <FormError message={profileError} />
            <Field label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            <Field label="Email" value={user.email} disabled hint="Email can only be changed by an admin." />
            <Field label="Interests" hint="Press Enter or comma to add.">
              {({ id, describedBy }) => (
                <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border border-border bg-surface px-2 py-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
                  {interests.map((interest) => (
                    <span
                      key={interest}
                      className="inline-flex items-center gap-1 rounded-full bg-primary-soft py-0.5 pl-2.5 pr-1 text-xs font-medium text-primary"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => setInterests(interests.filter((i) => i !== interest))}
                        aria-label={`Remove ${interest}`}
                        className="rounded-full p-0.5 hover:bg-primary/10"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <input
                    id={id}
                    aria-describedby={describedBy}
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value.replace(",", ""))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        addInterest();
                      } else if (e.key === "Backspace" && !interestInput && interests.length) {
                        setInterests(interests.slice(0, -1));
                      }
                    }}
                    onBlur={addInterest}
                    placeholder={interests.length ? "" : "e.g. chess"}
                    className="min-w-24 flex-1 bg-transparent px-1 text-sm text-text placeholder:text-muted/70 focus:outline-none"
                  />
                </div>
              )}
            </Field>
            <div className="flex justify-end">
              <Button type="submit" loading={savingProfile} disabled={!profileChanged}>
                Save changes
              </Button>
            </div>
          </form>
        </Card>

        <Card title="Change password" description="Use at least 8 characters.">
          <form onSubmit={savePassword} noValidate className="space-y-4">
            <PasswordField
              label="New password"
              autoComplete="new-password"
              value={passwords.password}
              onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
              error={passwordErrors.password}
            />
            <PasswordField
              label="Confirm new password"
              autoComplete="new-password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              error={passwordErrors.confirm}
            />
            <div className="flex justify-end">
              <Button type="submit" variant="secondary" loading={savingPassword} disabled={!passwords.password}>
                Update password
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </PageTransition>
  );
};

export default Profile;
