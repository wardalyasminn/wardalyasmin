'use client'

import { useState } from 'react'
import { uploadImage } from '@/lib/admin-actions'

export default function ImageUploader({
  value,
  onChange,
}: {
  value?: string
  onChange: (url: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const url = await uploadImage(formData)
      onChange(url)
    } catch (err) {
      setError('فشل رفع الصورة')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'Tajawal, sans-serif' }}>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          style={{
            width: '96px',
            height: '96px',
            objectFit: 'cover',
            borderRadius: '14px',
            border: '1px solid #f0d9e3',
          }}
        />
      )}

      <label
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 'fit-content',
          backgroundColor: '#fdf6f2',
          border: '1px solid #f0d9e3',
          borderRadius: '14px',
          padding: '10px 18px',
          fontSize: '13px',
          fontWeight: 600,
          color: '#b85c80',
          cursor: uploading ? 'not-allowed' : 'pointer',
          opacity: uploading ? 0.6 : 1,
          transition: 'background-color 0.2s',
        }}
      >
        {uploading ? 'جاري الرفع...' : value ? 'تغيير الصورة' : 'اختيار صورة'}
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          disabled={uploading}
          style={{ display: 'none' }}
        />
      </label>

      {error && (
        <p style={{ fontSize: '12px', color: '#c45c5c', margin: 0 }}>{error}</p>
      )}
    </div>
  )
}