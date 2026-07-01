'use client'

import { useState } from 'react'
import { Category } from '@/lib/types'
import { createCategory, updateCategory, deleteCategory } from '@/lib/admin-actions'
import ImageUploader from './ImageUploader'

export default function CategoriesManager({
  initialCategories,
}: {
  initialCategories: Category[]
}) {
  const [categories, setCategories] = useState(initialCategories)
  const [editing, setEditing] = useState<Partial<Category> | null>(null)
  const [saving, setSaving] = useState(false)

  function startNew() {
    setEditing({ name: '', name_en: '', icon: '🎁', icon_type: 'emoji', is_active: true, sort_order: categories.length })
  }

  async function handleSave() {
    if (!editing) return
    setSaving(true)
    try {
      if (editing.id) {
        await updateCategory(editing.id, editing)
        setCategories((prev) =>
          prev.map((c) => (c.id === editing.id ? ({ ...c, ...editing } as Category) : c))
        )
      } else {
        await createCategory(editing)
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
    if (!confirm('تأكيد حذف التصنيف؟')) return
    try {
      await deleteCategory(id)
      setCategories((prev) => prev.filter((c) => c.id !== id))
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
          التصنيفات
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
          + إضافة تصنيف
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {categories.map((c) => (
          <div
            key={c.id}
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
            <div style={{ fontSize: '24px', minWidth: '30px' }}>
              {c.icon_type === 'image' && c.icon ? (
                <img src={c.icon} alt={c.name} style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }} />
              ) : (
                c.icon || '🎁'
              )}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, color: '#5a4a4a', margin: 0, fontSize: '14px' }}>
                {c.name}
              </p>
              <p style={{ fontSize: '12px', color: '#b0a39c', margin: '2px 0 0' }}>
                {c.is_active ? 'مفعّل' : 'غير مفعّل'}
              </p>
            </div>
            <button
              onClick={() => setEditing({ ...c })}
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
              onClick={() => handleDelete(c.id)}
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
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              width: '100%',
              maxWidth: '420px',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              fontFamily: 'Tajawal, sans-serif',
            }}
          >
            <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#b85c80', margin: 0 }}>
              {editing.id ? 'تعديل تصنيف' : 'تصنيف جديد'}
            </h3>

            <input
              placeholder="اسم التصنيف"
              value={editing.name || ''}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#d4779a')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#f0d9e3')}
            />

            <input
              placeholder="الاسم بالإنجليزي (اختياري)"
              value={editing.name_en || ''}
              onChange={(e) => setEditing({ ...editing, name_en: e.target.value })}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#d4779a')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#f0d9e3')}
            />

            <div>
              <label style={labelStyle}>نوع الأيقونة</label>
              <select
                value={editing.icon_type || 'emoji'}
                onChange={(e) => setEditing({ ...editing, icon_type: e.target.value as any })}
                style={inputStyle}
              >
                <option value="emoji">إيموجي</option>
                <option value="image">صورة</option>
              </select>
            </div>

            {editing.icon_type === 'emoji' ? (
              <input
                placeholder="مثال: 🌷 أو 🎁"
                value={editing.icon || ''}
                onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
                style={inputStyle}
                maxLength={2}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#d4779a')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#f0d9e3')}
              />
            ) : (
              <ImageUploader
                value={editing.icon}
                onChange={(url) => setEditing({ ...editing, icon: url })}
              />
            )}

            <input
              type="number"
              placeholder="ترتيب العرض"
              value={editing.sort_order ?? 0}
              onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#d4779a')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#f0d9e3')}
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
