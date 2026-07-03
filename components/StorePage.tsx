'use client'

import { useState, type ReactNode } from 'react'
import { Product, Category, Settings, CartItem, PaymentMethod } from '@/lib/types'

interface Props {
  products: Product[]
  categories: Category[]
  settings: Settings
  paymentMethods: PaymentMethod[]
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
    accountTitle: 'حسابي',
    accountDesc: 'تسجيل الدخول وإنشاء حساب سيتوفر قريباً، تابعينا لمعرفة كل جديد 🌸',
    accountClose: 'حسناً',
    heroSlides: [
      { title: 'لحظاتك تستحق', subtitle: 'هدايا تليق بها', desc: 'تشكيلة فاخرة من الهدايا والورد', bg: '#FDF0F3' },
      { title: 'أجمل الهدايا', subtitle: 'بلمسة من القلب', desc: 'توصيل سريع لجميع أحياء بريدة', bg: '#FDF5F0' },
      { title: 'مناسباتك الخاصة', subtitle: 'نجعلها لا تُنسى', desc: 'تصاميم حصرية وراقية', bg: '#FDF0F8' },
    ],
    promoCards: [
      { bg: '#FDE8EF', title: 'هدايا تجعلهم يبتسمون', btnColor: '#E8638A', btnText: 'تسوق الهدايا', emoji: '🌹' },
      { bg: '#FDF0F8', title: 'توصيل سريع في نفس اليوم', btnColor: '#E8638A', btnText: 'اطلب الآن', emoji: '🚚' },
      { bg: '#F5F0E8', title: 'تنسيقات ورد فاخرة', btnColor: '#C8956C', btnText: 'تسوق الآن', emoji: '🌷' },
    ],
    waOrderTitle: 'طلب جديد من ورد الياسمين 🌸',
    waTotal: 'المجموع',
    waDelivery: 'التوصيل',
    waGrandTotal: 'الإجمالي',
    waPickupType: 'نوع الاستلام',
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
    accountTitle: 'My Account',
    accountDesc: 'Sign in and account creation are coming soon. Stay tuned! 🌸',
    accountClose: 'Got it',
    heroSlides: [
      { title: 'Your moments deserve', subtitle: 'gifts worthy of them', desc: 'A luxury collection of gifts and flowers', bg: '#FDF0F3' },
      { title: 'The most beautiful gifts', subtitle: 'with a touch from the heart', desc: 'Fast delivery to all areas of Buraidah', bg: '#FDF5F0' },
      { title: 'Your special occasions', subtitle: 'made unforgettable', desc: 'Exclusive and elegant designs', bg: '#FDF0F8' },
    ],
    promoCards: [
      { bg: '#FDE8EF', title: 'Gifts that make them smile', btnColor: '#E8638A', btnText: 'Shop gifts', emoji: '🌹' },
      { bg: '#FDF0F8', title: 'Fast delivery same day', btnColor: '#E8638A', btnText: 'Order now', emoji: '🚚' },
      { bg: '#F5F0E8', title: 'Luxury flower arrangements', btnColor: '#C8956C', btnText: 'Shop now', emoji: '🌷' },
    ],
    waOrderTitle: 'New order from Ward Al Yasmine 🌸',
    waTotal: 'Subtotal',
    waDelivery: 'Delivery',
    waGrandTotal: 'Total',
    waPickupType: 'Pickup type',
  },
}

export default function StorePage({ products, categories, settings, paymentMethods }: Props) {
  const [lang, setLang] = useState<Lang>('ar')
  const t = translations[lang]

  const logoSrc = settings.logo_url || '/images/logo.png'

  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showCart, setShowCart] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showAccount, setShowAccount] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup')
  const [heroSlide, setHeroSlide] = useState(0)
  const [toast, setToast] = useState<string | null>(null)
  const [activeImageByProduct, setActiveImageByProduct] = useState<Record<string, number>>({})

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

  // محتوى الهيرو والبطاقات: من قاعدة البيانات (لوحة الأدمن) إن وجد، وإلا القيم الافتراضية المترجمة
  const adminHeroSlides = safeParseArray(settings.hero_slides_json)
  const adminPromoCards = safeParseArray(settings.promo_cards_json)
  const heroSlides: any[] = adminHeroSlides || t.heroSlides
  const promoCards: any[] = adminPromoCards || t.promoCards

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

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const deliveryFee = deliveryType === 'delivery' ? Number(settings.delivery_fee) : 0
  const total = subtotal + deliveryFee

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
    const msg = t.waOrderTitle + '\n\n' + items + '\n\n' + t.waTotal + ': ' + subtotal + ' ' + t.currency + '\n' + t.waDelivery + ': ' + deliveryFee + ' ' + t.currency + '\n' + t.waGrandTotal + ': ' + total + ' ' + t.currency + '\n' + t.waPickupType + ': ' + deliveryLabel
    const waUrl = 'https://wa.me/' + settings.whatsapp + '?text=' + encodeURIComponent(msg)
    window.open(waUrl)
  }

  const iconProps = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const catIconsSvg: Record<string, ReactNode> = {
    'تنسيقات ورد': (
      <svg {...iconProps}><path d="M12 3c1.8 0 3 1.4 3 3 0 1.8-1.4 3-3 5-1.6-2-3-3.2-3-5 0-1.6 1.2-3 3-3z"/><path d="M12 11v9"/><path d="M8.5 8.5c-1.6-.6-3 .2-3.2 1.6-.2 1.4 1 2.4 2.6 2.1"/><path d="M15.5 8.5c1.6-.6 3 .2 3.2 1.6.2 1.4-1 2.4-2.6 2.1"/><path d="M9 20h6"/></svg>
    ),
    'هدايا جاهزة': (
      <svg {...iconProps}><rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M4 9h16v3.5H4z"/><path d="M12 9v11"/><path d="M12 9c-1.2-3-3.4-4.5-4.8-3.3-1.2 1-.4 2.8 1.3 3.3H12z"/><path d="M12 9c1.2-3 3.4-4.5 4.8-3.3 1.2 1 .4 2.8-1.3 3.3H12z"/></svg>
    ),
    'عطور': (
      <svg {...iconProps}><path d="M9.5 3h5"/><path d="M11 3v3"/><path d="M13 3v3"/><path d="M8.5 8h7l1 3v9a1.5 1.5 0 0 1-1.5 1.5h-6A1.5 1.5 0 0 1 7.5 20v-9l1-3z"/><path d="M12 14.5c0-1 1.6-1 1.6-2.2 0-.7-.6-1.1-1.6-1.1s-1.6.4-1.6 1.1c0 1.2 1.6 1.2 1.6 2.2z" fill="currentColor" stroke="none"/></svg>
    ),
    'نباتات داخلية': (
      <svg {...iconProps}><path d="M7 21h10"/><path d="M9 21c-1-4 0-8 3-10 3 2 4 6 3 10"/><path d="M12 11c-3-1-4.5-3.5-4-6.5 3-.5 5.5 1 6.5 4"/><path d="M12 11c2.5-1.5 3.5-4 3-6.5-3-.5-5 1-6 3.2"/></svg>
    ),
    'مناسبات': (
      <svg {...iconProps}><circle cx="8.5" cy="7.5" r="3"/><circle cx="16" cy="6.5" r="2.6"/><path d="M8.5 10.5 7 20"/><path d="M16 9.1 14.8 19"/><path d="M7 20h1.5"/><path d="M14.5 19H16"/></svg>
    ),
    'الكل': (
      <svg {...iconProps}><rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.8"/><rect x="13" y="3.5" width="7.5" height="7.5" rx="1.8"/><rect x="3.5" y="13" width="7.5" height="7.5" rx="1.8"/><rect x="13" y="13" width="7.5" height="7.5" rx="1.8"/></svg>
    ),
  }
  const allCategoriesIcon = catIconsSvg['الكل']

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
          <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: '#3D1A24', color: '#fff', padding: '10px 20px', borderRadius: '20px', fontSize: '13px', zIndex: 999, boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }}>
            {toast}
          </div>
        )}

        <div style={{ background: '#FDEEE6', color: '#3D1A24', fontSize: '11px', padding: '8px 16px', display: 'flex', justifyContent: 'space-between' }}>
          <span>🚚 {t.deliveryBar}</span>
          <span>🎧 {t.supportBar}</span>
        </div>

        <header style={{ background: '#fff', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F5E8EC', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <button onClick={() => setShowSidebar(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#3D1A24', lineHeight: 1, position: 'relative', zIndex: 2 }}>☰</button>
            <button onClick={() => setShowSearch(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#3D1A24', position: 'relative', zIndex: 2 }}>🔍</button>
            <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} style={{ background: 'none', border: '1px solid #F5E8EC', borderRadius: '12px', cursor: 'pointer', fontSize: '11px', fontWeight: 700, color: '#3D1A24', padding: '4px 8px', fontFamily: 'Tajawal, sans-serif', position: 'relative', zIndex: 2 }}>
              🌐 {lang === 'ar' ? 'EN' : 'AR'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
            <img src={logoSrc} alt="ورد الياسمين" style={{ height: '46px', objectFit: 'contain', marginBottom: '2px' }} />
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#3D1A24', lineHeight: 1.15, whiteSpace: 'nowrap' }}>ورد الياسمين للهدايا</span>
            <span style={{ fontSize: '9px', fontWeight: 700, color: '#C8956C', letterSpacing: '1.5px', lineHeight: 1.4 }}>JASMINE &amp; WARD</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '1px', background: '#C8956C', opacity: 0.6 }} />
              <span style={{ fontSize: '8px', color: '#C8956C', letterSpacing: '2px' }}>GIFT SHOP</span>
              <span style={{ width: '10px', height: '1px', background: '#C8956C', opacity: 0.6 }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <button onClick={() => setShowAccount(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '17px', color: '#3D1A24', position: 'relative', zIndex: 2 }}>👤</button>
            <button onClick={() => setShowCart(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', fontSize: '17px', color: '#3D1A24', zIndex: 2 }}>
              🛍️
              {totalItems > 0 && (
                <span style={{ position: 'absolute', top: '-7px', right: '-9px', background: '#E8975A', color: '#fff', borderRadius: '50%', width: '17px', height: '17px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{totalItems}</span>
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
                  <div key={product.id} onClick={() => { addToCart(product); setShowSearch(false); setSearchQuery(''); showToast(product.name) }} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px', cursor: 'pointer', borderRadius: '10px' }}>
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

        {showAccount && (
          <>
            <div onClick={() => setShowAccount(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: '20px', padding: '28px 24px', width: '100%', maxWidth: '320px', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.25)' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#FDE8EF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: '28px' }}>👤</div>
                <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: '#3D1A24' }}>{t.accountTitle}</h3>
                <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#888', lineHeight: 1.6 }}>{t.accountDesc}</p>
                <button onClick={() => setShowAccount(false)} style={{ width: '100%', background: '#E8638A', color: '#fff', border: 'none', borderRadius: '14px', padding: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}>{t.accountClose}</button>
              </div>
            </div>
          </>
        )}

        {showSidebar && (
          <>
            <div onClick={() => setShowSidebar(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300 }} />
            <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: '240px', background: '#fff', zIndex: 400, boxShadow: '4px 0 20px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: '#E8638A', padding: '30px 20px 20px', textAlign: 'center' }}>
                <img src={logoSrc} alt="ورد الياسمين" style={{ height: '70px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
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
                    else if (item.label === t.sidebarAccount) { setShowSidebar(false); setShowAccount(true) }
                    else setShowSidebar(false)
                  }} style={{ width: '100%', background: 'none', border: 'none', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', fontSize: '15px', color: '#3D1A24', borderBottom: '1px solid #FDF0F3', fontFamily: 'Tajawal, sans-serif' }}>
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
                          <button onClick={() => updateQuantity(item.product.id, -1)} style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid #eee', background: '#fff', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
                          <span style={{ fontSize: '13px', minWidth: '16px', textAlign: 'center' }}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, 1)} style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid #eee', background: '#fff', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
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
                    <button onClick={() => setDeliveryType('pickup')} style={{ flex: 1, padding: '8px', borderRadius: '10px', border: deliveryType === 'pickup' ? '2px solid #E8638A' : '1px solid #eee', background: deliveryType === 'pickup' ? '#FDE8EF' : '#fff', color: deliveryType === 'pickup' ? '#E8638A' : '#666', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}>{t.pickup}</button>
                    <button onClick={() => setDeliveryType('delivery')} style={{ flex: 1, padding: '8px', borderRadius: '10px', border: deliveryType === 'delivery' ? '2px solid #E8638A' : '1px solid #eee', background: deliveryType === 'delivery' ? '#FDE8EF' : '#fff', color: deliveryType === 'delivery' ? '#E8638A' : '#666', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}>{t.delivery}</button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666' }}>
                    <span>{t.subtotal}</span><span>{subtotal} {t.currency}</span>
                  </div>
                  {deliveryType === 'delivery' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666' }}>
                      <span>{t.deliveryFeeLabel}</span><span>{deliveryFee} {t.currency}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 700, color: '#3D1A24' }}>
                    <span>{t.total}</span><span>{total} {t.currency}</span>
                  </div>

                  <button onClick={sendWhatsApp} style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: '14px', padding: '13px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {t.checkoutWhatsapp}
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* ===== الهيرو: صورة بخلفية كاملة مع تدرّج شفاف والنص على الجهة المقابلة، مطابق للريفرنس ===== */}
        <div className="hero" style={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: '300px',
        }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            {currentSlide.image_url ? (
              <img
                src={currentSlide.image_url}
                alt={currentSlide.title || ''}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', background: currentSlide.bg || '#FDF0F3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '70px', opacity: 0.15 }}>🌸</div>
            )}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: lang === 'ar'
                ? 'linear-gradient(to left, rgba(253,240,243,0.05) 0%, rgba(253,240,243,0.88) 52%, rgba(253,240,243,0.98) 100%)'
                : 'linear-gradient(to right, rgba(253,240,243,0.05) 0%, rgba(253,240,243,0.88) 52%, rgba(253,240,243,0.98) 100%)',
            }} />
          </div>

          <div style={{
            position: 'relative',
            zIndex: 2,
            minHeight: '300px',
            display: 'flex',
            alignItems: 'center',
            padding: '26px 20px 46px',
          }}>
            <div style={{
              maxWidth: '78%',
              marginLeft: lang === 'ar' ? 'auto' : 0,
              marginRight: lang === 'ar' ? 0 : 'auto',
              textAlign: lang === 'ar' ? 'right' : 'left',
            }}>
              <h1 style={{ color: '#3D1A24', fontSize: '22px', fontWeight: 700, margin: '0 0 4px', lineHeight: 1.35 }}>{currentSlide.title}</h1>
              <h2 style={{ color: '#E8638A', fontSize: '18px', fontWeight: 700, margin: '0 0 10px' }}>{currentSlide.subtitle}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', justifyContent: lang === 'ar' ? 'flex-end' : 'flex-start' }}>
                <div style={{ width: '28px', height: '1px', background: '#C8956C' }} />
                <span style={{ color: '#C8956C', fontSize: '12px' }}>✿</span>
                <div style={{ width: '28px', height: '1px', background: '#C8956C' }} />
              </div>
              <p style={{ color: '#8a7a7d', fontSize: '13px', margin: '0 0 18px', lineHeight: 1.6 }}>{currentSlide.desc}</p>
              <button onClick={() => { setSelectedCategory('all'); scrollToProducts() }} style={{ background: '#E8638A', color: '#fff', border: 'none', borderRadius: '25px', padding: '11px 24px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif', boxShadow: '0 4px 15px rgba(232,99,138,0.3)' }}>{t.shopNow}</button>
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: '14px', left: '50%', transform: 'translateX(-50%)', display: 'flex', justifyContent: 'center', gap: '6px', zIndex: 3 }}>
            {heroSlides.map((_, i) => (
              <button key={i} onClick={() => setHeroSlide(i)} style={{ width: i === heroSlide ? '20px' : '8px', height: '8px', borderRadius: '4px', background: i === heroSlide ? '#E8638A' : 'rgba(61,26,36,0.25)', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} />
            ))}
          </div>
        </div>
        {/* ===== نهاية قسم الهيرو ===== */}

        <div style={{ padding: '20px 16px', background: '#fff', borderBottom: '1px solid #F5E8EC' }}>
          <div className="categories-row" style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
            <div onClick={() => { setSelectedCategory('all'); scrollToProducts() }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', minWidth: '68px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: selectedCategory === 'all' ? '#FDE8EF' : '#FAF6F2', border: '1px solid ' + (selectedCategory === 'all' ? '#E8638A' : '#EDE2DC'), display: 'flex', alignItems: 'center', justifyContent: 'center', color: selectedCategory === 'all' ? '#E8638A' : '#C8956C', transition: 'all 0.2s' }}>{allCategoriesIcon}</div>
              <span style={{ fontSize: '11.5px', color: selectedCategory === 'all' ? '#E8638A' : '#3D1A24', whiteSpace: 'nowrap', fontWeight: selectedCategory === 'all' ? 700 : 500 }}>{t.allCategories}</span>
            </div>
            {categories.map(cat => (
              <div key={cat.id} onClick={() => { setSelectedCategory(cat.id); scrollToProducts() }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', minWidth: '68px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: selectedCategory === cat.id ? '#FDE8EF' : '#FAF6F2', border: '1px solid ' + (selectedCategory === cat.id ? '#E8638A' : '#EDE2DC'), display: 'flex', alignItems: 'center', justifyContent: 'center', color: selectedCategory === cat.id ? '#E8638A' : '#C8956C', transition: 'all 0.2s' }}>{catIconsSvg[cat.name] || allCategoriesIcon}</div>
                <span style={{ fontSize: '11.5px', color: selectedCategory === cat.id ? '#E8638A' : '#3D1A24', whiteSpace: 'nowrap', fontWeight: selectedCategory === cat.id ? 700 : 500 }}>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="promo-grid" style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          {promoCards.map((card, i) => {
            const btnText = card.btn_text || card.btnText || t.shopNow
            const btnColor = card.btn_color || card.btnColor || '#E8638A'
            const targetCategory = card.category_id || 'all'
            return (
              <div key={i} style={{
                background: card.bg || '#FDE8EF',
                borderRadius: '14px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '150px',
              }}>
                <div style={{ padding: '12px 10px 10px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <p style={{ color: '#3D1A24', fontWeight: 700, fontSize: '12px', margin: 0, lineHeight: 1.4 }}>{card.title}</p>
                  <button onClick={() => { setSelectedCategory(targetCategory); scrollToProducts() }} style={{ background: btnColor, color: '#fff', border: 'none', borderRadius: '12px', padding: '5px 10px', fontSize: '10.5px', cursor: 'pointer', fontFamily: 'Tajawal, sans-serif', fontWeight: 600, alignSelf: 'flex-start', marginTop: '8px' }}>{btnText}</button>
                </div>
                <div style={{ width: '100%', height: '64px', position: 'relative', overflow: 'hidden' }}>
                  {card.image_url ? (
                    <img src={card.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'rgba(61,26,36,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>{card.emoji || '🎁'}</div>
                  )}
                </div>
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
                        style={{ position: 'absolute', top: '50%', right: '6px', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '12px', color: '#3D1A24', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}
                      >
                        ‹
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setActiveImage(product.id, (activeIndex + 1) % productImages.length) }}
                        style={{ position: 'absolute', top: '50%', left: '6px', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '12px', color: '#3D1A24', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}
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

                  <button onClick={() => toggleWishlist(product.id)} style={{ position: 'absolute', top: '8px', right: '8px', background: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', fontSize: '15px' }}>
                    {wishlist.includes(product.id) ? '❤️' : '🤍'}
                  </button>
                  {product.is_featured && (
                    <div style={{ position: 'absolute', top: '8px', left: '8px', background: '#E8638A', color: '#fff', borderRadius: '8px', padding: '2px 8px', fontSize: '10px', fontWeight: 600 }}>{t.bestSellerBadge}</div>
                  )}
                </div>
                <div style={{ padding: '12px' }}>
                  <p style={{ fontWeight: 700, fontSize: '14px', margin: '0 0 4px', color: '#3D1A24' }}>{product.name}</p>
                  {product.description && <p style={{ color: '#bbb', fontSize: '11px', margin: '0 0 8px', lineHeight: 1.4 }}>{product.description}</p>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#E8638A', fontWeight: 700, fontSize: '16px' }}>{product.price} {t.currency}</span>
                    <button onClick={() => { addToCart(product); showToast(product.name) }} style={{ background: '#E8638A', color: '#fff', border: 'none', borderRadius: '10px', padding: '7px 16px', cursor: 'pointer', fontFamily: 'Tajawal, sans-serif', fontSize: '13px', fontWeight: 600, boxShadow: '0 2px 8px rgba(232,99,138,0.25)' }}>{t.addBtn}</button>
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
            <img src={logoSrc} alt="ورد الياسمين" style={{ height: '52px', objectFit: 'contain', filter: 'brightness(0) invert(1)', marginBottom: '6px' }} />
            <p style={{ fontSize: '12px', opacity: 0.85, margin: 0 }}>{t.tagline}</p>
          </div>

          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 14px' }}>{t.contactUs}</h3>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {settings.whatsapp && (
                <a href={'https://wa.me/' + settings.whatsapp} target="_blank" rel="noopener noreferrer" style={socialBtnStyle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M17.6 6.32A8.86 8.86 0 0 0 12.05 4C7.4 4 3.62 7.76 3.62 12.41c0 1.6.45 3.1 1.23 4.38L4 20.62l3.93-1.03a8.8 8.8 0 0 0 4.13 1.04h.01c4.64 0 8.42-3.76 8.42-8.41a8.36 8.36 0 0 0-2.89-5.9zm-5.55 12.94h-.01a7 7 0 0 1-3.57-.98l-.26-.15-2.65.69.71-2.58-.17-.27a6.94 6.94 0 0 1-1.07-3.7c0-3.85 3.14-6.98 7-6.98a6.96 6.96 0 0 1 6.98 6.99c0 3.85-3.14 6.98-6.96 6.98zm3.83-5.23c-.21-.1-1.24-.61-1.43-.68-.19-.07-.33-.1-.47.1-.14.21-.54.68-.66.82-.12.14-.24.15-.45.05-.21-.1-.87-.32-1.66-1.03-.61-.55-1.03-1.22-1.15-1.43-.12-.21-.01-.32.1-.43.1-.1.21-.24.32-.36.1-.12.14-.21.21-.34.07-.14.04-.26-.02-.36-.06-.1-.49-1.18-.67-1.61-.18-.43-.36-.37-.5-.38h-.42c-.14 0-.36.05-.55.27-.19.21-.74.72-.74 1.76 0 1.04.76 2.04.87 2.18.1.14 1.43 2.18 3.46 2.97 1.72.68 2.07.55 2.45.51.38-.03 1.24-.51 1.41-1 .17-.49.17-.92.12-1-.05-.1-.21-.16-.42-.26z"/></svg>
                </a>
              )}
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" style={socialBtnStyle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="#fff" stroke="none"/></svg>
                </a>
              )}
              {settings.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" style={socialBtnStyle}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M18.9 2H22l-7.6 8.7L23 22h-7.1l-5.6-7.1L4 22H1l8.2-9.4L1 2h7.2l5 6.5L18.9 2zm-2.5 18h1.9L7.7 4H5.6l10.8 16z"/></svg>
                </a>
              )}
              {settings.snapchat_url && (
                <a href={settings.snapchat_url} target="_blank" rel="noopener noreferrer" style={socialBtnStyle}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M12 2c2.7 0 4.6 2.1 4.6 4.7 0 .9-.05 1.7-.1 2.3.5.3 1.1.5 1.7.5.4 0 .6.3.5.7-.2.6-.9 1-1.6 1.3.1.4.5.7.9 1 .3.2.2.6-.1.7-.5.2-1 .3-1.3.5-.1.3 0 .7-.2 1-.3.5-1 .6-1.7.6-.6 0-1.1.4-1.9.9-.6.4-1.2.6-1.8.6s-1.2-.2-1.8-.6c-.8-.5-1.3-.9-1.9-.9-.7 0-1.4-.1-1.7-.6-.2-.3-.1-.7-.2-1-.3-.2-.8-.3-1.3-.5-.3-.1-.4-.5-.1-.7.4-.3.8-.6.9-1-.7-.3-1.4-.7-1.6-1.3-.1-.4.1-.7.5-.7.6 0 1.2-.2 1.7-.5-.05-.6-.1-1.4-.1-2.3C7.4 4.1 9.3 2 12 2z"/></svg>
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
