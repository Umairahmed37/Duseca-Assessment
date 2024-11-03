import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request) {
   try {
      const prisma = new PrismaClient();
      const data = await req.json();
      const { managerId, userIds } = data;

      // Ensure managerId and userIds are provided
      if (!managerId || !userIds || !Array.isArray(userIds) || userIds.length === 0) {
         return NextResponse.json(
            {
               message: "managerId and userIds array are required",
            },
            {
               status: 400,
            }
         );
      }

      // Check if manager exists
      const manager = await prisma.user.findUnique({
         where: { id: managerId },
      });

      if (!manager) {
         return NextResponse.json(
            {
               message: "Manager not found",
            },
            {
               status: 404,
            }
         );
      }

      // Update each user to set the managerId
      const updatedUsers = await prisma.user.updateMany({
         where: {
            id: { in: userIds },
         },
         data: {
            managerId: managerId,
         },
      });

      // Retrieve updated manager with assigned managedUsers
      const updatedManager = await prisma.user.update({
         where: {
            id: managerId,
         },
         data: {
            managedUsers: {
               connect: userIds.map((userId) => ({ id: userId })),
            },
         },
         include: {
            managedUsers: true, // To return updated managedUsers list
         },
      });
      console.log(updatedManager)

      return NextResponse.json({
         data: updatedManager,
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
            }
         );
      }

      return NextResponse.json(
         {
            message: (e as Error).message,
         },
         {
            status: 500,
         }
      );
   }
}
