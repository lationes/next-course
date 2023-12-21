import type { Metadata } from 'next'
import HeaderComponent from "@/components/HeaderComponent";

export const metadata: Metadata = {
    title: 'Posts',
    description: 'Page with list of posts',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <>
            <header>
                <HeaderComponent />
            </header>
            <main>
                {children}
            </main>
        </>
    )
}
