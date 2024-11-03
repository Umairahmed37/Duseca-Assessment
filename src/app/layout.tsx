'use client'
import Loader from "@/components/Loader";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";


export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {

   return (
      <>
         <SessionProvider>
            <html>
               <body>
                  <Suspense fallback={<div><Loader/></div>}>
                     {children}
                  </Suspense>
               </body>
            </html>
         </SessionProvider>
      </>
   );
}
