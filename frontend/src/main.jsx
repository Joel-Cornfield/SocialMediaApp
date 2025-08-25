import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import router from "./pages/routing/routes";
import "./index.scss";
import "./assets/styles/animations.scss"
import "./assets/styles/skeleton.scss"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ToastConfig from "./components/toasts/ToastConfig";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <RouterProvider router={router} />
        <ToastConfig />
      </AuthContextProvider>
    </QueryClientProvider>
  </StrictMode>,
);
