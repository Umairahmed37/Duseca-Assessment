"use client";

import z from "@/app/zod";
import Loader from "@/components/Loader";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { z as zod } from "zod";

const schema = z.object({
   email: z.string().email(),
   password: z.string().min(1, "Password must contain at least 1 character"),
});

type IFormData = zod.infer<typeof schema>;

const LoginPage = () => {
   const { push } = useRouter();

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<zod.infer<typeof schema>>({
      resolver: zodResolver(schema),
      defaultValues: {
         email: "",
         password: "",
      },
   });

   /**
    * Mutation hook to send request to the backend
    */
   const { mutate, isPending, error } = useMutation({
      mutationFn: async (data: IFormData) => {
         const result = await signIn("credentials", {
            redirect: false,
            ...data,
         });

         if (result?.error) {
            throw {
               message: result.error,
            };
         }
         push('/')
      },
   });

   /**
    * Error state to show if something's wrong or the request failed
    */
   const errorMessage = errors.email?.message ?? errors.password?.message ?? error?.message;

   const onSubmit = useCallback<SubmitHandler<IFormData>>(
      (data) => {
         mutate(data);
      },
      [mutate],
   );

   return (
      <>
         <span className="self-center">Log in to continue</span>

         <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <div className="rounded bg-white border-black border-2 h-[2.625rem]">
               <input
                  type="email"
                  key="email"
                  placeholder="Enter your email"
                  className="px-2 bg-transparent outline-none text-primary h-full w-full placeholder:text-[#A5ADBA]"
                  {...register("email")}
               />
            </div>

            <div className="rounded bg-white border-black border-2 h-[2.625rem]">
               <input
                  type="password"
                  key="password"
                  placeholder="Enter your password"
                  className="px-2 bg-transparent outline-none text-primary h-full w-full placeholder:text-[#A5ADBA]"
                  {...register("password")}
               />
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
                  "h-[2.625rem] grid place-items-center rounded bg-black text-white transition-colors",
                  isPending ? "bg-gray" : "bg-gradient-to-br from-purple to-pink",
               )}>
               {isPending ? <Loader /> : "Login"}
            </button>
         </form>

         <div className="flex flex-row gap-2 items-center self-baseline w-full">
           
            <div className="flex flex-col self-baseline text-sm gap-2 w-full">
               <span className="text-center w-full">Already Added Sample Accounts:</span>
               <b>Admin:</b> Admin@gmail.com pass: Admin1234
               <b>Manager:</b> Manager@gmail.com pass: Admin1234
               <b>User:</b> User@gmail.com pass: Admin1234

            </div>
         </div>
      </>
   );
};

export default LoginPage;
