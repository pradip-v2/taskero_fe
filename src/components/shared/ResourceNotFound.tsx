import { Box, Button, Text, Title, Center, Stack } from "@mantine/core";
import { Link } from "@tanstack/react-router";

interface ResourceNotFoundProps {
  resourceType: string;
}

export default function ResourceNotFound({
  resourceType,
}: ResourceNotFoundProps) {
  return (
    <Center style={{ height: "100vh" }}>
      <Box
        style={{
          width: 400,
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <Stack align="center" gap="md">
          <Box
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              backgroundColor: "#EAF0F6",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text size="lg" color="blue">
              🚫
            </Text>
          </Box>

          <Title order={2}>404</Title>

          <Text size="md">{resourceType} not found</Text>
          <Text size="sm">The resources could not be found on this server</Text>

          <Button component={Link} to="/" variant="filled" color="blue">
            ← Back To Homepage
          </Button>
        </Stack>
      </Box>
    </Center>
  );
}
