// types/UserFormData.ts
export type UserFormData = {
   name: string;
   email: string;
   password: string;
   role: "ADMIN" | "MANAGER" | "USER";
};
