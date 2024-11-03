import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET(req: Request) {
   try {
      const prisma = new PrismaClient();
      // const data = await req.json();

      const response = await prisma.task.findMany();

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
      const { taskId, userId } = data
      let response
      if (taskId) {
         response = await prisma.task.findFirst({
            where: {
               id: taskId,
            },
         })
      } else if (userId) {
         response = await prisma.task.findMany({
            where: {
               userId: userId
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
