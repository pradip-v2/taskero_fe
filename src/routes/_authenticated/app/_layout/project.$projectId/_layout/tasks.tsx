import { useProjectsTasksList, useTasksCreate, type Task } from "@/api";
import TaskForm from "@/components/project/TaskForm";
import CustomTable from "@/components/shared/custom-table/CustomTable";
import type { PaginationProps } from "@/types/PaginationProps";
import { validatePaginationParams } from "@/utils/search-param-utils";
import { Button, Flex, Modal, SegmentedControl } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { useDisclosure } from "@mantine/hooks";

export const Route = createFileRoute(
  "/_authenticated/app/_layout/project/$projectId/_layout/tasks"
)({
  validateSearch: (
    search: any
  ): PaginationProps & {
    view: "plain" | "nested";
  } => {
    return {
      ...validatePaginationParams(search),
      view:
        search.view === "plain" || search.view === "nested"
          ? search.view
          : "plain",
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { projectId } = Route.useParams();
  const search = Route.useSearch();
  const { page_no = 1, page_size = 10, view = "plain" } = search;
  const [openedAddTaskModal, handlersAddTaskModal] = useDisclosure(false);

  const { data: paginatedTasks, refetch: refetchTasks } = useProjectsTasksList(
    projectId,
    {
      page_no: page_no,
      page_size: page_size,
      level: view === "nested" ? 1 : undefined,
    },
    {
      query: {
        queryKey: ["project-tasks", projectId, search, view],
      },
    }
  );

  const { mutateAsync: createTask } = useTasksCreate();

  return (
    <Flex direction={"column"} w={"100%"}>
      <Flex w={"100%"} gap={"sm"}>
        <SegmentedControl
          value={view}
          onChange={(value) =>
            navigate({
              search: { ...search, view: value as "plain" | "nested" },
            })
          }
          data={[
            { label: "Plain", value: "plain" },
            { label: "Nested", value: "nested" },
          ]}
        />
        <Button onClick={handlersAddTaskModal.open}>Add Task</Button>
        <Modal opened={openedAddTaskModal} onClose={handlersAddTaskModal.close}>
          <TaskForm
            initialData={{
              project: projectId ? +projectId : (null as any),
            }}
            onSave={async (values) => {
              return createTask({ data: values }).then(() => {
                handlersAddTaskModal.close();
                refetchTasks();
              });
            }}
            onCancel={function (): void {
              handlersAddTaskModal.close();
            }}
          />
        </Modal>
      </Flex>
      <CustomTable<Task>
        columns={[
          {
            header: "ID",
            accessor: "id",
          },
          {
            header: "Title",
            accessor: "title",
          },
          {
            header: "Assignee",
            accessor: "assignee_data",
            render: (row) => row.assignee_data?.name,
          },
        ]}
        data={paginatedTasks?.results || []}
        paginated
        paginationProps={{
          pageSize: page_size,
          currentPage: page_no,
          totalRecords: paginatedTasks?.count || 0,
          onPageChange: (page: number) => {
            navigate({ search: { ...search, page_no: page } });
          },
        }}
      />
    </Flex>
  );
}
