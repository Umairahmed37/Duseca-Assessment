'use client'
import { Role } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import toast from 'react-hot-toast'
import { useEffect, useLayoutEffect } from 'react'
import Loader from '@/components/Loader'

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
      } else if (session.status === 'authenticated' && session.data?.user.role !== Role.ADMIN) {
         toast.error("UnAuthorized Access Not Allowed")
         setTimeout(() => {
            redirect('/')
         }, 500)
      }
   }, [session]) // Dependency array includes session to trigger effect when it changes

   if (session.status === 'loading') {
      return <div className='flex justify-center items-center h-screen mx-auto -mt-20'>
         <Loader className="h-16 w-16 border-[#1F2937] mx-auto mt-20 mx-auto" />
      </div>
   }


   return (
      <>
         {
            session.status === 'authenticated' &&
            children
         }
      </>
   )
}
