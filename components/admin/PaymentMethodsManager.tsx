'use client'

import { useState } from 'react'
import { PaymentMethod } from '@/lib/types'
import {
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from '@/lib/admin-actions'
import ImageUploader from './ImageUploader'

export default function PaymentMethodsManager({
  initialPaymentMethods,
}: {
  initialPaymentMethods: PaymentMethod[]
}) {
  const [methods, setMethods] = useState(initialPaymentMethods)
  const [editing, setEditing] = useState<Partial<PaymentMethod> | null>(null)
  const [saving, setSaving] = useState(false)

  function startNew() {
    setEditing({ name: '', image_url: '', is_active: true, sort_order: methods.length })
  }

  async function handleSave() {
    if (!editing) return
    if (!editing.image_url) {
      alert('من فضلك ارفعي شعار طريقة الدفع')
      return
    }
    setSaving(true)
    try {
      if (editing.id) {
        await updatePaymentMethod(editing.id, editing)
        setMethods((prev) =>
          prev.map((m) => (m.id === editing.id ? ({ ...m, ...editing } as PaymentMethod) : m))
        )
      } else {
        await createPaymentMethod(editing)
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
    if (!confirm('تأكيد حذف طريقة الدفع؟')) return
    try {
      await deletePaymentMethod(id)
      setMethods((prev) => prev.filter((m) => m.id !== id))
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'Tajawal, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontWeight: 700, fontSize: '18px', color: '#b85c80', margin: 0 }}>
          طرق الدفع
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
          + إضافة طريقة دفع
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
          gap: '12px',
        }}
      >
        {methods.map((m) => (
          <div
            key={m.id}
            style={{
              backgroundColor: '#fdf6f2',
              border: '1px solid #f5e6da',
              borderRadius: '14px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={m.image_url}
              alt={m.name}
              style={{
                width: '56px',
                height: '56px',
                objectFit: 'contain',
                borderRadius: '10px',
                backgroundColor: '#fff',
                border: '1px solid #f0d9e3',
              }}
            />
            <p
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#5a4a4a',
                margin: 0,
                textAlign: 'center',
              }}
            >
              {m.name}
            </p>
            <p style={{ fontSize: '11px', color: '#b0a39c', margin: 0 }}>
              {m.is_active ? 'مفعّل' : 'غير مفعّل'}
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setEditing({ ...m })}
                style={{
                  fontSize: '12px',
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
                onClick={() => handleDelete(m.id)}
                style={{
                  fontSize: '12px',
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
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              width: '100%',
              maxWidth: '400px',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              fontFamily: 'Tajawal, sans-serif',
            }}
          >
            <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#b85c80', margin: 0 }}>
              {editing.id ? 'تعديل طريقة دفع' : 'طريقة دفع جديدة'}
            </h3>

            <input
              placeholder="اسم طريقة الدفع (مثال: Visa)"
              value={editing.name || ''}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#d4779a')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#f0d9e3')}
            />

            <ImageUploader
              value={editing.image_url}
              onChange={(url) => setEditing({ ...editing, image_url: url })}
            />

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