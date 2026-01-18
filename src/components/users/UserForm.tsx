import type { UsersCreateMutationRequest } from "@/api";
import { getError } from "@/utils/error-utility";
import { Button, Flex, Input } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useFormik } from "formik";
import { useMemo } from "react";
import * as Yup from "yup";

interface UserFormProps {
  initialData?: Partial<UsersCreateMutationRequest>;
  onSave: (values: UsersCreateMutationRequest) => Promise<any>;
  onCancel: () => void;
}

const UserForm = ({ initialData, onSave, onCancel }: UserFormProps) => {
  const userFormValidation = useMemo(() => {
    return Yup.object<UsersCreateMutationRequest>({
      email: Yup.string().email("Invalid email").required("Email is required"),
      name: Yup.string().required("Name is required"),
    });
  }, []);

  const formik = useFormik<UsersCreateMutationRequest>({
    initialValues: {
      name: "",
      email: "",
      ...initialData,
    },
    validationSchema: userFormValidation,
    onSubmit: async (values, { setErrors }) => {
      return onSave(values).catch((err) => {
        const { message, fieldErrors } = getError(err);
        if (fieldErrors) {
          setErrors(fieldErrors);
        }
        showNotification({
          title: "Error",
          message,
          color: "red",
        });
      });
    },
  });

  return (
    <Flex direction={"column"}>
      <Flex direction={"column"}>
        <Input.Wrapper label="Name" error={formik.errors.name}>
          <Input
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Input.Wrapper>
        <Input.Wrapper label="Email" error={formik.errors.email}>
          <Input
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Input.Wrapper>
      </Flex>
      <Flex gap={"sm"}>
        <Button onClick={formik.submitForm}>Save</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </Flex>
    </Flex>
  );
};

export default UserForm;
