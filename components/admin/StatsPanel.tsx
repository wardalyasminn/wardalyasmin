'use client'

import { useEffect, useState } from 'react'
import { getDashboardStats, resetVisitsCount } from '@/lib/admin-actions'

type Stats = {
  ordersCount: number
  visitsCount: number
  topProduct: { name: string; totalQuantity: number } | null
}

export default function StatsPanel() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [resetting, setResetting] = useState(false)

  function loadStats() {
    setLoading(true)
    getDashboardStats()
      .then((data) => setStats(data))
      .catch(() => setError('تعذر تحميل الإحصائيات، حاول مرة أخرى'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadStats()
  }, [])

  async function handleReset() {
    const confirmed = confirm(
      'سيتم حذف كل سجلات الزيارات المحفوظة وتصفير العداد بشكل نهائي. هل أنت متأكدة من المتابعة؟'
    )
    if (!confirmed) return

    setResetting(true)
    try {
      await resetVisitsCount()
      loadStats()
    } catch {
      alert('حدث خطأ أثناء تصفير العداد، حاولي مرة أخرى')
    } finally {
      setResetting(false)
    }
  }

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
          marginBottom: '20px',
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

      <div
        style={{
          border: '1px dashed #e0c9d2',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#9c7d8a' }}>
            تصفير عداد الزيارات
          </div>
          <div style={{ fontSize: '12px', color: '#b0a39c', marginTop: '2px' }}>
            يحذف كل سجلات الزيارات المحفوظة بشكل نهائي ويبدأ العد من الصفر
          </div>
        </div>
        <button
          onClick={handleReset}
          disabled={resetting}
          style={{
            fontSize: '13px',
            fontWeight: 700,
            color: '#c0392b',
            backgroundColor: '#fdf0ee',
            border: '1px solid #f3d4cf',
            borderRadius: '14px',
            padding: '10px 18px',
            cursor: resetting ? 'not-allowed' : 'pointer',
            opacity: resetting ? 0.6 : 1,
            whiteSpace: 'nowrap',
          }}
        >
          {resetting ? 'جاري التصفير...' : 'تصفير العداد'}
        </button>
      </div>
    </div>
  )
}
