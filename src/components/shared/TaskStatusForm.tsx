import { type TaskStatusCreateMutationRequest } from "@/api";
import { getError } from "@/utils/error-utility";
import { Button, Flex, Input, LoadingOverlay } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useFormik } from "formik";
import { useMemo } from "react";
import * as Yup from "yup";

interface TaskStatusFormProps {
  initialData?: Partial<TaskStatusCreateMutationRequest>;
  onSave: (values: TaskStatusCreateMutationRequest) => Promise<any>;
  onCancel: () => void;
}

const TaskStatusForm = ({
  initialData,
  onSave,
  onCancel,
}: TaskStatusFormProps) => {
  const taskStatusFormValidation = useMemo(() => {
    return Yup.object({
      title: Yup.string().required("Title is required"),
    });
  }, []);

  const formik = useFormik<TaskStatusCreateMutationRequest>({
    initialValues: {
      title: "",
      ...initialData,
    },
    validationSchema: taskStatusFormValidation,
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
      <LoadingOverlay visible={formik.isSubmitting} />
      <Flex direction={"column"}>
        <Input.Wrapper label="Title" error={formik.errors.title}>
          <Input
            name="title"
            value={formik.values.title}
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

export default TaskStatusForm;
