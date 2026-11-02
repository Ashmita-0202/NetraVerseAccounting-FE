import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./components/translate/i18n";
import "./index.css";
import { AuthProvider } from "./context/auth/AuthContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App.tsx";
import { PermissionProvider } from "./context/auth/PermissionContext.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchInterval: false,
      refetchIntervalInBackground: false,
      staleTime: 10 * 60 * 1000,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <FluentProvider theme={webLightTheme}>
          <PermissionProvider>
            <App />
          </PermissionProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </FluentProvider>
      </QueryClientProvider>
    </AuthProvider>
    {/* <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="Account/register" element={<Register />} />
        <Route path="Account/login" element={<Login />} />
      </Routes>
    </BrowserRouter> */}
  </StrictMode>
);
