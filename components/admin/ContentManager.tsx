'use client'

import { useState } from 'react'
import { updateSettingsBulk } from '@/lib/admin-actions'
import { Category, HeroSlide, PromoCard } from '@/lib/types'
import ImageUploader from './ImageUploader'

const defaultHeroSlides: HeroSlide[] = [
  { image_url: '', title: 'لحظاتك تستحق', subtitle: 'هدايا تليق بها', desc: 'تشكيلة فاخرة من الهدايا والورد' },
  { image_url: '', title: 'أجمل الهدايا', subtitle: 'بلمسة من القلب', desc: 'توصيل سريع لجميع أحياء بريدة' },
  { image_url: '', title: 'مناسباتك الخاصة', subtitle: 'نجعلها لا تُنسى', desc: 'تصاميم حصرية وراقية' },
]

const defaultPromoCards: PromoCard[] = [
  { image_url: '', title: 'هدايا تجعلهم يبتسمون', btn_text: 'تسوق الهدايا', btn_color: '#E8638A', category_id: 'all' },
  { image_url: '', title: 'توصيل سريع في نفس اليوم', btn_text: 'اطلب الآن', btn_color: '#E8638A', category_id: 'all' },
  { image_url: '', title: 'تنسيقات ورد فاخرة', btn_text: 'تسوق الآن', btn_color: '#C8956C', category_id: 'all' },
]

function safeParse<T>(json: string | undefined, fallback: T): T {
  if (!json) return fallback
  try {
    const parsed = JSON.parse(json)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed as T
    return fallback
  } catch {
    return fallback
  }
}

export default function ContentManager({
  initialSettings,
  categories,
}: {
  initialSettings: Record<string, string>
  categories: Category[]
}) {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(
    safeParse(initialSettings.hero_slides_json, defaultHeroSlides)
  )
  const [promoCards, setPromoCards] = useState<PromoCard[]>(
    safeParse(initialSettings.promo_cards_json, defaultPromoCards)
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function updateHero(i: number, field: keyof HeroSlide, value: string) {
    setHeroSlides((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)))
    setSaved(false)
  }

  function updatePromo(i: number, field: keyof PromoCard, value: string) {
    setPromoCards((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)))
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    try {
      await updateSettingsBulk({
        hero_slides_json: JSON.stringify(heroSlides),
        promo_cards_json: JSON.stringify(promoCards),
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
        الواجهة الرئيسية
      </h2>
      <p style={{ fontSize: '13px', color: '#9c7d8a', margin: '-10px 0 0' }}>
        تحكمي بصور ونصوص السلايدر الكبير والبطاقات الثلاث اللي تظهر بالموقع العام.
      </p>

      <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#b85c80', margin: '4px 0 0' }}>
        🖼️ السلايدر الكبير
      </h3>
      {heroSlides.map((slide, i) => (
        <div key={i} style={cardBoxStyle}>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#5a4a4a', margin: 0 }}>الشريحة {i + 1}</p>

          <div>
            <label style={labelStyle}>الصورة</label>
            <ImageUploader value={slide.image_url} onChange={(url) => updateHero(i, 'image_url', url)} />
          </div>

          <div>
            <label style={labelStyle}>العنوان الرئيسي</label>
            <input
              type="text"
              value={slide.title}
              onChange={(e) => updateHero(i, 'title', e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#d4779a')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#f0d9e3')}
            />
          </div>

          <div>
            <label style={labelStyle}>العنوان الفرعي</label>
            <input
              type="text"
              value={slide.subtitle}
              onChange={(e) => updateHero(i, 'subtitle', e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#d4779a')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#f0d9e3')}
            />
          </div>

          <div>
            <label style={labelStyle}>الوصف</label>
            <input
              type="text"
              value={slide.desc}
              onChange={(e) => updateHero(i, 'desc', e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#d4779a')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#f0d9e3')}
            />
          </div>
        </div>
      ))}

      <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#b85c80', margin: '4px 0 0' }}>
        🎀 البطاقات الثلاث
      </h3>
      {promoCards.map((card, i) => (
        <div key={i} style={cardBoxStyle}>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#5a4a4a', margin: 0 }}>البطاقة {i + 1}</p>

          <div>
            <label style={labelStyle}>الصورة</label>
            <ImageUploader value={card.image_url} onChange={(url) => updatePromo(i, 'image_url', url)} />
          </div>

          <div>
            <label style={labelStyle}>عنوان البطاقة</label>
            <input
              type="text"
              value={card.title}
              onChange={(e) => updatePromo(i, 'title', e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#d4779a')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#f0d9e3')}
            />
          </div>

          <div>
            <label style={labelStyle}>نص الزر</label>
            <input
              type="text"
              value={card.btn_text}
              onChange={(e) => updatePromo(i, 'btn_text', e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#d4779a')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#f0d9e3')}
            />
          </div>

          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>لون الزر</label>
              <input
                type="color"
                value={card.btn_color || '#E8638A'}
                onChange={(e) => updatePromo(i, 'btn_color', e.target.value)}
                style={{ width: '100%', height: '40px', borderRadius: '12px', border: '1px solid #f0d9e3', padding: '2px', cursor: 'pointer' }}
              />
            </div>
            <div style={{ flex: 2 }}>
              <label style={labelStyle}>عند الضغط يفتح</label>
              <select
                value={card.category_id || 'all'}
                onChange={(e) => updatePromo(i, 'category_id', e.target.value)}
                style={inputStyle}
              >
                <option value="all">كل المنتجات</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ))}

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
