'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Product, Category, PaymentMethod } from '@/lib/types'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import ProductsManager from './ProductsManager'
import CategoriesManager from './CategoriesManager'
import SettingsManager from './SettingsManager'
import PaymentMethodsManager from './PaymentMethodsManager'
import ContentManager from './ContentManager'
import StatsPanel from './StatsPanel'

type Tab = 'products' | 'categories' | 'payment_methods' | 'settings' | 'content' | 'stats'

export default function AdminDashboard({
  initialProducts,
  initialCategories,
  initialSettings,
  initialPaymentMethods,
}: {
  initialProducts: Product[]
  initialCategories: Category[]
  initialSettings: Record<string, string>
  initialPaymentMethods: PaymentMethod[]
}) {
  const [tab, setTab] = useState<Tab>('products')
  const router = useRouter()

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'products', label: 'المنتجات' },
    { id: 'categories', label: 'التصنيفات' },
    { id: 'payment_methods', label: 'طرق الدفع' },
    { id: 'content', label: 'الواجهة الرئيسية' },
    { id: 'settings', label: 'الإعدادات' },
    { id: 'stats', label: '📊 الإحصائيات' },
  ]

  return (
    <div
      dir="rtl"
      style={{
        minHeight: '100vh',
        backgroundColor: '#fdf6f2',
        fontFamily: 'Tajawal, sans-serif',
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #f5e6da',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}
      >
        <h1
          style={{
            fontWeight: 700,
            fontSize: '18px',
            color: '#b85c80',
            margin: 0,
          }}
        >
          لوحة التحكم
        </h1>
        <button
          onClick={handleLogout}
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#fff',
            backgroundColor: '#d4779a',
            border: 'none',
            borderRadius: '20px',
            padding: '8px 18px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#b85c80')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#d4779a')}
        >
          تسجيل الخروج
        </button>
      </header>

      {/* Tabs */}
      <nav
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #f5e6da',
          padding: '0 20px',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '14px 16px',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'Tajawal, sans-serif',
              background: 'none',
              border: 'none',
              borderBottom: tab === t.id ? '3px solid #d4779a' : '3px solid transparent',
              color: tab === t.id ? '#b85c80' : '#b0a39c',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main
        style={{
          padding: '24px 16px',
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 2px 10px rgba(212, 119, 154, 0.08)',
            border: '1px solid #f5e6da',
          }}
        >
          {tab === 'products' && (
            <ProductsManager initialProducts={initialProducts} categories={initialCategories} />
          )}
          {tab === 'categories' && <CategoriesManager initialCategories={initialCategories} />}
          {tab === 'payment_methods' && (
            <PaymentMethodsManager initialPaymentMethods={initialPaymentMethods} />
          )}
          {tab === 'content' && (
            <ContentManager initialSettings={initialSettings} categories={initialCategories} />
          )}
          {tab === 'settings' && <SettingsManager initialSettings={initialSettings} />}
          {tab === 'stats' && <StatsPanel />}
        </div>
      </main>
    </div>
  )
}
