"use client";

import API from "@/app/api";
import z from "@/app/zod";
import Loader from "@/components/Loader";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";
import { z as zod } from "zod";

const schema = z
  .object({
    email: z.string().email(),
    password: z.string().min(1, "Password must contain at least 1 character"),
    confirmPassword: z.string(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

type IFormData = zod.infer<typeof schema>;

const SignupPage = () => {
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
      confirmPassword: "",
    },
  });

   
  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: IFormData) => {
      return API.post("/api/auth/signup", data);
    },
    onSuccess: () => {
      toast.success("Account created. Please login to continue!");
      push("/login");
    },
  });

   
  const errorMessage =
    errors.email?.message ?? errors.password?.message ?? errors.confirmPassword?.message ?? error?.message;

  const onSubmit = useCallback<SubmitHandler<IFormData>>(
    (data) => {
      mutate(data);
    },
    [mutate],
  );

  return (
    <>
      <span className="self-center">Sign up to continue</span>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="rounded border-black border-2 h-[2.625rem]">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-2 bg-transparent outline-none text-primary h-full w-full placeholder:text-[#A5ADBA]"
            {...register("email")}
          />
        </div>
        <div className="rounded border-black border-2 h-[2.625rem]">
          <input
            type="password"
            placeholder="Enter your password"
            className="px-2 bg-transparent outline-none text-primary h-full w-full placeholder:text-[#A5ADBA]"
            {...register("password")}
          />
        </div>

        <div className="rounded border-black border-2 h-[2.625rem]">
          <input
            type="password"
            placeholder="Confirm your password"
            className="px-2 bg-transparent outline-none text-primary h-full w-full placeholder:text-[#A5ADBA]"
            {...register("confirmPassword")}
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
            "h-[2.625rem] grid place-items-center rounded text-white bg-black transition-colors",
            isPending ? "bg-gray" : "bg-gradient-to-br from-purple to-pink",
          )}>
          {isPending ? <Loader /> : "Sign Up"}
        </button>
      </form>

      
    </>
  );
};

export default SignupPage;
