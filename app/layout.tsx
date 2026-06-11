import type { Metadata, Viewport } from 'next'
import { Quicksand, Baloo_2 } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "sonner";
import './globals.css'

const quicksand = Quicksand({ 
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const baloo = Baloo_2({ 
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

export const metadata: Metadata = {
  title: 'Little Moment | Momentinho Mágico - Livros Personalizados para Crianças',
  description: 'Transforme a foto do seu filho em um livro de histórias mágico! Crie seu Momentinho Mágico personalizado com temas brasileiros únicos.',
  keywords: ['livro personalizado', 'livro infantil', 'presente para criança', 'história personalizada', 'Brasil', 'momentinho mágico'],
  authors: [{ name: 'Little Moment' }],
  creator: 'Little Moment',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Little Moment',
    title: 'Little Moment | Momentinho Mágico',
    description: 'Transforme a foto do seu filho em um livro de histórias mágico!',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Little Moment | Momentinho Mágico',
    description: 'Transforme a foto do seu filho em um livro de histórias mágico!',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf8f5' },
    { media: '(prefers-color-scheme: dark)', color: '#2d2a3d' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const messages = await getMessages();

  return (
    <html lang="pt-BR" className={`${quicksand.variable} ${baloo.variable} bg-background`}>
      <body className="font-sans antialiased">
        <NextIntlClientProvider locale="pt-BR" messages={messages}>
          {children}
          <Toaster richColors position="top-right" />
        </NextIntlClientProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
