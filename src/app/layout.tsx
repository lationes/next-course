import type { Metadata } from 'next'
import { Providers } from '@/providers/providers';
import { fonts } from '@/fonts/fonts';
import './globals.css'
import HomeComponent from "@/components/HomeComponent";

export const metadata: Metadata = {
  title: 'PostsApp',
  description: 'App that adds new posts on page',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={fonts.rubik.variable}>
      <body>

        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
