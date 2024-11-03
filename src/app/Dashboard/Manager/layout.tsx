'use client'
import Loader from '@/components/Loader'
import { Role } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect, useLayoutEffect } from 'react'
import toast from 'react-hot-toast'

export default function RootLayout({
   children,
}: {
   children: React.ReactNode
}) {

   const session = useSession()

   useLayoutEffect(() => {
      // Handle unauthorized access
      if (session.status === 'unauthenticated') {
         redirect('/login')
      } else if (session.status === 'authenticated' && session.data?.user.role !== Role.MANAGER) {
         toast.error("UnAuthorized Access Not Allowed")
         setTimeout(() => {
            redirect('/')
         }, 500)
      }
   }, [session]) // Dependency array includes session to trigger effect when it changes

   if (session.status === 'loading' || session.data === null) {
      return <div className='flex justify-center items-center h-screen mx-auto -mt-20'>
         <Loader className="h-16 w-16 border-[#1F2937] mx-auto mt-20 mx-auto" />
      </div>
   }
   // //REDIRECT USER IF ITS NOT LOGGED IN 
   // const session = useSession()
   // if (session.status !== "loading" && session.status === 'unauthenticated' && session.data === null) {
   //    redirect('/login')
   // }
   // //REDIRECT USER IF ITS NOT MANAGER
   // if (session.status !== "loading" && session.status === 'authenticated' && session.data?.user.role !== Role.MANAGER) {
   //    toast.error("UnAuthorized Access Not Allowed")
   //    setTimeout(() => {
   //       redirect('/')
   //    }, 500);
   //    return
   // }

   return (
      <>
         {
            session.status === 'authenticated' &&
            children
         }
      </>

   )
}
