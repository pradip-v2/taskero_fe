import { useTaskStatusCreate, useTaskStatusList, type TaskStatus } from "@/api";
import TaskStatusForm from "@/components/shared/TaskStatusForm";
import CustomTable from "@/components/shared/custom-table/CustomTable";
import { Flex, LoadingOverlay, Button, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/app/_layout/settings/_layout/meta/_layout/task-statuses"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const [openedTaskStatusFormModal, handlersTaskStatusFormModal] =
    useDisclosure(false);

  const { data: taskStatusList, isLoading, refetch: refetchTaskStatusList } = useTaskStatusList();
  const { mutateAsync: createTaskStatus, isPending } = useTaskStatusCreate();

  return (
    <Flex direction={"column"}>
      <LoadingOverlay visible={isPending || isLoading} />
      <Flex direction={"row"} gap={"sm"}>
        <Button onClick={handlersTaskStatusFormModal.open}>
          Add TaskStatus
        </Button>
        <Modal
          opened={openedTaskStatusFormModal}
          onClose={handlersTaskStatusFormModal.close}
        >
          <TaskStatusForm
            initialData={{}}
            onSave={async (values) => {
              return createTaskStatus({ data: values }).then(() => {
                handlersTaskStatusFormModal.close();
                refetchTaskStatusList();
              });
            }}
            onCancel={function (): void {
              handlersTaskStatusFormModal.close();
            }}
          />
        </Modal>
      </Flex>
      <CustomTable<TaskStatus>
        columns={[
          { header: "ID", accessor: "id" },
          {
            header: "Name",
            accessor: "title",
            render: (row) => <Text>{row.title}</Text>,
          },
        ]}
        data={taskStatusList || []}
      />
    </Flex>
  );
}
