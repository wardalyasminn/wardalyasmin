'use client'

import { useState } from 'react'
import { Discount, Product, Category } from '@/lib/types'
import {
  createDiscount,
  updateDiscount,
  deleteDiscount,
} from '@/lib/admin-actions'

export default function DiscountsManager({
  initialDiscounts,
  products,
  categories,
}: {
  initialDiscounts: Discount[]
  products: Product[]
  categories: Category[]
}) {
  const [discounts, setDiscounts] = useState(initialDiscounts)
  const [editing, setEditing] = useState<Partial<Discount> | null>(null)
  const [saving, setSaving] = useState(false)

  function startNew() {
    setEditing({
      type: 'percentage',
      code: '',
      percentage_value: 0,
      fixed_value: 0,
      product_ids: [],
      category_ids: [],
      min_purchase: 0,
      max_uses: 0,
      used_count: 0,
      valid_from: new Date().toISOString().split('T')[0],
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      is_active: true,
    })
  }

  async function handleSave() {
    if (!editing) return
    if (!editing.code) {
      alert('من فضلك ضعي كود الخصم')
      return
    }
    setSaving(true)
    try {
      if (editing.id) {
        await updateDiscount(editing.id, editing)
        setDiscounts((prev) =>
          prev.map((d) => (d.id === editing.id ? ({ ...d, ...editing } as Discount) : d))
        )
      } else {
        await createDiscount(editing)
        window.location.reload()
        return
      }
      setEditing(null)
    } catch (err) {
      alert('حدث خطأ أثناء الحفظ')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('تأكيد حذف الخصم؟')) return
    try {
      await deleteDiscount(id)
      setDiscounts((prev) => prev.filter((d) => d.id !== id))
    } catch (err) {
      alert('حدث خطأ أثناء الحذف')
      console.error(err)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: '1px solid #f0d9e3',
    borderRadius: '12px',
    padding: '10px 14px',
    fontFamily: 'Tajawal, sans-serif',
    fontSize: '14px',
    color: '#5a4a4a',
    backgroundColor: '#fffaf8',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    marginBottom: '6px',
    color: '#9c7d8a',
    fontWeight: 600,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'Tajawal, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontWeight: 700, fontSize: '18px', color: '#b85c80', margin: 0 }}>
          الخصومات والعروض
        </h2>
        <button
          onClick={startNew}
          style={{
            backgroundColor: '#d4779a',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 700,
            border: 'none',
            borderRadius: '20px',
            padding: '10px 16px',
            cursor: 'pointer',
            fontFamily: 'Tajawal, sans-serif',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#b85c80')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#d4779a')}
        >
          + إضافة خصم
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {discounts.map((d) => (
          <div
            key={d.id}
            style={{
              backgroundColor: '#fdf6f2',
              border: '1px solid #f5e6da',
              borderRadius: '14px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, color: '#5a4a4a', margin: 0, fontSize: '14px' }}>
                {d.code} - {d.type === 'percentage' ? d.percentage_value + '%' : d.type === 'fixed' ? d.fixed_value + ' ر.س' : 'توصيل مجاني'}
              </p>
              <p style={{ fontSize: '12px', color: '#b0a39c', margin: '2px 0 0' }}>
                {d.is_active ? '✓ مفعّل' : '✗ معطّل'} • استخدم: {d.used_count}/{d.max_uses || '∞'}
              </p>
            </div>
            <button
              onClick={() => setEditing({ ...d })}
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#b85c80',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Tajawal, sans-serif',
              }}
            >
              تعديل
            </button>
            <button
              onClick={() => handleDelete(d.id)}
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#c45c5c',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Tajawal, sans-serif',
              }}
            >
              حذف
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
            padding: '16px',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              width: '100%',
              maxWidth: '450px',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              fontFamily: 'Tajawal, sans-serif',
              margin: 'auto',
            }}
          >
            <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#b85c80', margin: 0 }}>
              {editing.id ? 'تعديل خصم' : 'خصم جديد'}
            </h3>

            <div>
              <label style={labelStyle}>كود الخصم</label>
              <input
                placeholder="مثال: SUMMER20"
                value={editing.code || ''}
                onChange={(e) => setEditing({ ...editing, code: e.target.value })}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#d4779a')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#f0d9e3')}
              />
            </div>

            <div>
              <label style={labelStyle}>نوع الخصم</label>
              <select
                value={editing.type || 'percentage'}
                onChange={(e) => setEditing({ ...editing, type: e.target.value as any })}
                style={inputStyle}
              >
                <option value="percentage">نسبة مئوية (%)</option>
                <option value="fixed">مبلغ ثابت (ر.س)</option>
                <option value="free_shipping">توصيل مجاني</option>
              </select>
            </div>

            {editing.type === 'percentage' && (
              <div>
                <label style={labelStyle}>النسبة المئوية</label>
                <input
                  type="number"
                  placeholder="10"
                  value={editing.percentage_value || 0}
                  onChange={(e) => setEditing({ ...editing, percentage_value: Number(e.target.value) })}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#d4779a')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#f0d9e3')}
                />
              </div>
            )}

            {editing.type === 'fixed' && (
              <div>
                <label style={labelStyle}>المبلغ (ريال)</label>
                <input
                  type="number"
                  placeholder="50"
                  value={editing.fixed_value || 0}
                  onChange={(e) => setEditing({ ...editing, fixed_value: Number(e.target.value) })}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#d4779a')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#f0d9e3')}
                />
              </div>
            )}

            <div>
              <label style={labelStyle}>الحد الأدنى للشراء (ر.س) - اختياري</label>
              <input
                type="number"
                placeholder="100"
                value={editing.min_purchase || 0}
                onChange={(e) => setEditing({ ...editing, min_purchase: Number(e.target.value) })}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#d4779a')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#f0d9e3')}
              />
            </div>

            <div>
              <label style={labelStyle}>عدد الاستخدامات المسموحة - 0 = غير محدود</label>
              <input
                type="number"
                placeholder="10"
                value={editing.max_uses || 0}
                onChange={(e) => setEditing({ ...editing, max_uses: Number(e.target.value) })}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#d4779a')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#f0d9e3')}
              />
            </div>

            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>من التاريخ</label>
                <input
                  type="date"
                  value={editing.valid_from?.split('T')[0] || ''}
                  onChange={(e) => setEditing({ ...editing, valid_from: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#d4779a')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#f0d9e3')}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>إلى التاريخ</label>
                <input
                  type="date"
                  value={editing.valid_until?.split('T')[0] || ''}
                  onChange={(e) => setEditing({ ...editing, valid_until: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#d4779a')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#f0d9e3')}
                />
              </div>
            </div>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#5a4a4a',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={editing.is_active ?? true}
                onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: '#d4779a' }}
              />
              مفعّل
            </label>

            <div style={{ display: 'flex', gap: '10px', paddingTop: '6px' }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  flex: 1,
                  backgroundColor: '#d4779a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '12px',
                  fontWeight: 700,
                  fontSize: '14px',
                  fontFamily: 'Tajawal, sans-serif',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? 'جاري الحفظ...' : 'حفظ'}
              </button>
              <button
                onClick={() => setEditing(null)}
                style={{
                  flex: 1,
                  backgroundColor: '#f5e6da',
                  color: '#8a7468',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '12px',
                  fontWeight: 700,
                  fontSize: '14px',
                  fontFamily: 'Tajawal, sans-serif',
                  cursor: 'pointer',
                }}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
