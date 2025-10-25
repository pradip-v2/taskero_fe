import * as React from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Flex, Paper, Box, useMantineTheme } from "@mantine/core";

export const Route = createFileRoute("/auth/_layout")({
  component: () => <AuthLayout />,
});

const AuthLayout: React.FC = () => {
  const theme = useMantineTheme();

  return (
    <Flex
      bg={theme.colors.gray[1]}
      w="100vw"
      h={"100vh"}
      display={"flex"}
      justify={"space-between"}
      gap={"sm"}
      style={{ overflow: "hidden" }}
    >
      <Paper flex={1}>
        <Box
          h="100%"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box w="100%" maw={400} p="md">
            <Outlet/>
          </Box>
        </Box>
      </Paper>
    </Flex>
  );
};
