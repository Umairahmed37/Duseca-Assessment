// types/next-auth.d.ts
import NextAuth, { DefaultSession, JWT } from "next-auth";

declare module "next-auth" {
   interface User {
      role: string;
   }

   interface Session extends DefaultSession {
      user: User & {
         id: string; // Include ID in the user object
      };
   }

   interface JWT {
      id: string; // Include ID in the token
      role: string; // Include role in the token
   }
}
