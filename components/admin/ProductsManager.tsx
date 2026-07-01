'use client'

import { useState } from 'react'
import { Product, Category } from '@/lib/types'
import { createProduct, updateProduct, deleteProduct } from '@/lib/admin-actions'
import ImageUploader from './ImageUploader'

const emptyProduct = {
  name: '',
  name_en: '',
  description: '',
  price: 0,
  image_url: '',
  images_json: '[]',
  category_id: '',
  is_available: true,
  is_featured: false,
  sort_order: 0,
}

function safeParseImages(json: string | undefined): string[] {
  if (!json) return []
  try {
    const parsed = JSON.parse(json)
    if (Array.isArray(parsed)) return parsed.filter((u) => typeof u === 'string')
    return []
  } catch {
    return []
  }
}

export default function ProductsManager({
  initialProducts,
  categories,
}: {
  initialProducts: Product[]
  categories: Category[]
}) {
  const [products, setProducts] = useState(initialProducts)
  const [editing, setEditing] = useState<Partial<Product> | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  function startNew() {
    setEditing({ ...emptyProduct })
    setImages([])
  }

  function startEdit(p: Product) {
    setEditing({ ...p })
    const existing = safeParseImages(p.images_json)
    setImages(existing.length > 0 ? existing : p.image_url ? [p.image_url] : [])
  }

  function addImageSlot() {
    setImages((prev) => [...prev, ''])
  }

  function updateImageAt(i: number, url: string) {
    setImages((prev) => prev.map((img, idx) => (idx === i ? url : img)))
  }

  function removeImageAt(i: number) {
    setImages((prev) => prev.filter((_, idx) => idx !== i))
  }

  function moveImage(i: number, dir: -1 | 1) {
    setImages((prev) => {
      const next = [...prev]
      const target = i + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[i], next[target]] = [next[target], next[i]]
      return next
    })
  }

  async function handleSave() {
    if (!editing) return
    setSaving(true)
    try {
      const cleanImages = images.filter((u) => u && u.trim() !== '')
      const payload: Partial<Product> = {
        ...editing,
        image_url: cleanImages[0] || '',
        images_json: JSON.stringify(cleanImages),
      }

      if (editing.id) {
        await updateProduct(editing.id, payload)
        setProducts((prev) =>
          prev.map((p) => (p.id === editing.id ? ({ ...p, ...payload } as Product) : p))
        )
      } else {
        await createProduct(payload)
        window.location.reload()
        return
      }
      setEditing(null)
      setImages([])
    } catch (err) {
      alert('حدث خطأ أثناء الحفظ')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('تأكيد حذف المنتج؟')) return
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
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

  const focusHandlers = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      (e.currentTarget.style.borderColor = '#d4779a'),
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      (e.currentTarget.style.borderColor = '#f0d9e3'),
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
          المنتجات
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
          + إضافة منتج
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {products.map((p) => {
          const imgCount = safeParseImages(p.images_json).length
          return (
            <div
              key={p.id}
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
              {p.image_url && (
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image_url}
                    alt=""
                    style={{
                      width: '48px',
                      height: '48px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      border: '1px solid #f0d9e3',
                      display: 'block',
                    }}
                  />
                  {imgCount > 1 && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '-4px',
                        right: '-4px',
                        background: '#d4779a',
                        color: '#fff',
                        fontSize: '9px',
                        fontWeight: 700,
                        borderRadius: '8px',
                        padding: '1px 5px',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                      }}
                    >
                      {imgCount}
                    </span>
                  )}
                </div>
              )}
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, color: '#5a4a4a', margin: 0, fontSize: '14px' }}>
                  {p.name}
                </p>
                <p style={{ fontSize: '13px', color: '#b0a39c', margin: '2px 0 0' }}>
                  {p.price} ريال
                </p>
              </div>
              <button
                onClick={() => startEdit(p)}
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
                onClick={() => handleDelete(p.id)}
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
          )
        })}
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
              maxWidth: '440px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              fontFamily: 'Tajawal, sans-serif',
            }}
          >
            <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#b85c80', margin: 0 }}>
              {editing.id ? 'تعديل منتج' : 'منتج جديد'}
            </h3>

            <input
              placeholder="اسم المنتج"
              value={editing.name || ''}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              style={inputStyle}
              {...focusHandlers}
            />

            <textarea
              placeholder="الوصف"
              value={editing.description || ''}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
              {...focusHandlers}
            />

            <input
              type="number"
              placeholder="السعر"
              value={editing.price ?? 0}
              onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
              style={inputStyle}
              {...focusHandlers}
            />

            <select
              value={editing.category_id || ''}
              onChange={(e) => setEditing({ ...editing, category_id: e.target.value })}
              style={inputStyle}
              {...focusHandlers}
            >
              <option value="">بدون تصنيف</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* ===== صور المنتج (يدعم أكثر من صورة) ===== */}
            <div>
              <label style={labelStyle}>
                صور المنتج {images.length > 0 ? '(' + images.length + ')' : ''}
              </label>
              <p style={{ fontSize: '11px', color: '#b0a39c', margin: '0 0 10px' }}>
                الصورة الأولى تظهر كصورة غلاف المنتج بالموقع.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {images.map((img, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'flex-start',
                      backgroundColor: '#fdf6f2',
                      border: '1px solid #f5e6da',
                      borderRadius: '14px',
                      padding: '10px',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <ImageUploader value={img} onChange={(url) => updateImageAt(i, url)} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '2px' }}>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          color: '#fff',
                          backgroundColor: i === 0 ? '#d4779a' : '#cdb8bf',
                          borderRadius: '8px',
                          padding: '2px 6px',
                          textAlign: 'center',
                        }}
                      >
                        {i === 0 ? 'غلاف' : i + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => moveImage(i, -1)}
                        disabled={i === 0}
                        style={{
                          background: 'none',
                          border: '1px solid #f0d9e3',
                          borderRadius: '8px',
                          cursor: i === 0 ? 'not-allowed' : 'pointer',
                          opacity: i === 0 ? 0.4 : 1,
                          fontSize: '12px',
                          padding: '3px 6px',
                          color: '#5a4a4a',
                        }}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(i, 1)}
                        disabled={i === images.length - 1}
                        style={{
                          background: 'none',
                          border: '1px solid #f0d9e3',
                          borderRadius: '8px',
                          cursor: i === images.length - 1 ? 'not-allowed' : 'pointer',
                          opacity: i === images.length - 1 ? 0.4 : 1,
                          fontSize: '12px',
                          padding: '3px 6px',
                          color: '#5a4a4a',
                        }}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImageAt(i)}
                        style={{
                          background: 'none',
                          border: '1px solid #f5d3d3',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          padding: '3px 6px',
                          color: '#c45c5c',
                        }}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addImageSlot}
                style={{
                  width: '100%',
                  marginTop: '10px',
                  background: '#fffaf8',
                  border: '1px dashed #d4779a',
                  borderRadius: '12px',
                  padding: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#b85c80',
                  cursor: 'pointer',
                  fontFamily: 'Tajawal, sans-serif',
                }}
              >
                + إضافة صورة أخرى
              </button>
            </div>
            {/* ===== نهاية صور المنتج ===== */}

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
                checked={editing.is_available ?? true}
                onChange={(e) => setEditing({ ...editing, is_available: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: '#d4779a' }}
              />
              متوفر
            </label>

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
                checked={editing.is_featured ?? false}
                onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: '#d4779a' }}
              />
              مميز
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
                onClick={() => { setEditing(null); setImages([]) }}
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
