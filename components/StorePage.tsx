'use client'

import { useState } from 'react'
import { Product, Category, Settings, CartItem, PaymentMethod, Discount } from '@/lib/types'

interface Props {
  products: Product[]
  categories: Category[]
  settings: Settings
  paymentMethods: PaymentMethod[]
  discounts: Discount[]
}

type Lang = 'ar' | 'en'

function formatTime(time: string | undefined, lang: Lang) {
  if (!time) return ''
  const parts = time.split(':')
  const hStr = parts[0]
  const mStr = parts[1] || '00'
  let h = parseInt(hStr, 10)
  const isPM = h >= 12
  const period = lang === 'ar' ? (isPM ? 'م' : 'ص') : (isPM ? 'PM' : 'AM')
  h = h % 12
  if (h === 0) h = 12
  return h + ':' + mStr + ' ' + period
}

function safeParseArray(json: string | undefined): any[] | null {
  if (!json) return null
  try {
    const parsed = JSON.parse(json)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed
    return null
  } catch {
    return null
  }
}

function getProductImages(product: Product): string[] {
  const fromJson = safeParseArray((product as any).images_json) as string[] | null
  if (fromJson && fromJson.length > 0) return fromJson.filter((u) => typeof u === 'string' && u.trim() !== '')
  return product.image_url ? [product.image_url] : []
}

const translations = {
  ar: {
    deliveryBar: 'توصيل سريع خلال 2-4 ساعة',
    supportBar: 'الدعم متاح 24/7',
    sidebarHome: 'الرئيسية',
    sidebarCategories: 'التصنيفات',
    sidebarWishlist: 'المفضلة',
    sidebarCart: 'سلتي',
    sidebarAccount: 'حسابي',
    workHours: 'أوقات العمل:',
    location: 'بريدة، القصيم',
    cartTitle: 'سلة المشتريات',
    cartEmpty: 'سلتك فاضية',
    pickup: 'استلام من المحل',
    delivery: 'توصيل',
    subtotal: 'المجموع',
    deliveryFeeLabel: 'التوصيل',
    discountLabel: 'الخصم',
    total: 'الإجمالي',
    checkoutWhatsapp: '💬 إتمام الطلب عبر واتساب',
    shopNow: 'تسوق الآن',
    allCategories: 'جميع الأقسام',
    bestSelling: 'الأكثر مبيعاً',
    noProductsTitle: 'لا توجد منتجات في هذا القسم',
    noProductsDesc: 'سيتم إضافة المنتجات قريباً',
    bestSellerBadge: 'الأكثر طلباً',
    addBtn: 'أضف',
    contactUs: 'تواصل معنا',
    paymentMethods: 'طرق الدفع المتاحة',
    rights: 'جميع الحقوق محفوظة',
    tagline: 'هدايا تليق بلحظاتك الخاصة 🌸',
    searchPlaceholder: 'ابحث عن هدية أو منتج...',
    searchNoResults: 'لا توجد نتائج مطابقة',
    currency: 'ر.س',
    loginSoon: 'تسجيل الدخول قريباً',
    discountCode: 'كود الخصم',
    applyDiscount: 'تطبيق',
    invalidDiscount: 'كود خصم غير صحيح',
  },
  en: {
    deliveryBar: 'Fast delivery within 2-4 hours',
    supportBar: 'Support available 24/7',
    sidebarHome: 'Home',
    sidebarCategories: 'Categories',
    sidebarWishlist: 'Wishlist',
    sidebarCart: 'My Cart',
    sidebarAccount: 'My Account',
    workHours: 'Working hours:',
    location: 'Buraidah, Qassim',
    cartTitle: 'Shopping Cart',
    cartEmpty: 'Your cart is empty',
    pickup: 'Store pickup',
    delivery: 'Delivery',
    subtotal: 'Subtotal',
    deliveryFeeLabel: 'Delivery fee',
    discountLabel: 'Discount',
    total: 'Total',
    checkoutWhatsapp: '💬 Checkout via WhatsApp',
    shopNow: 'Shop now',
    allCategories: 'All categories',
    bestSelling: 'Best sellers',
    noProductsTitle: 'No products in this category',
    noProductsDesc: 'Products will be added soon',
    bestSellerBadge: 'Best seller',
    addBtn: 'Add',
    contactUs: 'Contact us',
    paymentMethods: 'Available payment methods',
    rights: 'All rights reserved',
    tagline: 'Gifts that match your special moments 🌸',
    searchPlaceholder: 'Search for a gift or product...',
    searchNoResults: 'No matching results',
    currency: 'SAR',
    loginSoon: 'Login coming soon',
    discountCode: 'Discount code',
    applyDiscount: 'Apply',
    invalidDiscount: 'Invalid discount code',
  },
}

export default function StorePage({ products, categories, settings, paymentMethods, discounts }: Props) {
  const [lang, setLang] = useState<Lang>('ar')
  const t = translations[lang]

  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showCart, setShowCart] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup')
  const [heroSlide, setHeroSlide] = useState(0)
  const [toast, setToast] = useState<string | null>(null)
  const [activeImageByProduct, setActiveImageByProduct] = useState<Record<string, number>>({})
  const [discountCode, setDiscountCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null)

  const setActiveImage = (productId: string, index: number) => {
    setActiveImageByProduct((prev) => ({ ...prev, [productId]: index }))
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }

  const scrollToProducts = () => {
    const el = document.getElementById('products-section')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const adminHeroSlides = safeParseArray(settings.hero_slides_json)
  const adminPromoCards = safeParseArray(settings.promo_cards_json)
  const heroSlides: any[] = adminHeroSlides || []
  const promoCards: any[] = adminPromoCards || []

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev
      .map(i => i.product.id === productId ? { ...i, quantity: i.quantity + delta } : i)
      .filter(i => i.quantity > 0)
    )
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId))
  }

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  function applyDiscountCode() {
    const code = discountCode.trim().toUpperCase()
    const discount = discounts.find(d => d.code === code && d.is_active)
    
    if (!discount) {
      showToast(t.invalidDiscount)
      return
    }

    const now = new Date()
    const validFrom = new Date(discount.valid_from)
    const validUntil = new Date(discount.valid_until)
    
    if (now < validFrom || now > validUntil) {
      showToast(t.invalidDiscount)
      return
    }

    if (discount.max_uses && discount.used_count >= discount.max_uses) {
      showToast(t.invalidDiscount)
      return
    }

    setAppliedDiscount(discount)
    showToast('تم تطبيق الخصم بنجاح ✓')
  }

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  
  let discountAmount = 0
  if (appliedDiscount) {
    if (appliedDiscount.type === 'percentage' && appliedDiscount.percentage_value) {
      discountAmount = (subtotal * appliedDiscount.percentage_value) / 100
    } else if (appliedDiscount.type === 'fixed' && appliedDiscount.fixed_value) {
      discountAmount = appliedDiscount.fixed_value
    }
  }
  
  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount)
  const deliveryFee = deliveryType === 'delivery' ? (appliedDiscount?.type === 'free_shipping' ? 0 : Number(settings.delivery_fee)) : 0
  const total = subtotalAfterDiscount + deliveryFee

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category_id === selectedCategory)

  const searchResults = searchQuery.trim()
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : []

  const activePaymentMethods = paymentMethods
    .filter(m => m.is_active)
    .sort((a, b) => a.sort_order - b.sort_order)

  const sendWhatsApp = () => {
    const itemLines = cart.map(i => '- ' + i.product.name + ' x' + i.quantity + ' = ' + (i.product.price * i.quantity) + ' ' + t.currency)
    const items = itemLines.join('\n')
    const deliveryLabel = deliveryType === 'pickup' ? t.pickup : t.delivery
    let msg = 'طلب جديد من ورد الياسمين 🌸\n\n' + items + '\n\n' + t.subtotal + ': ' + subtotal + ' ' + t.currency + '\n'
    if (appliedDiscount) msg += t.discountLabel + ': -' + discountAmount + ' ' + t.currency + '\n'
    msg += t.deliveryFeeLabel + ': ' + deliveryFee + ' ' + t.currency + '\n' + t.total + ': ' + total + ' ' + t.currency + '\n\n' + t.waPickupType + ': ' + deliveryLabel
    const waUrl = 'https://wa.me/' + settings.whatsapp + '?text=' + encodeURIComponent(msg)
    window.open(waUrl)
  }

  const socialBtnStyle: React.CSSProperties = {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '19px',
    textDecoration: 'none',
    color: '#fff',
    cursor: 'pointer',
  }

  const currentSlide = heroSlides[heroSlide] || {}

  return (
    <div className="store-outer" dir={lang === 'ar' ? 'rtl' : 'ltr'} style={{ fontFamily: 'Tajawal, sans-serif' }}>
      <div className="store-container" style={{ background: '#fff', position: 'relative' }}>

        {toast && (
          <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: '#3D1A24', color: '#fff', padding: '10px 20px', borderRadius: '20px', fontSize: '13px', zIndex: 1000 }}>
            {toast}
          </div>
        )}

        <div style={{ background: '#FDEEE6', color: '#3D1A24', fontSize: '11px', padding: '8px 16px', display: 'flex', justifyContent: 'space-between' }}>
          <span>🚚 {t.deliveryBar}</span>
          <span>🎧 {t.supportBar}</span>
        </div>

        <header style={{ background: '#fff', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F5E8EC', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <button onClick={() => setShowSidebar(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#3D1A24', lineHeight: 1, position: 'relative', zIndex: 2 }}>☰</button>
            <button onClick={() => setShowSearch(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#3D1A24', position: 'relative', zIndex: 2 }}>🔍</button>
            <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} style={{ background: 'none', border: '1px solid #F5E8EC', borderRadius: '12px', cursor: 'pointer', fontSize: '11px', fontWeight: 600, color: '#b85c80', padding: '6px 12px' }}>
              🌐 {lang === 'ar' ? 'EN' : 'AR'}
            </button>
          </div>

          <div style={{ textAlign: 'center' }}>
            <img src="/images/logo.png" alt="ورد الياسمين" style={{ height: '48px', objectFit: 'contain' }} />
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <button onClick={() => showToast(t.loginSoon)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '17px', color: '#3D1A24', position: 'relative', zIndex: 2 }}>👤</button>
            <button onClick={() => setShowCart(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', fontSize: '17px', color: '#3D1A24', zIndex: 2 }}>
              🛍️
              {totalItems > 0 && (
                <span style={{ position: 'absolute', top: '-7px', right: '-9px', background: '#E8975A', color: '#fff', borderRadius: '50%', width: '17px', height: '17px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{totalItems}</span>
              )}
            </button>
          </div>
        </header>

        {showSearch && (
          <>
            <div onClick={() => { setShowSearch(false); setSearchQuery('') }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 700 }} />
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: '#fff', zIndex: 800, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '14px 16px', display: 'flex', gap: '10px', alignItems: 'center', borderBottom: '1px solid #F5E8EC' }}>
                <span style={{ fontSize: '16px' }}>🔍</span>
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: '14px', fontFamily: 'Tajawal, sans-serif', color: '#3D1A24' }}
                />
                <button onClick={() => { setShowSearch(false); setSearchQuery('') }} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#3D1A24' }}>✕</button>
              </div>
              <div style={{ overflowY: 'auto', padding: searchQuery.trim() ? '8px' : '0' }}>
                {searchQuery.trim() && searchResults.length === 0 && (
                  <p style={{ textAlign: 'center', color: '#999', fontSize: '13px', padding: '24px' }}>{t.searchNoResults}</p>
                )}
                {searchResults.map(product => (
                  <div key={product.id} onClick={() => { addToCart(product); setShowSearch(false); setSearchQuery(''); showToast(product.name) }} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #F5E8EC', cursor: 'pointer' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#FDF0F3', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '20px' }}>🎁</span>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#3D1A24' }}>{product.name}</p>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#E8638A', fontWeight: 700 }}>{product.price} {t.currency}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {showSidebar && (
          <>
            <div onClick={() => setShowSidebar(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300 }} />
            <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: '240px', background: '#fff', zIndex: 400, boxShadow: '4px 0 20px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: '#E8638A', padding: '30px 20px 20px', textAlign: 'center' }}>
                <img src="/images/logo.png" alt="ورد الياسمين" style={{ height: '70px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
              </div>
              <div style={{ flex: 1 }}>
                {[
                  { icon: '🏠', label: t.sidebarHome },
                  { icon: '🛍️', label: t.sidebarCategories },
                  { icon: '❤️', label: t.sidebarWishlist, badge: wishlist.length },
                  { icon: '🛒', label: t.sidebarCart, badge: totalItems },
                  { icon: '👤', label: t.sidebarAccount },
                ].map((item) => (
                  <button key={item.label} onClick={() => {
                    if (item.label === t.sidebarCart) { setShowCart(true); setShowSidebar(false) }
                    else if (item.label === t.sidebarCategories) { setShowSidebar(false); scrollToProducts() }
                    else if (item.label === t.sidebarAccount) { setShowSidebar(false); showToast(t.loginSoon) }
                    else setShowSidebar(false)
                  }} style={{ width: '100%', background: 'none', border: 'none', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', fontSize: '15px', color: '#3D1A24', borderBottom: '1px solid #FDF0F3' }}>
                    <span style={{ fontSize: '20px' }}>{item.icon}</span>
                    <span style={{ flex: 1, textAlign: lang === 'ar' ? 'right' : 'left' }}>{item.label}</span>
                    {item.badge ? <span style={{ background: '#E8638A', color: '#fff', borderRadius: '12px', padding: '2px 8px', fontSize: '12px' }}>{item.badge}</span> : null}
                  </button>
                ))}
              </div>
              <div style={{ padding: '20px', borderTop: '1px solid #FDF0F3', textAlign: 'center' }}>
                <p style={{ color: '#888', fontSize: '12px', margin: '0 0 4px' }}>
                  {t.workHours} {formatTime(settings.work_open_time, lang)} - {formatTime(settings.work_close_time, lang)}
                </p>
                <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>{t.location}</p>
              </div>
            </div>
          </>
        )}

        {showCart && (
          <>
            <div onClick={() => setShowCart(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 500 }} />
            <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '380px', background: '#fff', zIndex: 600, boxShadow: '-4px 0 20px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '16px', borderBottom: '1px solid #F5E8EC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#3D1A24' }}>{t.cartTitle}</h3>
                <button onClick={() => setShowCart(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#3D1A24' }}>✕</button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                {cart.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
                    <div style={{ fontSize: '48px', marginBottom: '10px' }}>🛒</div>
                    <p style={{ fontSize: '14px' }}>{t.cartEmpty}</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {cart.map(item => (
                      <div key={item.product.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', borderBottom: '1px solid #F5E8EC', paddingBottom: '12px' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '10px', background: '#FDF0F3', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                          {item.product.image_url ? (
                            <img src={item.product.image_url} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: '24px' }}>🎁</span>
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#3D1A24' }}>{item.product.name}</p>
                          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E8638A', fontWeight: 700 }}>{item.product.price} {t.currency}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button onClick={() => updateQuantity(item.product.id, -1)} style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid #eee', background: '#fff', cursor: 'pointer', fontSize: '14px' }}>−</button>
                          <span style={{ fontSize: '13px', minWidth: '16px', textAlign: 'center' }}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, 1)} style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid #eee', background: '#fff', cursor: 'pointer', fontSize: '14px' }}>+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.product.id)} style={{ background: 'none', border: 'none', color: '#c45c5c', cursor: 'pointer', fontSize: '13px' }}>🗑️</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div style={{ padding: '16px', borderTop: '1px solid #F5E8EC', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setDeliveryType('pickup')} style={{ flex: 1, padding: '8px', borderRadius: '10px', border: deliveryType === 'pickup' ? '2px solid #E8638A' : '1px solid #E8E8E8', background: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: deliveryType === 'pickup' ? '#E8638A' : '#999' }}>
                      {t.pickup}
                    </button>
                    <button onClick={() => setDeliveryType('delivery')} style={{ flex: 1, padding: '8px', borderRadius: '10px', border: deliveryType === 'delivery' ? '2px solid #E8638A' : '1px solid #E8E8E8', background: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: deliveryType === 'delivery' ? '#E8638A' : '#999' }}>
                      {t.delivery}
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input
                      placeholder={t.discountCode}
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      style={{ flex: 1, border: '1px solid #E8E8E8', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', outline: 'none' }}
                    />
                    <button onClick={applyDiscountCode} style={{ background: '#d4779a', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                      {t.applyDiscount}
                    </button>
                  </div>
                  {appliedDiscount && (
                    <p style={{ fontSize: '12px', color: '#28a745', margin: 0 }}>✓ {appliedDiscount.code}</p>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666' }}>
                    <span>{t.subtotal}</span><span>{subtotal} {t.currency}</span>
                  </div>
                  {appliedDiscount && discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#28a745', fontWeight: 600 }}>
                      <span>{t.discountLabel}</span><span>-{discountAmount.toFixed(2)} {t.currency}</span>
                    </div>
                  )}
                  {deliveryType === 'delivery' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666' }}>
                      <span>{t.deliveryFeeLabel}</span><span>{deliveryFee === 0 ? 'مجاني' : deliveryFee + ' ' + t.currency}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 700, color: '#3D1A24' }}>
                    <span>{t.total}</span><span>{total.toFixed(2)} {t.currency}</span>
                  </div>

                  <button onClick={sendWhatsApp} style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: '14px', padding: '13px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}>
                    {t.checkoutWhatsapp}
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* ===== الهيرو: صورة كاملة ===== */}
        <div style={{
          position: 'relative',
          background: currentSlide.bg || '#FDF0F3',
          padding: 0,
          overflow: 'hidden',
          minHeight: '280px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {currentSlide.image_url ? (
            <img
              src={currentSlide.image_url}
              alt={currentSlide.title || ''}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{ textAlign: 'center', color: '#ccc', fontSize: '60px' }}>🌸</div>
          )}

          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />

          <div style={{ position: 'absolute', left: '20px', right: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 2, color: '#fff', textAlign: 'center' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px', lineHeight: 1.2 }}>{currentSlide.title}</h1>
            <h2 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 12px', opacity: 0.95 }}>{currentSlide.subtitle}</h2>
            <p style={{ fontSize: '14px', margin: '0 0 16px', opacity: 0.9 }}>{currentSlide.desc}</p>
            <button onClick={() => { setSelectedCategory('all'); scrollToProducts() }} style={{ background: '#E8638A', color: '#fff', border: 'none', borderRadius: '25px', padding: '12px 28px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
              {t.shopNow}
            </button>
          </div>

          <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', justifyContent: 'center', gap: '6px', zIndex: 2 }}>
            {heroSlides.map((_, i) => (
              <button key={i} onClick={() => setHeroSlide(i)} style={{ width: i === heroSlide ? '20px' : '8px', height: '8px', borderRadius: '4px', background: i === heroSlide ? '#E8638A' : 'rgba(255,255,255,0.6)', border: 'none', cursor: 'pointer' }} />
            ))}
          </div>
        </div>

        <div style={{ padding: '20px 16px', background: '#fff', borderBottom: '1px solid #F5E8EC' }}>
          <div className="categories-row" style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
            <div onClick={() => { setSelectedCategory('all'); scrollToProducts() }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer', minWidth: 'max-content' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: selectedCategory === 'all' ? '#FDE8EF' : '#F8F8F8', border: '2px solid ' + (selectedCategory === 'all' ? '#E8638A' : '#ddd'), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>🛍️</div>
              <span style={{ fontSize: '11px', color: selectedCategory === 'all' ? '#E8638A' : '#666', whiteSpace: 'nowrap', fontWeight: selectedCategory === 'all' ? 700 : 400 }}>{t.allCategories}</span>
            </div>
            {categories.map(cat => (
              <div key={cat.id} onClick={() => { setSelectedCategory(cat.id); scrollToProducts() }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer', minWidth: 'max-content' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: selectedCategory === cat.id ? '#FDE8EF' : '#F8F8F8', border: '2px solid ' + (selectedCategory === cat.id ? '#E8638A' : '#ddd'), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
                  {cat.icon_type === 'image' && cat.icon ? (
                    <img src={cat.icon} alt={cat.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    cat.icon || '🎁'
                  )}
                </div>
                <span style={{ fontSize: '11px', color: selectedCategory === cat.id ? '#E8638A' : '#666', whiteSpace: 'nowrap', fontWeight: selectedCategory === cat.id ? 700 : 400 }}>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          {promoCards.map((card, i) => {
            const btnText = card.btn_text || card.btnText
            const btnColor = card.btn_color || card.btnColor || '#E8638A'
            const targetCategory = card.category_id || 'all'
            return (
              <div key={i} style={{
                background: card.image_url ? ('url(' + card.image_url + ') center/cover no-repeat') : (card.bg || '#FDE8EF'),
                borderRadius: '14px',
                padding: '14px 10px',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                {card.image_url && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />}
                <p style={{ color: '#fff', fontWeight: 700, fontSize: '13px', margin: 0, lineHeight: 1.3, position: 'relative', zIndex: 2 }}>{card.title}</p>
                <button onClick={() => { setSelectedCategory(targetCategory); scrollToProducts() }} style={{ background: btnColor, color: '#fff', border: 'none', borderRadius: '10px', padding: '6px 14px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', width: 'fit-content', position: 'relative', zIndex: 2 }}>
                  {btnText}
                </button>
              </div>
            )
          })}
        </div>

        <div id="products-section" style={{ padding: '16px', scrollMarginTop: '70px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: '#3D1A24', fontSize: '20px', fontWeight: 700, margin: 0 }}>
              {selectedCategory === 'all' ? t.bestSelling : (categories.find(c => c.id === selectedCategory)?.name || '')}
            </h3>
            <div style={{ width: '30px', height: '1px', background: '#C8956C' }} />
            <span style={{ color: '#C8956C', fontSize: '16px' }}>✿</span>
            <div style={{ width: '30px', height: '1px', background: '#C8956C' }} />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
            <div style={{ fontSize: '56px', marginBottom: '12px' }}>🌸</div>
            <p style={{ fontSize: '15px' }}>{t.noProductsTitle}</p>
            <p style={{ fontSize: '13px', color: '#bbb' }}>{t.noProductsDesc}</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => {
              const productImages = getProductImages(product)
              const activeIndex = Math.min(activeImageByProduct[product.id] || 0, Math.max(productImages.length - 1, 0))
              return (
              <div key={product.id} style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 14px rgba(232,99,138,0.08)', border: '1px solid #F5E8EC' }}>
                <div style={{ width: '100%', aspectRatio: '1 / 1', background: '#FDF0F3', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {productImages.length > 0 ? (
                    <img src={productImages[activeIndex]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '52px' }}>🎁</span>
                  )}

                  {productImages.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); setActiveImage(product.id, (activeIndex - 1 + productImages.length) % productImages.length) }}
                        style={{ position: 'absolute', top: '50%', right: '6px', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: '26px', height: '26px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        ‹
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setActiveImage(product.id, (activeIndex + 1) % productImages.length) }}
                        style={{ position: 'absolute', top: '50%', left: '6px', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: '26px', height: '26px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        ›
                      </button>
                      <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '4px' }}>
                        {productImages.map((_, i) => (
                          <span key={i} style={{ width: i === activeIndex ? '14px' : '5px', height: '5px', borderRadius: '3px', background: i === activeIndex ? '#E8638A' : 'rgba(255,255,255,0.85)', transition: 'all 0.2s' }} />
                        ))}
                      </div>
                    </>
                  )}

                  <button onClick={() => toggleWishlist(product.id)} style={{ position: 'absolute', top: '8px', right: '8px', background: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                    {wishlist.includes(product.id) ? '❤️' : '🤍'}
                  </button>
                  {product.is_featured && (
                    <div style={{ position: 'absolute', top: '8px', left: '8px', background: '#E8638A', color: '#fff', borderRadius: '8px', padding: '2px 8px', fontSize: '10px', fontWeight: 600 }}>⭐ {t.bestSellerBadge}</div>
                  )}
                </div>
                <div style={{ padding: '12px' }}>
                  <p style={{ fontWeight: 700, fontSize: '14px', margin: '0 0 4px', color: '#3D1A24' }}>{product.name}</p>
                  {product.description && <p style={{ color: '#bbb', fontSize: '11px', margin: '0 0 8px', lineHeight: 1.4 }}>{product.description}</p>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#E8638A', fontWeight: 700, fontSize: '16px' }}>{product.price} {t.currency}</span>
                    <button onClick={() => { addToCart(product); showToast(product.name) }} style={{ background: '#E8638A', color: '#fff', border: 'none', borderRadius: '10px', padding: '7px 16px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                      {t.addBtn}
                    </button>
                  </div>
                </div>
              </div>
              )
            })}
          </div>
        )}

      <footer style={{ background: '#E8638A', padding: '36px 20px 26px', color: '#fff', marginTop: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '26px', alignItems: 'center', textAlign: 'center' }}>

          <div>
            <img src="/images/logo.png" alt="ورد الياسمين" style={{ height: '52px', objectFit: 'contain', filter: 'brightness(0) invert(1)', marginBottom: '6px' }} />
            <p style={{ fontSize: '12px', opacity: 0.85, margin: 0 }}>{t.tagline}</p>
          </div>

          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 14px' }}>{t.contactUs}</h3>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {settings.whatsapp && (
                <a href={'https://wa.me/' + settings.whatsapp} target="_blank" rel="noopener noreferrer" style={socialBtnStyle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M17.6 6.32A8.86 8.86 0 0 0 12.05 4C7.4 4 3.62 7.76 3.62 12.41c0 1.6.45 3.1 1.23 4.38L4 20.62l3.93-1.03a8.8 8.8 0 0 0 4.13 1.05h.01c4.64 0 8.43-3.77 8.43-8.41 0-2.25-.86-4.37-2.41-5.96Z" /></svg>
                </a>
              )}
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" style={socialBtnStyle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="18" cy="6" r="1"/></svg>
                </a>
              )}
            </div>
          </div>

          {activePaymentMethods.length > 0 && (
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 14px' }}>{t.paymentMethods}</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {activePaymentMethods.map(m => (
                  <div
                    key={m.id}
                    style={{
                      background: '#fff',
                      borderRadius: '10px',
                      padding: '6px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '52px',
                      height: '36px',
                    }}
                  >
                    <img src={m.image_url} alt={m.name} style={{ height: '20px', objectFit: 'contain' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {(settings.work_open_time || settings.work_close_time) && (
            <p style={{ fontSize: '13px', opacity: 0.9, margin: 0 }}>
              ⏰ {t.workHours} {formatTime(settings.work_open_time, lang)} - {formatTime(settings.work_close_time, lang)}
            </p>
          )}

          <div style={{ width: '100%', maxWidth: '280px', height: '1px', background: 'rgba(255,255,255,0.25)' }} />

          <p style={{ fontSize: '12px', opacity: 0.75, margin: 0 }}>
            © {new Date().getFullYear()} ورد الياسمين للهدايا - {t.rights}
          </p>

        </div>
      </footer>

      </div>
    </div>
  )
}
