'use client'
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import PrimaryButton from "./PrimaryButton";

export default function Sidebar() {
   const session = useSession()
   const userRole = session.data && session?.data.user?.role as keyof typeof links || "USER";


   const links = {
      ADMIN: [
         { href: "/Dashboard/Admin/ManageUsers", label: "Manage Users" },
      ],
      MANAGER: [
         { href: "/Dashboard/Manager/ManageUsers", label: "Manage Users" },
         { href: "/Dashboard/Manager/Tasks", label: "Manage My Tasks" },
      ],
      USER: [
         { href: "/Dashboard/User/Tasks", label: "My Tasks" },
      ],
   };

   return (
      <aside className="w-64 bg-gray-800 p-4 text-white h-screen pt-20">
         {
            <div className="text-center">
               {session.data && session.data?.user.role || "Guest"}
            </div>
         }
         <nav>
            {/* SHOW LINKS IN DASHBOARD */}
            {links[userRole].map((link) => (
               <Link key={link.href} href={link.href} className="block text-center p-2 mt-5 bg-white text-black rounded-md">
                  {link.label}
               </Link>
            ))}

            {/* LOG OUT BUTTON */}
            <PrimaryButton parentClassName="mt-10">
               <div
                  onClick={() =>
                     signOut({
                        redirect: true,
                        callbackUrl: "/login",
                     })}
               > Log Out</div>
            </PrimaryButton>
         </nav>

      </aside>
   );
}
