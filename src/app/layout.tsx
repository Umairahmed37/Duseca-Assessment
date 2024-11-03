'use client'
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";


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
                  {children}
               </body>
            </html>
         </SessionProvider>
      </>
   );
}
