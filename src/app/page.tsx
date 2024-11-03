'use client'
import Loader from '@/components/Loader'
import PrimaryButton from '@/components/PrimaryButton'
import { Role } from '@prisma/client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {
   const session = useSession()
   const [hrefLink, sethrefLink] = useState('')

   // EFFECT TO REDIRECT ACCORDING TO HIS ROLE
   useEffect(() => {
      let role = session.data?.user.role
      console.log(role)

      if (role === Role.ADMIN) {
         sethrefLink('/Dashboard/Admin/ManageUsers')
      } else if (role === Role.MANAGER) {
         sethrefLink('/Dashboard/Manager/Tasks')
      } else {
         sethrefLink('/Dashboard/User/Tasks')
      }
   }, [session.data, session.status])



   return (
      <>
         <Link href={hrefLink}>
            <PrimaryButton parentClassName='text-center mx-auto mt-[20%] w-fit bg-black text-white px-5 py-2 rounded-md'>
               {
                  session.status == 'loading' ?
                     <Loader /> :
                     "Go To Dashboard"
               }
            </PrimaryButton>
         </Link>
      </>
   )
}

export default page