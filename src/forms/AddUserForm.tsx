"use client";

import API from "@/app/api";
import z from "@/app/zod";
import Loader from "@/components/Loader";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Select } from "antd";
import axios from "axios";
import { useCallback, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";
import { z as zod } from "zod";

const { Option } = Select;

// Define schema with new role field
const schema = z.object({
   name: z.string(),
   email: z.string().email(),
   password: z.string().min(1, "Password must contain at least 1 character"),
   role: z.enum(["MANAGER", "USER"]).default("USER"),
});

type IFormData = zod.infer<typeof schema>;

const AddUserForm = ({ userId }: { userId?: string | string[] }) => {

   const queryClient = useQueryClient()

   //FETCH SPECIFIC USER 
   const fetchUsers = async () => {

      if (userId) {
         const response = await axios.post("/api/users/getusers", {
            userId: userId,
         });
         console.log(response.data.data)
         if (!response) {
            throw new Error("Failed to fetch users");
         }
         return response.data.data;
      }
   };

   //QUERY TO FETCH SPECIFIC USER
   const { data: users, isLoading } = useQuery<User>({
      queryKey: ["users", userId],
      queryFn: fetchUsers,
      enabled: !!userId, // Only run the query if userId is defined
   });

   const {
      register,
      handleSubmit,
      control,
      reset,
      formState: { errors },
   } = useForm<IFormData>({
      resolver: zodResolver(schema),
      defaultValues: {
         name: "",
         email: "",
         password: "",
         role: "USER",
      },
   });

   // EFFECT TO UPDATE FORM VALUES WHEN USER DATA IS FETCHED
   useEffect(() => {
      if (users) {
         reset({
            name: users.name || undefined,
            email: users.email,
            // password: users.password, // Clear password field on edit
            role: users.role === 'ADMIN' ? undefined : users.role || "USER", // Default to "USER" if no role provided
         });
      }
   }, [users, reset]);

   // MUTATION TO ADD USER
   const { mutate, isPending, error } = useMutation({
      mutationFn: (data: IFormData) => API.post("/api/auth/signup", data),
      onSuccess: () => {
         toast.success("User Added successfully");
         queryClient.invalidateQueries({ queryKey: ['Adminusers'] });
         queryClient.invalidateQueries({ queryKey: ['Mytasks'] });
      },
   });

   // MUTATION TO UPDATE USER
   const { mutate: updateUser, isPending: UpdatePending, error: UpdateError } = useMutation({
      mutationFn: (data: IFormData) => API.post("/api/users/updateuser", { userId, ...data }),
      onSuccess: () => {
         toast.success("User Updated successfully");
      },
   });

   const errorMessage = errors.email?.message ?? errors.password?.message ?? error?.message;

   //SUBMIT ADD OR UPDATE USER 
   const onSubmit = useCallback<SubmitHandler<IFormData>>(
      (data) => {
         if (userId) {
            updateUser(data);
         } else {
            mutate(data);
         }
      },
      [mutate]
   );

   if (isLoading) return <Loader />;

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
         <div className="rounded bg-white border-black border-2 h-[2.625rem]">
            <input
               type="text"
               placeholder="Enter Name"
               className="px-2 bg-transparent outline-none text-primary h-full w-full placeholder:text-[#A5ADBA]"
               {...register("name")}
            />
         </div>
         <div className="rounded bg-white border-black border-2 h-[2.625rem]">
            <input
               type="email"
               placeholder="Enter your email"
               className="px-2 bg-transparent outline-none text-primary h-full w-full placeholder:text-[#A5ADBA]"
               {...register("email")}
            />
         </div>
         <div className="rounded bg-white border-black border-2 h-[2.625rem]">
            <input
               type="password"
               placeholder="Enter your password"
               className="px-2 bg-transparent outline-none text-primary h-full w-full placeholder:text-[#A5ADBA]"
               {...register("password")}
            />
         </div>

         {/* New Roles dropdown */}
         <div className="rounded bg-white h-[2.625rem]">
            <Controller
               name="role"
               control={control}
               render={({ field }) => (
                  <Select
                     {...field}
                     placeholder="Select Role"
                     className="w-full"
                     onChange={(value) => field.onChange(value)}
                  >
                     <Option value="MANAGER">Manager</Option>
                     <Option value="USER">User</Option>
                  </Select>
               )}
            />
            {errors.role && <p style={{ color: "red" }}>{errors.role.message}</p>}
         </div>

         {errorMessage && (
            <span className="rounded-md px-4 py-2 grid place-items-center self-start text-xs bg-[#FC3737] text-white">
               {errorMessage}
            </span>
         )}

         <button
            type="submit"
            disabled={isPending}
            className={twMerge(
               "h-[2.625rem] grid place-items-center rounded text-white bg-black transition-colors",
               isPending ? "bg-gray" : "bg-gradient-to-br from-purple to-pink"
            )}
         >
            {isPending || UpdatePending ? <Loader /> : userId ? "Edit User" : "Add User"}
         </button>
      </form>
   );
};

export default AddUserForm;
