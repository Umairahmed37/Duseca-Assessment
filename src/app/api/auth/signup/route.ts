import { NextResponse } from "next/server";
import { ZodError, z } from "zod";
import { hash, genSalt } from "bcrypt";
import { PrismaClient, Role } from "@prisma/client";


export async function POST(req: Request) {
  try {
    const prisma = new PrismaClient();

    const body = await req.json();
    const { email, password: rawPassword, role, name } = body

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      return Response.json(
        {
          message: "User already exists",
        },
        {
          status: 400,
        },
      );
    }

    const salt = await genSalt();
    const password = await hash(rawPassword, salt);

    await prisma.user.create({
      data: {
        email,
        password,
        name: name || "Admin",
        role: role || "ADMIN"
      },
    });

    return NextResponse.json({
      success: true,
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

    return Response.json(
      {
        message: (e as Error).message,
      },
      {
        status: 500,
      },
    );
  }
}
