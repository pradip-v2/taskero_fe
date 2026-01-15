import {
  useProjectMembersCreate,
  useProjectsProjectWiseProjectMembersList,
  type ProjectWiseMember,
} from "@/api";
import ProjectMemberForm from "@/components/project/ProjectMemberForm";
import CustomTable from "@/components/shared/custom-table/CustomTable";
import type { PaginationProps } from "@/types";
import { validatePaginationParams } from "@/utils/search-param-utils";
import { Button, Flex, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute(
  "/_authenticated/app/_layout/project/$projectId/_layout/members"
)({
  validateSearch: (search: any): PaginationProps => {
    return {
      ...validatePaginationParams(search),
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { projectId } = Route.useParams();
  const [paginationProps, setPaginationProps] = useState({
    page_no: 1,
    page_size: 10,
  });
  const [openedAddMemberModal, handlersAddMemberModal] = useDisclosure(false);

  const { data: paginatedProjectMembers, refetch: refetchProjectMembers } =
    useProjectsProjectWiseProjectMembersList(
      projectId,
      {
        ...paginationProps,
      },
      {
        query: {
          queryKey: ["project-wise-members", projectId, paginationProps],
        },
      }
    );

  const { mutateAsync: createProjectMember } = useProjectMembersCreate();

  return (
    <Flex direction={"column"} w={"100%"}>
      <Flex w={"100%"} mb={"md"}>
        <Button onClick={handlersAddMemberModal.open}>Add Member</Button>
        <Modal
          opened={openedAddMemberModal}
          onClose={handlersAddMemberModal.close}
        >
          <ProjectMemberForm
            initialData={{
              project: projectId ? +projectId : (null as any),
            }}
            onSave={async (values) => {
              return createProjectMember({ data: values }).then(() => {
                handlersAddMemberModal.close();
                refetchProjectMembers();
              });
            }}
            onCancel={function (): void {
              handlersAddMemberModal.close();
            }}
          />
        </Modal>
      </Flex>
      <CustomTable<ProjectWiseMember>
        columns={[
          {
            header: "ID",
            accessor: "member_data",
            render: (row) => String(row.member_data?.id),
          },
          {
            header: "Username",
            accessor: "member_data",
            render: (row) => row.member_data?.name,
          },
          {
            header: "Email",
            accessor: "member_data",
            render: (row) => row.member_data?.email,
          },
        ]}
        data={paginatedProjectMembers?.results || []}
        paginated
        paginationProps={{
          pageSize: paginationProps.page_size,
          currentPage: 1,
          totalRecords: paginatedProjectMembers?.count || 0,
          onPageChange: (page: number) => {
            setPaginationProps((prev) => ({
              ...prev,
              page_no: page,
            }));
          },
        }}
      />
    </Flex>
  );
}
