'use client'
// /app/Dashboard/Admin/ManageUsers/AddUser/page.tsx
import React from 'react';
import { useSearchParams } from 'next/navigation';
import AddUserForm from '@/forms/AddUserForm';

const AddUserPage = () => {
   const searchParams = useSearchParams();
   const id = searchParams.get('id') || undefined; // Get the id from the query parameters

   return (
      <div className='mt-32 mx-auto px-10 py-10'>
         <AddUserForm userId={id} />
      </div>
   );
};

export default AddUserPage;
