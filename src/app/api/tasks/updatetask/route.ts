import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request) {
   try {
      const prisma = new PrismaClient();
      const data = await req.json();
      const { taskId, title, description, dueDate, status } = data

      const response = await prisma.task.update({
         where: {
            id: taskId
         },

         data: {
            title: title, 
            description: description,
            dueDate: new Date(dueDate),
            status: status,
         },
      })

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
