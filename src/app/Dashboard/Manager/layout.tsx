'use client'
import { Role } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import toast from 'react-hot-toast'

export default function RootLayout({
   children,
}: {
   children: React.ReactNode
}) {

   //REDIRECT USER IF ITS NOT LOGGED IN 
   const session = useSession()
   if (session.status !== "loading" && session.status === 'unauthenticated' && session.data === null) {
      redirect('/login')
   }
   //REDIRECT USER IF ITS NOT MANAGER
   if (session.status !== "loading" && session.status === 'authenticated' && session.data?.user.role !== Role.MANAGER) {
      toast.error("UnAuthorized Access Not Allowed")
      setTimeout(() => {
         redirect('/')
      }, 500);
      return
   }

   return (
      <>
         {children}
      </>

   )
}
