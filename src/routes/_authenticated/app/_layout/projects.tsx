import { useProjectsCreate, useProjectsList, type Project } from "@/api";
import ProjectForm from "@/components/project/ProjectForm";
import CustomTable from "@/components/shared/custom-table/CustomTable";
import { Anchor, Button, Flex, LoadingOverlay, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/app/_layout/projects")({
  component: RouteComponent,
});

function RouteComponent() {
  const [openedProjectFormModal, handlersProjectFormModal] =
    useDisclosure(false);

  const { data, isLoading, refetch: refetchProjectsList } = useProjectsList();
  const { mutateAsync: createProject, isPending } = useProjectsCreate();

  return (
    <Flex direction={"column"}>
      <LoadingOverlay visible={isLoading || isPending} />
      <Flex direction={"row"} gap={"sm"}>
        <Button onClick={handlersProjectFormModal.open}>Add Project</Button>
        <Modal
          opened={openedProjectFormModal}
          onClose={handlersProjectFormModal.close}
        >
          <ProjectForm
            initialData={{}}
            onSave={async (values) => {
              return createProject({ data: values }).then(() => {
                handlersProjectFormModal.close();
                refetchProjectsList();
              });
            }}
            onCancel={function (): void {
              handlersProjectFormModal.close();
            }}
          />
        </Modal>
      </Flex>
      <CustomTable<Project>
        columns={[
          { header: "ID", accessor: "id" },
          {
            header: "Name",
            accessor: "title",
            render: (row) => (
              <Anchor
                component={Link}
                to={"/app/project/" + row.id + "/summary"}
              >
                {row.title}
              </Anchor>
            ),
          },
          { header: "Description", accessor: "description" },
        ]}
        data={data?.results || []}
      />
    </Flex>
  );
}
