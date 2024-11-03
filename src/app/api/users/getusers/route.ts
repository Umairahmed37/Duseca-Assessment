import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET(req: Request) {
   try {
      const prisma = new PrismaClient();
      // const data = await req.json();

      const response = await prisma.user.findMany({
         where: {
            NOT: {
               role: "ADMIN"
            }
         }
      });

      return NextResponse.json({
         data: response,
         success: true,
         status: 200,
      });
   } catch (e) {
      if (e instanceof ZodError) {
         return NextResponse.json(
            {
               message: e.errors[0].message,
            },
            {
               status: 400,
            },
         );
      }

      return NextResponse.json(
         {
            message: (e as Error).message,
         },
         {
            status: 500,
         },
      );
   }
}
export async function POST(req: Request) {
   try {
      const prisma = new PrismaClient();
      const data = await req.json();
      const { userId, ManagerId } = data
      console.log(data)
      let response
      if (userId) {
         response = await prisma.user.findFirst({
            where: {
               id: userId,
               NOT: {
                  role: 'ADMIN',
               },
            },

         })

      } else if (ManagerId) {
         response = await prisma.user.findMany({
            where: {
               managerId: ManagerId,
            },

         })

      }

      return NextResponse.json({
         data: response,
         success: true,
         status: 200,
      });
   } catch (e) {
      if (e instanceof ZodError) {
         return NextResponse.json(
            {
               message: e.errors[0].message,
            },
            {
               status: 400,
            },
         );
      }

      return NextResponse.json(
         {
            message: (e as Error).message,
         },
         {
            status: 500,
         },
      );
   }
}
