// components/TableComponent.tsx
import { Table } from "antd";
import dayjs from "dayjs";

interface TableComponentProps<T> {
  columns: Array<any>;
  data: T[];
}

const DataTable = <T extends object>({ columns, data }: TableComponentProps<T>) => {
  return <Table columns={columns} dataSource={data} rowKey="id" style={{ width: '100%' }} />;
};

export default DataTable;