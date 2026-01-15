import {
  useUsersSearchRetrieve,
  type ProjectsCreateMutationRequest,
} from "@/api";
import { getError } from "@/utils/error-utility";
import { Button, Flex, Input, LoadingOverlay, Select } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useFormik } from "formik";
import { useMemo } from "react";
import * as Yup from "yup";

interface ProjectFormProps {
  initialData?: Partial<ProjectsCreateMutationRequest>;
  onSave: (values: ProjectsCreateMutationRequest) => Promise<any>;
  onCancel: () => void;
}

const ProjectForm = ({ initialData, onSave, onCancel }: ProjectFormProps) => {
  const projectFormValidation = useMemo(() => {
    return Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string(),
    });
  }, []);

  const { data: usersList, isLoading } = useUsersSearchRetrieve();

  const formik = useFormik<ProjectsCreateMutationRequest>({
    initialValues: {
      title: "",
      description: "",
      ...initialData,
    },
    validationSchema: projectFormValidation,
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
      <LoadingOverlay visible={isLoading} />
      <Flex direction={"column"}>
        <Input.Wrapper label="Title" error={formik.errors.title}>
          <Input
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Input.Wrapper>
        <Input.Wrapper label="Description" error={formik.errors.description}>
          <Input
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Input.Wrapper>
        <Input.Wrapper label="Owner" error={formik.errors.owner}>
          <Select
            name="owner"
            data={
              usersList?.results?.map((user) => ({
                value: user.id.toString(),
                label: user.name?.toString() ?? "Unnamed User",
              })) || []
            }
            value={formik.values.owner as any}
            onChange={(value) => formik.setFieldValue("owner", value)}
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

export default ProjectForm;
