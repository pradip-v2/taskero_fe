import { useTaskStatusList, type TasksCreateMutationRequest } from "@/api";
import { getError } from "@/utils/error-utility";
import { Button, Checkbox, Flex, Input, Select } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useFormik } from "formik";
import { useMemo } from "react";
import * as Yup from "yup";

interface TaskFormProps {
  initialData?: Partial<TasksCreateMutationRequest>;
  onSave: (values: TasksCreateMutationRequest) => Promise<any>;
  onCancel: () => void;
}

const TaskForm = ({ initialData, onSave, onCancel }: TaskFormProps) => {
  const { data: taskStatusList } = useTaskStatusList();

  const taskFormValidation = useMemo(() => {
    return Yup.object({
      project: Yup.number().required("Project is required"),
      title: Yup.string().required("Title is required"),
      description: Yup.string(),
    });
  }, []);

  const formik = useFormik<TasksCreateMutationRequest>({
    initialValues: {
      project: null as any,
      title: "",
      description: "",
      level: 0,
      is_done: false,
      parent_task: null as any,
      status: null as any,
      assignee: null as any,
      ...initialData,
    },
    validationSchema: taskFormValidation,
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
        <Input.Wrapper label="Project" error={formik.errors.project}>
          <Input
            name="project"
            value={formik.values.project}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Input.Wrapper>
        <Input.Wrapper label="Assignee" error={formik.errors.assignee}>
          <Input
            name="assignee"
            value={formik.values.assignee as any}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Input.Wrapper>
        <Input.Wrapper label="Status" error={formik.errors.status}>
          <Select
            name="status"
            value={formik.values.status?.toString() ?? null}
            onChange={(value) =>
              formik.setFieldValue("status", value ? parseInt(value, 10) : null)
            }
            onBlur={formik.handleBlur}
            data={
              taskStatusList
                ? taskStatusList.map((status) => ({
                    value: status.id.toString(),
                    label: status.title,
                  }))
                : []
            }
            placeholder="Select Status"
            clearable
          />
        </Input.Wrapper>
        <Input.Wrapper label="Parent Task" error={formik.errors.parent_task}>
          <Input
            name="parent_task"
            value={formik.values.parent_task as any}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Input.Wrapper>
        <Input.Wrapper label="Level" error={formik.errors.level}>
          <Input
            name="level"
            type="number"
            value={formik.values.level}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Input.Wrapper>
        <Input.Wrapper label="Is Done" error={formik.errors.is_done}>
          <Checkbox
            name="is_done"
            type="checkbox"
            checked={formik.values.is_done}
            onChange={formik.handleChange("is_done")}
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

export default TaskForm;
