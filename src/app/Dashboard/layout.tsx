// "use client"
import { useSession } from 'next-auth/react'
import '../../styles/globals.css'
import Providers from '../provider'
import Sidebar from '@/components/Sidebar'
import { Toaster } from 'react-hot-toast'
import NextTopLoader from "nextjs-toploader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div>
      <Providers>
        <NextTopLoader />
        <div className="flex h-screen">
          <Sidebar />
          {children}
        </div>
      </Providers>
      <Toaster />
    </div>
  )
}
