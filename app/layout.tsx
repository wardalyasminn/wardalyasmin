import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import WorkingHoursBar from '@/components/WorkingHoursBar'
import Footer from '@/components/Footer'
import { getPublicSettings, getPublicPaymentMethods } from '@/lib/public-actions'

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'ورد الياسمين للهدايا',
  description: 'متجر ورد الياسمين للهدايا - بريدة، القصيم',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [settings, paymentMethods] = await Promise.all([
    getPublicSettings(),
    getPublicPaymentMethods(),
  ])

  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LanguageProvider>
          <CartProvider>
            <WorkingHoursBar text={settings.working_hours} />
            <Header />
            {children}
            <Footer settings={settings} paymentMethods={paymentMethods} />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
