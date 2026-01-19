import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { AuthProvider, useAuth } from "./auth";
import {
  Button,
  Flex,
  MantineProvider,
  Modal,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { theme } from "./theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ResourceNotFound from "./components/shared/ResourceNotFound";
import {
  AlertModalContext,
  type AlertType,
} from "./context/AlertModalProvider";
import { useDisclosure } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    queryClient,
    auth: undefined!, // This will be set after we wrap the app in an AuthProvider
  },
  defaultNotFoundComponent: () => <ResourceNotFound resourceType="Page" />,
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();
  const [opened, handlers] = useDisclosure(false);
  const [alert, setAlert] = useState<AlertType | null>(null);

  function openModal(alert: AlertType) {
    setAlert(alert);
    setTimeout(() => {
      handlers.open();
    }, 0);
  }

  return (
    <AlertModalContext.Provider value={{ open: openModal }}>
      {opened && (
        <Modal
          opened={opened}
          centered
          onClose={function (): void {
            handlers.close();
          }}
          withCloseButton={false}
          w={338}
          h={226}
        >
          <Flex
            direction={"column"}
            align={"center"}
            gap={"md"}
            w={"100%"}
            py={"md"}
          >
            <ThemeIcon size={65} radius={"xl"}></ThemeIcon>
            <Title order={5}>{alert?.message}</Title>
            <Button onClick={handlers.close} w={274} h={41}>
              Close
            </Button>
          </Flex>
        </Modal>
      )}
      <RouterProvider router={router} context={{ auth }} />
    </AlertModalContext.Provider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MantineProvider theme={theme}>
          <Notifications />
          <InnerApp />
        </MantineProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
