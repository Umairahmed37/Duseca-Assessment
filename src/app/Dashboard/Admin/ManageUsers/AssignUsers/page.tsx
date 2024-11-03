'use client'

import { User } from '@prisma/client';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { Select, Spin, Button } from 'antd';
import { toast } from 'react-hot-toast';
import API from '@/app/api';
import PrimaryButton from '@/components/PrimaryButton';
import Loader from '@/components/Loader';

const { Option } = Select;



const Page = () => {
   const searchParams = useSearchParams();
   const id = searchParams.get('id') || undefined; // Manager ID
   const name = searchParams.get('name') || undefined;

   const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

   //FETCH USERS LIST EXCLUDING ADMINS
   const fetchUsers = async () => {
      const response = await axios.get("/api/users/getusers");
      if (!response) {
         throw new Error("Failed to fetch users");
      }
      return response.data.data.filter((item: User) => item.role === "USER");
   };

   //FETCH USERS LIST QUERY
   const { data: users, isLoading, error } = useQuery<User[]>({
      queryKey: ["AssignUsers"],
      queryFn: fetchUsers,
   });


   //ASSIGN USERS TO MANAGER MUTATION
   const { mutate, isPending, error: deleteError } = useMutation({
      mutationFn: ({ managerId: id, userIds: selectedUserIds }: { managerId: string, userIds: string[] }) => {
         return API.post("/api/users/assignuser", { managerId: id, userIds: selectedUserIds });
      },
      onSuccess: () => {
         toast.success("Users Assigned Successfully!");
         // queryClient.invalidateQueries({ queryKey: ['users'] });

      },
   });

   const handleChange = (value: string[]) => {
      setSelectedUserIds(value);
   };

   const handleAssign = () => {
      if (id) {
         mutate({ managerId: id, userIds: selectedUserIds });
      }
   };

   return (
      <div className='mt-32 mx-auto px-10 py-10'>
         <h2>Assign Users to {name || "Manager"}</h2>
         {isLoading ? (
            <Spin size="large" />
         ) : error ? (
            <p>Failed to load users</p>
         ) : (
            <>
               <Select
                  mode="multiple"
                  allowClear
                  style={{ width: '100%', marginBottom: '1rem', marginTop: '1rem' }}
                  placeholder="Select users to assign"
                  value={selectedUserIds}
                  onChange={handleChange}
               >
                  {users?.map(user => (
                     <Option key={user.id} value={user.id}>
                        {user.name}
                     </Option>
                  ))}
               </Select>
               <div onClick={handleAssign}>
                  <PrimaryButton className='bg-black text-white rounded-md px-5 py-2 cursor-pointer'
                     disabled={!selectedUserIds.length || !id}>
                     {isPending ? <Loader /> : "Assign Selected Users"}
                  </PrimaryButton>
               </div>
            </>
         )}
      </div>
   );
};

export default Page;
