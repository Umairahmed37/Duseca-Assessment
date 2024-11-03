import "@/styles/globals.css";
import { twMerge } from "tailwind-merge";
import Providers from "../provider";
import { Toaster } from "react-hot-toast";


export default async function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {


   return (
      <div>
         <div
            className={twMerge(
               "bg-primary text-base font-brand-primary grid place-items-center min-h-screen bg-no-repeat bg-bottom bg-contain",
            )}
         >
            <Providers>
               <main className="flex flex-col items-stretch gap-6 px-10 py-8 rounded drop-shadow-[0px_0px_10px_#00000010] bg-white md:max-w-[413px] h-full md:h-auto justify-center w-full text-[#42526E]">
                  {children}
               </main>
            </Providers>

            <Toaster />
         </div>
      </div>
   );
}
