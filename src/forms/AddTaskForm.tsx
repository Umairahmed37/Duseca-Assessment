"use client";

import API from "@/app/api";
import z from "@/app/zod";
import Loader from "@/components/Loader";
import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Select } from "antd";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";
import { z as zod } from "zod";

const { Option } = Select;

// Define schema for task
const schema = z.object({
   title: z.string().min(1, "Title is required"),
   description: z.string().optional(),
   dueDate: z.string().optional(), // Use string to handle date input
   status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).default("PENDING"),
});

type IFormData = zod.infer<typeof schema>;

const AddTaskForm = ({ taskId, role }: { taskId?: string | string[], role?: Role }) => {

   const session = useSession()
   const sessionId = session.data?.user.id
   const queryClient = useQueryClient()

   const {
      register,
      handleSubmit,
      control,
      reset,
      formState: { errors },
   } = useForm<IFormData>({
      resolver: zodResolver(schema),
      defaultValues: {
         title: "",
         description: "",
         dueDate: "",
         status: "PENDING",
      },
   });

   // FETCH SPECIFIC TASK 
   const fetchTask = async () => {
      if (taskId) {
         const response = await axios.post("/api/tasks/gettasks", {
            taskId: taskId,
         });
         if (!response) {
            throw new Error("Failed to fetch users");
         }
         return response.data.data;
      }
   };

   // FETCH SPECIFIC TASK QUERY
   const { data: task, isLoading } = useQuery({
      queryKey: ["task", taskId],
      queryFn: fetchTask,
      enabled: !!taskId, // Only run the query if taskId is defined
   });

   // EFFECT TO UPDATE FORM VALUES WHEN TASK DATA IS FETCHED
   useEffect(() => {
      if (task) {
         const date = new Date(task.dueDate);
         const formattedDate = date.toISOString().split("T")[0]; // "2024-11-01 FORMAT"

         reset({
            title: task.title || "",
            description: task.description || "",
            dueDate: formattedDate || "",
            status: task.status || "PENDING",
         });
      }
   }, [task, reset]);


   //ADD TASK MUTATION 
   const { mutate, isPending, error } = useMutation({
      mutationFn: (data: IFormData) => API.post("/api/tasks/addtask", { userId: sessionId, ...data }),
      onSuccess: () => {
         toast.success("Task Added successfully");
         queryClient.invalidateQueries({ queryKey: ['Mytasks'] });
      },
   });

   //UPDATE TASK MUTATION
   const { mutate: updateTask, isPending: UpdatePending, error: UpdateError } = useMutation({
      mutationFn: (data: IFormData) => API.post("/api/tasks/updatetask", { taskId: taskId, ...data }),
      onSuccess: () => {
         toast.success("Task Updated successfully");
         queryClient.invalidateQueries({ queryKey: ['Mytasks'] });
      },
   });

   const errorMessage = errors.title?.message ?? error?.message;


   //SUBMIT TASK ADD OR EDIT
   const onSubmit = useCallback<SubmitHandler<IFormData>>(
      (data) => {
         if (taskId) {
            updateTask(data);
         } else {
            mutate(data);
         }
      },
      [mutate]
   );

   if (isLoading) return <Loader />;

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 w-[350px]">
         <div className="rounded bg-white border-black border-2 h-[2.625rem]">
            <input
               type="text"
               placeholder="Enter Task Title"
               className="px-2 bg-transparent outline-none text-primary h-full w-full placeholder:text-[#A5ADBA]"
               {...register("title")}
            />
         </div>
         <div className="rounded bg-white border-black border-2 h-[5rem]">
            <textarea
               placeholder="Enter Task Description"
               className="px-2 bg-transparent outline-none text-primary h-full w-full placeholder:text-[#A5ADBA]"
               {...register("description")}
            />
         </div>
         <div className="rounded bg-white border-black border-2 h-[2.625rem]">
            <input
               type="date"
               className="px-2 bg-transparent outline-none text-primary h-full w-full"
               {...register("dueDate")}
            />
         </div>

         {/* Task Status dropdown */}
         <div className="rounded bg-white h-[2.625rem]">
            <Controller
               name="status"
               control={control}
               render={({ field }) => (
                  <Select
                     {...field}
                     placeholder="Select Status"
                     className="w-full"
                     onChange={(value) => field.onChange(value)}
                  >
                     <Option value="PENDING">Pending</Option>
                     <Option value="IN_PROGRESS">In Progress</Option>
                     <Option value="COMPLETED">Completed</Option>
                  </Select>
               )}
            />
            {errors.status && <p style={{ color: "red" }}>{errors.status.message}</p>}
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
            {isPending || UpdatePending ? <Loader /> : taskId ? "Edit Task" : "Add Task"}
         </button>
      </form>
   );
};

export default AddTaskForm;
