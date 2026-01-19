import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  TextInput,
  PasswordInput,
  Button,
  Text,
  Box,
  Title,
  Stack,
  Alert,
} from "@mantine/core";
import { useAuth } from "../../../auth";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";

type CustomLoginRequest = {
  email: string;
  password: string;
};

export const Route = createFileRoute("/auth/_layout/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  // formik onsubmit
  const onFormSubmit = async (
    values: CustomLoginRequest,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    setError(null);
    try {
      await login({
        email: values.email,
        password: values.password,
      });

      await navigate({ to: "/app/dashboard" });
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // formik validation schema
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .matches(/.*@.+\..+/, "Email address must be a valid email")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  return (
    <Stack gap="md" maw={400} mx="auto" w="100%" p="md">
      <Box ta="center" mb="lg">
        <Title order={2} mb="xs">
          Welcome Back
        </Title>
        <Text c="dimmed">Enter your credentials to access your account</Text>
      </Box>

      {/* temporary alert till integrating notification */}
      {error && (
        <Alert color="red" mb="md">
          {error}
        </Alert>
      )}

      {/* formik form */}
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={onFormSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <Stack gap="md">
              <div>
                <Field
                  as={TextInput}
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                  required
                  error={touched.email && errors.email}
                  mb="sm"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="error-message"
                />
              </div>

              <div>
                <Field
                  as={PasswordInput}
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  required
                  error={touched.password && errors.password}
                  mb="sm"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error-message"
                />
              </div>

              <Button type="submit" loading={isSubmitting} fullWidth size="md">
                Sign In
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </Stack>
  );
}
