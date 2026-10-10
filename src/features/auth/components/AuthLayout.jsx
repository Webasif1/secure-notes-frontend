import { motion } from "motion/react";
import { Layers, Lock, Users } from "lucide-react";
import Logo from "../../layout/components/Logo";
import ThemeToggle from "../../layout/components/ThemeToggle";

const features = [
  { icon: Lock, text: "Passwords hashed with bcrypt, sessions secured with JWT" },
  { icon: Layers, text: "Fast, paginated lists backed by database indexes" },
  { icon: Users, text: "Role-based access for users and admins" },
];

const AuthLayout = ({ title, subtitle, children }) => (
  <div className="relative flex min-h-screen bg-bg">
    {/* left: brand panel (desktop only) */}
    <aside className="relative hidden w-[44%] overflow-hidden border-r border-border bg-surface lg:flex lg:flex-col lg:justify-between lg:p-12">
      {/* soft background decoration */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-violet-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(var(--app-border)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      </div>

      <Logo className="relative" />

      <div className="relative max-w-md">
        <h2 className="text-3xl font-semibold leading-tight tracking-tight text-text">
          Your thoughts,
          <br />
          kept safe and organized.
        </h2>
        <p className="mt-3 text-muted">A calm, secure place to write, find and manage your notes.</p>
        <ul className="mt-8 space-y-3">
          {features.map(({ icon: Icon, text }, i) => (
            <motion.li
              key={text}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.25 }}
              className="flex items-center gap-3 text-sm text-text"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <Icon size={16} />
              </span>
              {text}
            </motion.li>
          ))}
        </ul>
      </div>

      <p className="relative text-xs text-muted">© {new Date().getFullYear()} SecureNotes</p>
    </aside>

    {/* right: form */}
    <main className="relative flex flex-1 flex-col px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between lg:justify-end">
        <Logo className="lg:hidden" />
        <ThemeToggle />
      </div>
      <div className="flex flex-1 items-center justify-center py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          <h1 className="text-2xl font-semibold tracking-tight text-text">{title}</h1>
          <p className="mt-1.5 text-sm text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </motion.div>
      </div>
    </main>
  </div>
);

export default AuthLayout;
