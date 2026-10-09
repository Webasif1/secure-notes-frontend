import { RouterProvider } from "react-router-dom";
import { MotionConfig } from "motion/react";
import { router } from "./app.route.jsx";
import { ThemeProvider } from "../features/shared/hooks/useTheme";
import { ToastProvider } from "../features/shared/components/Toast";
import { AuthProvider } from "../features/auth/auth.context";
import "./index.css";

const App = () => (
  // reducedMotion="user" turns animations off for people who ask for less motion
  <MotionConfig reducedMotion="user">
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </MotionConfig>
);

export default App;
