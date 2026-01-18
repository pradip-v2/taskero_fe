import { Flex, Pagination, Table } from "@mantine/core";
import { createContext, useContext } from "react";

export interface CustomTableColumn<T> {
  header: string;
  accessor: keyof T;
  render?: (row: T) => React.ReactNode;
}

export interface CustomTablePaginationProps {
  pageSize: number;
  currentPage: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
}

export interface BaseCustomTableProps<T> {
  columns: CustomTableColumn<T>[];
  data: T[];
  childrenMap: {
    [key: number]: {
      children: T[];
      isLoading: boolean;
      isFetching: boolean;
      isExpanded: boolean;
    };
  };
  paginated?: boolean;
  paginationProps?: CustomTablePaginationProps;
}

type CustomTableContextType<T> = {
  columns: CustomTableColumn<T>[];
  data: T[];
  childrenMap: {
    [key: number]: {
      children: T[];
      isLoading: boolean;
      isFetching: boolean;
      isExpanded: boolean;
    };
  };
};

const CustomTableContext = createContext<CustomTableContextType<any> | null>(
  null
);

const CustomNestedRow = <T,>({
  row,
  rowIndex,
}: {
  row: T;
  rowIndex: number;
}) => {
  const context: CustomTableContextType<T> | null =
    useContext(CustomTableContext);
  if (!context) return null;
  const { childrenMap, columns } = context;
  const childData = childrenMap[(row as any)?.["id"]];

  // if (!childData || !childData.isExpanded) return null;

  return (
    <>
      <Table.Tr key={rowIndex}>
        {columns.map((col, colIndex) => (
          <Table.Td key={colIndex}>
            {col.render ? col.render(row) : String(row[col.accessor])}
          </Table.Td>
        ))}
      </Table.Tr>
      {childrenMap[(row as any)?.["id"] as unknown as number]?.isExpanded &&
        childData?.children?.map((subRow, subRowIndex) => (
          <CustomNestedRow<T>
            key={`${rowIndex}-${subRowIndex}`}
            row={subRow}
            rowIndex={subRowIndex}
          />
        ))}
    </>
  );
};

type CustomNestedTableProps<T> = BaseCustomTableProps<T>;

const CustomNestedTable = <T,>({
  columns,
  data,
  paginated = false,
  paginationProps,
  childrenMap,
}: CustomNestedTableProps<T>) => {
  return (
    <CustomTableContext.Provider value={{ columns, data, childrenMap }}>
      <Flex direction="column" gap="md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              {columns.map((col, colIndex) => (
                <Table.Th key={colIndex} w={colIndex == 0 ? 30 : undefined}>
                  {col.header}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map((row, rowIndex) => (
              <CustomNestedRow<T>
                key={rowIndex}
                row={row}
                rowIndex={rowIndex}
              />
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
    </CustomTableContext.Provider>
  );
};

export default CustomNestedTable;
