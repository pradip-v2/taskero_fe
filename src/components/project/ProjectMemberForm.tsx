import type { ProjectMembersCreateMutationRequest } from "@/api";
import { getError } from "@/utils/error-utility";
import { Button, Flex, Input } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useFormik } from "formik";
import { useMemo } from "react";
import * as Yup from "yup";

interface ProjectMemberFormProps {
  initialData?: Partial<ProjectMembersCreateMutationRequest>;
  onSave: (values: ProjectMembersCreateMutationRequest) => Promise<any>;
  onCancel: () => void;
}

const ProjectMemberForm = ({
  initialData,
  onSave,
  onCancel,
}: ProjectMemberFormProps) => {
  const projectMemberFormValidation = useMemo(() => {
    return Yup.object({
      project: Yup.number().required("Project is required"),
      member: Yup.number().required("Member is required"),
    });
  }, []);

  const formik = useFormik<ProjectMembersCreateMutationRequest>({
    initialValues: {
      project: null as any,
      member: null as any,
      ...initialData,
    },
    validationSchema: projectMemberFormValidation,
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
        <Input.Wrapper label="Project" error={formik.errors.project}>
          <Input
            name="project"
            value={formik.values.project}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Input.Wrapper>
        <Input.Wrapper label="Member" error={formik.errors.member}>
          <Input
            name="member"
            value={formik.values.member}
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

export default ProjectMemberForm;
