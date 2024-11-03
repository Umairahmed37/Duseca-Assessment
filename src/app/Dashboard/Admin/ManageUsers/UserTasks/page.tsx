"use client";

import DataTable from "@/components/DataTable";
import Loader from "@/components/Loader";
import { TaskStatus } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Select, Space } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

// const { Option } = Select;

interface Task {
   id: string;
   title: string;
   description: string;
   dueDate: string;
   status: string;
}

const TasksPage = () => {
   const router = useRouter();
   const searchParams = useSearchParams();
   const id = searchParams.get('id') || undefined;
   const Name = searchParams.get('name') || undefined;

   const [DeleteTaskid, setDeleteTaskid] = useState('');
   const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
   const [dueDateFilter, setDueDateFilter] = useState<string | undefined>(undefined);

   //FETCH ALL TASKS OF A CERTAIN USER
   const fetchTasks = async () => {
      const response = await axios.post("/api/tasks/gettasks", {
         userId: id,
         // status: statusFilter,
         // dueDate: dueDateFilter,
      });
      if (!response) throw new Error("Failed to fetch tasks");
      return response.data.data;
   };

   //QUERY TO FETCH ALL TASKS OF A CERTAIN USER
   const { data: tasks, isLoading, error, refetch } = useQuery<Task[]>({
      queryKey: ["Usertasks", statusFilter, dueDateFilter],
      queryFn: fetchTasks,
   });

   //MUTATION TO DELETE A SPECIFIC TASK
   const { mutate, isPending } = useMutation({
      mutationFn: (taskId: string) => {
         return axios.post("/api/tasks/deletetask", { taskId });
      },
      onSuccess: () => {
         toast.success("Task deleted successfully!");
         // queryClient.invalidateQueries(["Usertasks"]);
      },
   });

   const handleDelete = (id: string) => {
      setDeleteTaskid(id);
      mutate(id);
   };

   const handleEdit = (id: string) => {
      router.push(`/Dashboard/Admin/ManageUsers/AddTask?id=${id}`);
   };

   const handleView = (id: string) => {
      router.push(`/Dashboard/Admin/ManageUsers/AddTask?id=${id}`);
   };

   const columns = [
      {
         title: "Title",
         dataIndex: "title",
         key: "title",
      },
      {
         title: "Description",
         dataIndex: "description",
         key: "description",
      },
      {
         title: "Due Date",
         dataIndex: "dueDate",
         key: "dueDate",
         sorter: (a: Task, b: Task) => dayjs(a.dueDate).isBefore(b.dueDate) ? -1 : 1,

      },
      {
         title: "Status",
         dataIndex: "status",
         key: "status",
         filters: [
            { text: "Pending", value: TaskStatus.PENDING },
            { text: "Completed", value: TaskStatus.COMPLETED },
            { text: "In Progress", value: TaskStatus.IN_PROGRESS },
         ],
         onFilter: (value: string, record: Task) => record.status === value,
      },
      {
         title: "Actions",
         key: "actions",
         render: (_: any, record: Task) => (
            <Space size="middle">
               <Button onClick={() => handleView(record.id)}>View</Button>
               <Button onClick={() => handleEdit(record.id)}>Edit</Button>
               <Button
                  danger
                  onClick={() => handleDelete(record.id)}
                  disabled={isPending && record.id === DeleteTaskid}
               >
                  {isPending && record.id === DeleteTaskid ? "Loading" : "Delete"}
               </Button>
            </Space>
         ),
      },
   ];

   if (isLoading) return <Loader className="h-16 w-16 border-[#1F2937] mx-auto mt-20" />;
   if (error) return <div>Error loading tasks</div>;

   return (
      <div className="mx-auto pt-20 w-full px-32">
         <div className="text-md mb-5 mt-5">Currently Showing Tasks of {Name}</div>
         <DataTable columns={columns} data={tasks || []} />
      </div>
   );
};

export default TasksPage;