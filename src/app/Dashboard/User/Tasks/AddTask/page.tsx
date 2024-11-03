'use client'
import AddTaskForm from '@/forms/AddTaskForm';
import { Role } from '@prisma/client';
import { useSearchParams } from 'next/navigation';
import React from 'react'

const page = () => {
   const searchParams = useSearchParams();
   const id = searchParams.get('id') || undefined; 
   // const id = "b4acaa2e-4f40-4e23-a6f2-04cb95a5e0cf" ; 

   return (
      <>
         <div className='mt-32 mx-auto px-10 py-10'>
            <AddTaskForm taskId={id} role={Role.USER}/>
         </div>
      </>
   )
}

export default page