"use client";

import { Button, Space, message, Modal } from "antd";
// import TableComponent from "@/components/TableComponent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/DataTable";
import axios from "axios";
import Link from "next/link";
import PrimaryButton from "@/components/PrimaryButton";
import API from "@/app/api";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";

// Define the user type based on the expected data structure
interface User {
   id: string;
   name: string;
   email: string;
   role: string;
}

const fetchUsers = async () => {
   const response = await axios.get("/api/users/getusers");
   if (!response) {
      throw new Error("Failed to fetch users");
   }
   console.log(response.data)
   return response.data.data;
};

const deleteUser = async () => {
   const response = await axios.post("/api/users/deleteuser");
   if (!response) {
      throw new Error("Failed to fetch users");
   }
   console.log(response.data)
   return response.data.data;
};

const UsersPage = () => {

   const router = useRouter();
   const queryClient = useQueryClient();
   const [ItemDeleting, setItemDeleting] = useState("")


   const { data: users, isLoading, error } = useQuery<User[]>({
      queryKey: ["Adminusers"],
      queryFn: fetchUsers,
   });

   const { mutate, isPending, error: deleteError } = useMutation({
      mutationFn: (userId: string) => {
         return API.post("/api/users/deleteuser", { userId: userId });
      },
      onSuccess: () => {
         toast.success("User and all its tasks deleted successfully!");
         queryClient.invalidateQueries({ queryKey: ['Adminusers'] });

         //   push("/login");
      },
   });


   const handleDelete = (id: string) => {
      setItemDeleting(id)
      mutate(id)
   };

   const handleEdit = (id: string) => {
      router.push(`/Dashboard/Admin/ManageUsers/User?id=${id}`);
   };

   const handleView = (id: string) => {
      router.push(`/Dashboard/Admin/ManageUsers/User?id=${id}`);
   };

   const handleManageUsers = (user: User) => {
      router.push(`/Dashboard/Admin/ManageUsers/AssignUsers?id=${user.id}&&name=${user.name}`);
   };

   const handleTask = (user: User) => {
      router.push(`/Dashboard/Admin/ManageUsers/UserTasks?id=${user.id}&&name=${user.name}`);
   };


   // Define columns for the Ant Design table
   const columns = [
      {
         title: "Name",
         dataIndex: "name",
         key: "name",
      },
      {
         title: "Email",
         dataIndex: "email",
         key: "email",
      },
      {
         title: "Role",
         dataIndex: "role",
         key: "role",
      },
      {
         title: "Actions",
         key: "actions",
         render: (_: any, record: User) => (
            <Space size="middle">
               <Button onClick={() => handleView(record.id)}>View</Button>
               <Button onClick={() => handleEdit(record.id)}>Edit</Button>
               <Button onClick={() => handleTask(record)}>Tasks</Button>
               {record.role === 'MANAGER' && <Button onClick={() => handleManageUsers(record)}>Assign Users</Button>}
               <Button danger
                  onClick={() => handleDelete(record.id)}
                  disabled= {isPending && (record.id === ItemDeleting) }  
                  >
                  {
                     isPending && (record.id === ItemDeleting) ? "Loading" : "Delete"
                  }
               </Button>
            </Space>
         ),
      },
   ];

   // if (isLoading) return <div>Loading...</div>;
   if (isLoading) return <div className="mx-auto flex self-center mb-20">
      <Loader className="h-16 w-16 border-[#1F2937]" />
   </div>;
   if (error) return <div>Error loading users</div>;

   return (
      <div className="mx-auto pt-20 w-full px-32">
         <Link href={"/Dashboard/Admin/ManageUsers/User"}>
            <PrimaryButton parentClassName="w-40 ml-auto bg-black text-white rounded-lg py-1 mb-10">
               Add New User
            </PrimaryButton>
         </Link>
         <DataTable columns={columns} data={users || []} />
      </div>
   );
};

export default UsersPage;