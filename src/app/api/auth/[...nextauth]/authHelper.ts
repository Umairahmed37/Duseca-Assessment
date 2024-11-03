import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";
import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";


const schema = z.object({
   email: z.string().email(),
   password: z.string(),
});

const prisma = new PrismaClient();


export const authOptions: AuthOptions = {

   providers: [
      Credentials({
         credentials: {
            email: {},
            password: {},
         },
         authorize: async (credentials) => {
            const { email, password } = schema.parse(credentials);

            const user = await prisma.user.findUnique({
               where: {
                  email,
               },
            });

            if (!user) {
               throw new Error("Invalid credentials");
            }

            const isPasswordValid = await compare(password, user.password);

            if (!isPasswordValid) {
               throw new Error("Invalid credentials");
            }

            const { password: _, ...rest } = user;
            return rest;
         },
      }),
   ],
   session: {
      strategy: "jwt",
   },
   pages: {
      newUser: "/signup",
      signIn: "/signin",
      signOut: "/",
   },
   callbacks: {
      async jwt({ token, user }) {
         if (user) {
            token.role = user.role;
            token.id = user.id
         }
         return token;

      },

      async session({ session, token }) {
         if (token) {
            session.user.id = token.id as string;
            session.user.role = token.role as string;
         }
         return session;
      },
   },
}