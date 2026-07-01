'use client'

import { useState } from 'react'
import { updateSettingsBulk } from '@/lib/admin-actions'
import ImageUploader from './ImageUploader'

export default function SettingsManager({
  initialSettings,
}: {
  initialSettings: Record<string, string>
}) {
  const [whatsapp, setWhatsapp] = useState(initialSettings.whatsapp || '')
  const [storeOpen, setStoreOpen] = useState(initialSettings.store_open === 'true')
  const [minOrder, setMinOrder] = useState(initialSettings.min_order || '0')
  const [deliveryFee, setDeliveryFee] = useState(initialSettings.delivery_fee || '0')
  const [instagramUrl, setInstagramUrl] = useState(initialSettings.instagram_url || '')
  const [logoUrl, setLogoUrl] = useState(initialSettings.logo_url || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await updateSettingsBulk({
        whatsapp: whatsapp,
        store_open: storeOpen ? 'true' : 'false',
        min_order: minOrder,
        delivery_fee: deliveryFee,
        instagram_url: instagramUrl,
        logo_url: logoUrl,
      })
      setSaved(true)
    } catch (err) {
      alert('حدث خطأ أثناء الحفظ')
      console.error(err)
    } finally {
      setSaving(false)
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

  const cardBoxStyle: React.CSSProperties = {
    backgroundColor: '#fdf6f2',
    border: '1px solid #f5e6da',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontFamily: 'Tajawal, sans-serif' }}>
      <h2 style={{ fontWeight: 700, fontSize: '18px', color: '#b85c80', margin: 0 }}>
        إعدادات المتجر
      </h2>

      <div style={cardBoxStyle}>
        <div>
          <label style={labelStyle}>رقم الواتساب (بدون +)</label>
          <input
            type="text"
            value={whatsapp}
            onChange={(e) => { setWhatsapp(e.target.value); setSaved(false) }}
            style={inputStyle}
            placeholder="966500000000"
            onFocus={(e) => (e.currentTarget.style.borderColor = '#d4779a')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#f0d9e3')}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ ...labelStyle, marginBottom: 0 }}>المتجر مفتوح حالياً</label>
          <label style={{ position: 'relative', display: 'inline-block', width: '46px', height: '26px' }}>
            <input
              type="checkbox"
              checked={storeOpen}
              onChange={(e) => { setStoreOpen(e.target.checked); setSaved(false) }}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span
              style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: storeOpen ? '#d4779a' : '#e0c9d2',
                borderRadius: '26px',
                transition: '0.2s',
              }}
              onClick={() => { setStoreOpen(!storeOpen); setSaved(false) }}
            >
              <span
                style={{
                  position: 'absolute',
                  height: '20px',
                  width: '20px',
                  left: storeOpen ? '23px' : '3px',
                  bottom: '3px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  transition: '0.2s',
                }}
              />
            </span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '14px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>الحد الأدنى للطلب (ريال)</label>
            <input
              type="number"
              value={minOrder}
              onChange={(e) => { setMinOrder(e.target.value); setSaved(false) }}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#d4779a')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#f0d9e3')}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>رسوم التوصيل (ريال)</label>
            <input
              type="number"
              value={deliveryFee}
              onChange={(e) => { setDeliveryFee(e.target.value); setSaved(false) }}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#d4779a')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#f0d9e3')}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>رابط حساب إنستقرام</label>
          <input
            type="text"
            value={instagramUrl}
            onChange={(e) => { setInstagramUrl(e.target.value); setSaved(false) }}
            style={inputStyle}
            placeholder="https://www.instagram.com/..."
            onFocus={(e) => (e.currentTarget.style.borderColor = '#d4779a')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#f0d9e3')}
          />
        </div>

        <div>
          <label style={labelStyle}>شعار المتجر</label>
          <ImageUploader value={logoUrl} onChange={(url) => { setLogoUrl(url); setSaved(false) }} />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          width: '100%',
          backgroundColor: saved ? '#8fbf8f' : '#d4779a',
          color: '#fff',
          border: 'none',
          borderRadius: '20px',
          padding: '12px',
          fontSize: '15px',
          fontWeight: 700,
          fontFamily: 'Tajawal, sans-serif',
          cursor: saving ? 'not-allowed' : 'pointer',
          opacity: saving ? 0.7 : 1,
          transition: 'background-color 0.2s',
        }}
      >
        {saving ? 'جاري الحفظ...' : saved ? 'تم الحفظ ✓' : 'حفظ التغييرات'}
      </button>
    </div>
  )
}