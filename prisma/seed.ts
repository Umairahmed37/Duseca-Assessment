// prisma/seed.ts

const { PrismaClient, Role, TaskStatus } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Create initial users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: 'hashed_password', // Replace with hashed password
      role: Role.ADMIN,
    },
  })

  const manager = await prisma.user.create({
    data: {
      email: 'manager@example.com',
      name: 'Manager User',
      password: 'hashed_password', // Replace with hashed password
      role: Role.MANAGER,
    },
  })

  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: 'Regular User',
      password: 'hashed_password', // Replace with hashed password
      role: Role.USER,
    },
  })

  // Create initial tasks
  await prisma.task.create({
    data: {
      title: 'Task 1',
      description: 'This is the first task.',
      dueDate: new Date(),
      status: TaskStatus.PENDING,
      userId: admin.id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Task 2',
      description: 'This is the second task.',
      dueDate: new Date(),
      status: TaskStatus.IN_PROGRESS,
      userId: manager.id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Task 3',
      description: 'This is the third task.',
      dueDate: new Date(),
      status: TaskStatus.COMPLETED,
      userId: user.id,
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
