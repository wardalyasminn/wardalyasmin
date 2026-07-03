'use client'

import { useEffect, useState } from 'react'
import { getDashboardStats } from '@/lib/admin-actions'

type Stats = {
  ordersCount: number
  visitsCount: number
  topProduct: { name: string; totalQuantity: number } | null
}

export default function StatsPanel() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboardStats()
      .then((data) => setStats(data))
      .catch(() => setError('تعذر تحميل الإحصائيات، حاول مرة أخرى'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p style={{ textAlign: 'center', color: '#b0a39c', padding: '40px 0' }}>جاري التحميل...</p>
  }

  if (error) {
    return <p style={{ textAlign: 'center', color: '#c0392b', padding: '40px 0' }}>{error}</p>
  }

  const cards = [
    { label: 'إجمالي الطلبات', value: stats?.ordersCount ?? 0, icon: '🧾' },
    { label: 'عدد الزيارات', value: stats?.visitsCount ?? 0, icon: '👁️' },
  ]

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        {cards.map((c) => (
          <div
            key={c.label}
            style={{
              backgroundColor: '#fdf6f2',
              border: '1px solid #f5e6da',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{c.icon}</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#b85c80' }}>{c.value}</div>
            <div style={{ fontSize: '13px', color: '#b0a39c', marginTop: '4px' }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div
        style={{
          backgroundColor: '#fdf6f2',
          border: '1px solid #f5e6da',
          borderRadius: '16px',
          padding: '20px',
        }}
      >
        <div style={{ fontSize: '13px', color: '#b0a39c', marginBottom: '6px' }}>
          المنتج الأكثر طلبًا
        </div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#b85c80' }}>
          {stats?.topProduct
            ? `🌸 ${stats.topProduct.name} (${stats.topProduct.totalQuantity} قطعة)`
            : 'لا توجد بيانات كافية بعد'}
        </div>
      </div>
    </div>
  )
}
