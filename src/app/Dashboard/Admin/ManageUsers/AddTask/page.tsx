'use client'
import AddTaskForm from '@/forms/AddTaskForm';
import { useSearchParams } from 'next/navigation';
import React from 'react'

const page = () => {
   const searchParams = useSearchParams();
   const id = searchParams.get('id') || undefined;

   return (
      <>
         {
            id ? (
               <div className='mt-32 mx-auto px-10 py-10'>
                  <AddTaskForm taskId={id} />
               </div>

            ) : (<div>Please Specify Id in Params</div>)
         }
      </>
   )
}

export default page