'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (error) {
      setError('بيانات الدخول غير صحيحة')
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fdf6f2',
        padding: '1rem',
      }}
    >
      <form
        onSubmit={handleLogin}
        dir="rtl"
        style={{
          background: '#ffffff',
          width: '100%',
          maxWidth: '380px',
          borderRadius: '24px',
          boxShadow: '0 4px 24px rgba(212, 119, 154, 0.15)',
          padding: '2.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
          <img
            src="/images/logo.png"
            alt="ورد الياسمين للهدايا"
            style={{ width: '90px', height: 'auto', margin: '0 auto 0.8rem' }}
            onError={(e) => {
              alert('فشل تحميل الصورة: ' + (e.target as HTMLImageElement).src)
            }}
          />
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#b85c80' }}>
            تسجيل دخول لوحة التحكم
          </h1>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: '#555' }}>
            البريد الإلكتروني
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              border: '1px solid #e8d5c4',
              borderRadius: '12px',
              padding: '0.65rem 1rem',
              fontSize: '0.95rem',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', color: '#555' }}>
            كلمة المرور
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              border: '1px solid #e8d5c4',
              borderRadius: '12px',
              padding: '0.65rem 1rem',
              fontSize: '0.95rem',
              outline: 'none',
            }}
          />
        </div>

        {error && <p style={{ color: '#dc2626', fontSize: '0.85rem' }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            background: '#d4779a',
            color: '#fff',
            border: 'none',
            borderRadius: '9999px',
            padding: '0.75rem',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'جاري الدخول...' : 'دخول'}
        </button>
      </form>
    </div>
  )
}