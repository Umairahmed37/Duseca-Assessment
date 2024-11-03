"use client";

import API from "@/app/api";
import DataTable from "@/components/DataTable";
import Loader from "@/components/Loader";
import { TaskStatus } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Space } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

// Define the task type based on the expected data structure
interface Task {
   id: string;
   title: string;
   description: string;
   dueDate: string;
   status: string;
}

// const deleteTask = async () => {
//    const response = await axios.post("/api/tasks/deletetask");
//    if (!response) {
//       throw new Error("Failed to delete task");
//    }
//    return response.data.data;
// };

const TasksPage = () => {
   const router = useRouter();
   const queryClient = useQueryClient();
   const session = useSession()
   const sessionId = session.data?.user.id
   const searchParams = useSearchParams()
   const id = searchParams.get('id') || undefined; // User ID
   const Name = searchParams.get('name') || undefined; // User ID
   const [DeleteTaskid, setDeleteTaskid] = useState('')

   const fetchTasks = async () => {
      const response = await axios.post("/api/tasks/gettasks", { userId: id });
      if (!response) {
         throw new Error("Failed to fetch tasks");
      }
      return response.data.data;
   };

   //QUERY TO FETCH ALL USER TASKS
   const { data: tasks, isLoading, error } = useQuery<Task[]>({
      queryKey: ["Usertasks", id],
      queryFn: fetchTasks,
   });


   //MUTATION TO DELETE A TASK
   const { mutate, isPending, error: deleteError } = useMutation({
      mutationFn: (taskId: string) => {
         return API.post("/api/tasks/deletetask", { taskId: taskId });
      },
      onSuccess: () => {
         toast.success("Task deleted successfully!");
         queryClient.invalidateQueries({ queryKey: ['tasks'] });
         queryClient.invalidateQueries({ queryKey: ['Usertasks'] });
      },
   });

   const handleDelete = (id: string) => {
      setDeleteTaskid(id)
      mutate(id);
   };

   const handleEdit = (id: string) => {
      router.push(`/Dashboard/Manager/Tasks/AddTask?id=${id}`);
   };

   const handleView = (id: string) => {
      router.push(`/Dashboard/Manager/Tasks/AddTask?id=${id}`);
   };

   // Define columns for the Ant Design table
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
               <Button danger
                  onClick={() =>
                     handleDelete(record.id)}
                  disabled={isPending && record.id === DeleteTaskid}
               >
                  {/* {isPending ? "Loading" : "Delete"} */}
                  {isPending && record.id === DeleteTaskid ? "Loading" : "Delete"}

               </Button>
            </Space>
         ),
      },
   ];

   // if (isLoading) return <div>Loading...</div>;
   if (isLoading) return <div className="mx-auto flex self-center mb-20">
      <Loader className="h-16 w-16 border-[#1F2937]" />
   </div>;
   if (error) return <div>Error loading tasks</div>;

   return (
      <div className="mx-auto pt-20 w-full px-32">

         <div className="text-md mb-5 mt-5">
            Currently Showing Tasks of {Name}
         </div>


         {/* <Link href={"/Dashboard/Manager/Tasks/AddTask"}>
            <PrimaryButton parentClassName="w-40 ml-auto bg-black text-white rounded-lg w-fit px-5 py-1 mb-10">
               Add New Task
            </PrimaryButton>
         </Link> */}
         <DataTable columns={columns} data={tasks || []} />
      </div>
   );
};

export default TasksPage;
