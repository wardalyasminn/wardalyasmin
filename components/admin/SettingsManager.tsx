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
  const [tiktokUrl, setTiktokUrl] = useState(initialSettings.tiktok_url || '')
  const [snapchatUrl, setSnapchatUrl] = useState(initialSettings.snapchat_url || '')
  const [logoUrl, setLogoUrl] = useState(initialSettings.logo_url || '')
  const [workingHours, setWorkingHours] = useState(initialSettings.working_hours || '')
  const [contactEmail, setContactEmail] = useState(initialSettings.contact_email || '')
  const [commercialRegister, setCommercialRegister] = useState(initialSettings.commercial_register || '')
  const [maroofBadgeUrl, setMaroofBadgeUrl] = useState(initialSettings.maroof_badge_url || '')
  const [footerCopyrightText, setFooterCopyrightText] = useState(initialSettings.footer_copyright_text || '')
  // نص الوصف الترويجي أعلى الفوتر (كان ثابت بالكود، الحين قابل للتعديل)
  const [footerDescText, setFooterDescText] = useState(initialSettings.footer_desc_text || '')
  // رابط الدفع / الحساب البنكي اللي يظهر بالفوتر
  const [paymentLinkLabel, setPaymentLinkLabel] = useState(initialSettings.payment_link_label || '')
  const [paymentLinkUrl, setPaymentLinkUrl] = useState(initialSettings.payment_link_url || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await updateSettingsBulk({
        whatsapp,
        store_open: storeOpen ? 'true' : 'false',
        min_order: minOrder,
        delivery_fee: deliveryFee,
        instagram_url: instagramUrl,
        tiktok_url: tiktokUrl,
        snapchat_url: snapchatUrl,
        logo_url: logoUrl,
        working_hours: workingHours,
        contact_email: contactEmail,
        commercial_register: commercialRegister,
        maroof_badge_url: maroofBadgeUrl,
        footer_copyright_text: footerCopyrightText,
        footer_desc_text: footerDescText,
        payment_link_label: paymentLinkLabel,
        payment_link_url: paymentLinkUrl,
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

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    resize: 'vertical',
    minHeight: '80px',
    lineHeight: 1.7,
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

  const sectionTitleStyle: React.CSSProperties = {
    fontWeight: 700,
    fontSize: '15px',
    color: '#b85c80',
    margin: '4px 0 0',
  }

  function focusPink(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.currentTarget.style.borderColor = '#d4779a'
  }
  function blurGray(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.currentTarget.style.borderColor = '#f0d9e3'
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
            onFocus={focusPink}
            onBlur={blurGray}
          />
        </div>

        {/* ✅ المفتاح مُصلح — بدون onClick مكرر على الـ span */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ ...labelStyle, marginBottom: 0 }}>المتجر مفتوح حالياً</label>
          <label style={{ position: 'relative', display: 'inline-block', width: '46px', height: '26px', cursor: 'pointer' }}>
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
              onFocus={focusPink}
              onBlur={blurGray}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>رسوم التوصيل (ريال)</label>
            <input
              type="number"
              value={deliveryFee}
              onChange={(e) => { setDeliveryFee(e.target.value); setSaved(false) }}
              style={inputStyle}
              onFocus={focusPink}
              onBlur={blurGray}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>إشعار أوقات العمل (يظهر بشريط علوي فوق الموقع)</label>
          <input
            type="text"
            value={workingHours}
            onChange={(e) => { setWorkingHours(e.target.value); setSaved(false) }}
            style={inputStyle}
            placeholder="مثال: نستقبل طلباتكم يومياً من 9 صباحاً حتى 11 مساءً عدا الجمعة"
            onFocus={focusPink}
            onBlur={blurGray}
          />
          <p style={{ fontSize: '12px', color: '#b0a39c', marginTop: '6px' }}>
            اتركه فارغاً لإخفاء الشريط نهائياً من الموقع.
          </p>
        </div>

        <div>
          <label style={labelStyle}>شعار المتجر</label>
          <ImageUploader value={logoUrl} onChange={(url) => { setLogoUrl(url); setSaved(false) }} />
        </div>
      </div>

      {/* قسم الفوتر */}
      <div style={cardBoxStyle}>
        <h3 style={sectionTitleStyle}>إعدادات الفوتر (أسفل الموقع)</h3>

        <div>
          <label style={labelStyle}>النص الترويجي أعلى الفوتر</label>
          <textarea
            value={footerDescText}
            onChange={(e) => { setFooterDescText(e.target.value); setSaved(false) }}
            style={textareaStyle}
            placeholder="تشكيلة فاخرة من الهدايا والورد لجميع مناسباتكم السعيدة – بريدة، القصيم."
            onFocus={focusPink}
            onBlur={blurGray}
          />
          <p style={{ fontSize: '12px', color: '#b0a39c', marginTop: '6px' }}>
            اتركه فارغاً لاستخدام النص الافتراضي.
          </p>
        </div>

        <div>
          <label style={labelStyle}>رابط حساب إنستقرام</label>
          <input
            type="text"
            value={instagramUrl}
            onChange={(e) => { setInstagramUrl(e.target.value); setSaved(false) }}
            style={inputStyle}
            placeholder="https://www.instagram.com/..."
            onFocus={focusPink}
            onBlur={blurGray}
          />
        </div>

        <div>
          <label style={labelStyle}>رابط حساب تيك توك</label>
          <input
            type="text"
            value={tiktokUrl}
            onChange={(e) => { setTiktokUrl(e.target.value); setSaved(false) }}
            style={inputStyle}
            placeholder="https://www.tiktok.com/@..."
            onFocus={focusPink}
            onBlur={blurGray}
          />
        </div>

        <div>
          <label style={labelStyle}>رابط حساب سناب شات</label>
          <input
            type="text"
            value={snapchatUrl}
            onChange={(e) => { setSnapchatUrl(e.target.value); setSaved(false) }}
            style={inputStyle}
            placeholder="https://www.snapchat.com/add/..."
            onFocus={focusPink}
            onBlur={blurGray}
          />
        </div>

        <div>
          <label style={labelStyle}>البريد الإلكتروني للتواصل</label>
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => { setContactEmail(e.target.value); setSaved(false) }}
            style={inputStyle}
            placeholder="info@wardalyasmin.com"
            onFocus={focusPink}
            onBlur={blurGray}
          />
        </div>

        <div>
          <label style={labelStyle}>رقم السجل التجاري (اختياري)</label>
          <input
            type="text"
            value={commercialRegister}
            onChange={(e) => { setCommercialRegister(e.target.value); setSaved(false) }}
            style={inputStyle}
            placeholder="1010xxxxxx"
            onFocus={focusPink}
            onBlur={blurGray}
          />
        </div>

        <div>
          <label style={labelStyle}>شارة "موثوق" (منصة أعمال) — ارفع صورة الشارة</label>
          <ImageUploader value={maroofBadgeUrl} onChange={(url) => { setMaroofBadgeUrl(url); setSaved(false) }} />
          <p style={{ fontSize: '12px', color: '#b0a39c', marginTop: '6px' }}>
            اتركه فارغاً لإخفاء الشارة من الفوتر.
          </p>
        </div>

        <div>
          <label style={labelStyle}>نص حقوق النشر أسفل الموقع</label>
          <input
            type="text"
            value={footerCopyrightText}
            onChange={(e) => { setFooterCopyrightText(e.target.value); setSaved(false) }}
            style={inputStyle}
            placeholder="© 2026 ورد الياسمين للهدايا. جميع الحقوق محفوظة."
            onFocus={focusPink}
            onBlur={blurGray}
          />
          <p style={{ fontSize: '12px', color: '#b0a39c', marginTop: '6px' }}>
            اتركه فارغاً لاستخدام نص افتراضي تلقائي.
          </p>
        </div>
      </div>

      {/* قسم رابط الدفع / الحساب البنكي */}
      <div style={cardBoxStyle}>
        <h3 style={sectionTitleStyle}>رابط الدفع / الحساب البنكي (يظهر بالفوتر)</h3>

        <div>
          <label style={labelStyle}>نص الرابط (العنوان اللي يظهر للعميل)</label>
          <input
            type="text"
            value={paymentLinkLabel}
            onChange={(e) => { setPaymentLinkLabel(e.target.value); setSaved(false) }}
            style={inputStyle}
            placeholder="مثال: الدفع عبر تحويل بنكي / رابط الدفع الإلكتروني"
            onFocus={focusPink}
            onBlur={blurGray}
          />
        </div>

        <div>
          <label style={labelStyle}>الرابط نفسه</label>
          <input
            type="text"
            value={paymentLinkUrl}
            onChange={(e) => { setPaymentLinkUrl(e.target.value); setSaved(false) }}
            style={inputStyle}
            placeholder="https://... أو رابط صفحة تفاصيل الحساب البنكي"
            onFocus={focusPink}
            onBlur={blurGray}
          />
          <p style={{ fontSize: '12px', color: '#b0a39c', marginTop: '6px' }}>
            اتركه فارغاً لإخفاء هذا الرابط نهائياً من الفوتر.
          </p>
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
