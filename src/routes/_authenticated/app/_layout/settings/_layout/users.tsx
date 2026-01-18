import { useUsersCreate, useUsersList, type User } from "@/api";
import UserForm from "@/components/users/UserForm";
import CustomTable from "@/components/shared/custom-table/CustomTable";
import { validatePaginationParams } from "@/utils/search-param-utils";
import { Flex, Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { PaginationProps } from "@/types/PaginationProps";

export const Route = createFileRoute(
  "/_authenticated/app/_layout/settings/_layout/users"
)({
  validateSearch: (search: any): PaginationProps => {
    return {
      ...validatePaginationParams(search),
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const [paginationProps, setPaginationProps] = useState({
    page_no: 1,
    page_size: 10,
  });
  const [openedAddUserModal, handlersAddUserModal] = useDisclosure(false);

  const { data: paginatedUsers, refetch: refetchUsers } = useUsersList(
    {
      ...paginationProps,
    },
    {
      query: {
        queryKey: ["users", paginationProps],
      },
    }
  );

  const { mutateAsync: createUser } = useUsersCreate();

  return (
    <Flex direction={"column"} w={"100%"}>
      <Flex w={"100%"} mb={"md"}>
        <Button onClick={handlersAddUserModal.open}>Add User</Button>
        <Modal opened={openedAddUserModal} onClose={handlersAddUserModal.close}>
          <UserForm
            initialData={{}}
            onSave={async (values) => {
              return createUser({ data: values }).then(() => {
                handlersAddUserModal.close();
                refetchUsers();
              });
            }}
            onCancel={function (): void {
              handlersAddUserModal.close();
            }}
          />
        </Modal>
      </Flex>
      <CustomTable<User>
        columns={[
          {
            header: "ID",
            accessor: "id",
            render: (row) => String(row?.id),
          },
          {
            header: "Name",
            accessor: "name",
            render: (row) => row?.name,
          },
          {
            header: "Email",
            accessor: "email",
            render: (row) => row?.email,
          },
        ]}
        data={paginatedUsers?.results || []}
        paginated
        paginationProps={{
          pageSize: paginationProps.page_size,
          currentPage: 1,
          totalRecords: paginatedUsers?.count || 0,
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
