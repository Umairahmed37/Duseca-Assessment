'use client'
import Loader from '@/components/Loader'
import PrimaryButton from '@/components/PrimaryButton'
import { redirect } from 'next/navigation'
import React from 'react'

const page = () => {

   const DashboardLinks = [
      {
         Name: "Admin Dashboard",
         Link: "/Dashboard/Admin/ManageUsers"
      },
      {
         Name: "Manager Dashboard",
         Link: "/Dashboard/Manager/Tasks"
      },
      {
         Name: "User Dashboard",
         Link: "/Dashboard/User/Tasks"
      },
   ]


   return (
      <div className='flex justify-center items-center h-screen'>
         <div className='flex flex-row space-x-4 -mt-10 items-baseline space-y-4'> {/* Adjust space-y-4 for spacing between buttons */}
            {DashboardLinks.map(link => (
               <div key={link.Name} className='cursor-pointer' onClick={() => redirect(link.Link)}>
                  <PrimaryButton parentClassName='text-center mx-auto w-fit bg-black text-white px-5 py-2 rounded-md'>
                     {link.Name}
                  </PrimaryButton>
               </div>
            ))}
         </div>
      </div>
   )
}

export default page
