import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request) {
   try {
      const prisma = new PrismaClient();
      const data = await req.json();
      const { userId, title, description, dueDate, status } = data;

      // Ensure required fields are provided
      if (!userId || !title || !status) {
         return NextResponse.json(
            {
               message: "User ID, task title, and task status are required.",
            },
            {
               status: 400,
            }
         );
      }

      // Create a new task for the user
      const response = await prisma.task.create({
         data: {
            userId: userId,  // Assuming your Task model has a userId field to relate to the User
            title: title,
            description: description,
            dueDate: new Date(dueDate), // Ensure dueDate is a Date object
            status: status,
         },
      });

      return NextResponse.json({
         data: response,
         success: true,
         status: 201,
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
