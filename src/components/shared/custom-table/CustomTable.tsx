import { Flex, Pagination, Table } from "@mantine/core";

export interface CustomTableColumn<T> {
  header: string;
  accessor: keyof T;
  render?: (row: T) => React.ReactNode;
}

export interface BaseCustomTableProps<T> {
  columns: CustomTableColumn<T>[];
  data: T[];
  paginated?: boolean;
  paginationProps?: CustomTablePaginationProps;
}

export interface CustomTablePaginationProps {
  pageSize: number;
  currentPage: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
}

type CustomTableProps<T> = BaseCustomTableProps<T>;

const CustomTable = <T,>({
  columns,
  data,
  paginated = false,
  paginationProps,
}: CustomTableProps<T>) => {
  return (
    <Flex direction="column" gap="md">
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            {columns.map((col, colIndex) => (
              <Table.Th key={colIndex}>{col.header}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((row, rowIndex) => (
            <Table.Tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <Table.Td key={colIndex}>
                  {col.render ? col.render(row) : String(row[col.accessor])}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      {paginated && paginationProps && (
        <Pagination
          value={paginationProps.currentPage}
          onChange={paginationProps.onPageChange}
          total={Math.ceil(
            paginationProps.totalRecords / paginationProps.pageSize
          )}
        />
      )}
    </Flex>
  );
};

export default CustomTable;
