export interface Category {
  id: string
  name: string
  name_en?: string
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface Product {
  id: string
  name: string
  name_en?: string
  description?: string
  price: number
  discount_price?: number
  image_url?: string
  // JSON.stringify(string[]) لمصفوفة روابط صور إضافية للمنتج (Gallery)
  // أول صورة بالمصفوفة تُستخدم أيضًا كنسخة من image_url (صورة الغلاف)
  images_json?: string
  category_id?: string
  category?: Category
  is_available: boolean
  is_featured: boolean
  is_new?: boolean
  sort_order: number
  created_at: string
  // رمز المنتج (SKU) — تجهيز لربط أنظمة الكاشير السحابية مستقبلاً
  sku?: string
  // الكمية المتوفرة بالمخزون
  stock_quantity?: number
}
export interface Order {
  id: string
  customer_name: string
  customer_phone: string
  delivery_type: 'pickup' | 'delivery'
  address?: string
  // رابط اختياري لموقع العميل على قوقل ماب
  location_url?: string
  total: number
  delivery_fee: number
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
  notes?: string
  created_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id?: string
  product_name: string
  price: number
  quantity: number
}

export interface PaymentMethod {
  id: string
  name: string
  image_url: string
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface Coupon {
  id: string
  code: string
  discount_percent: number
  is_active: boolean
}

export interface Settings {
  delivery_fee: string
  min_order: string
  whatsapp: string
  store_open: string
  work_open_time: string
  work_close_time: string
  logo_url?: string
  instagram_url?: string
  twitter_url?: string
  snapchat_url?: string
  tiktok_url?: string
  // إشعار أوقات العمل (الشريط العلوي)
  working_hours?: string
  // ---------- إعدادات الفوتر ----------
  contact_email?: string
  commercial_register?: string
  // رابط أو نص توثيق "موثوق" من منصة أعمال
  maroof_badge_url?: string
  // نص حقوق النشر أسفل الفوتر (قابل للتعديل بالكامل من الأدمن)
  footer_copyright_text?: string
  // النص الترويجي أعلى الفوتر (قابل للتعديل من الأدمن)
  footer_desc_text?: string
  // رابط الدفع / الحساب البنكي بالفوتر
  payment_link_label?: string
  payment_link_url?: string
  // JSON.stringify(HeroSlide[]) - يُقرأ ويُكتب من صفحة /admin/content
  hero_slides_json?: string
  // JSON.stringify(PromoCard[]) - يُقرأ ويُكتب من صفحة /admin/content
  promo_cards_json?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

// ---------- محتوى الواجهة الرئيسية (هيرو + بطاقات ترويجية) ----------

export interface HeroSlide {
  image_url: string
  title: string
  subtitle: string
  desc: string
}

export interface PromoCard {
  image_url: string
  title: string
  btn_text: string
  btn_color: string
  // فارغ أو 'all' = يفتح كل المنتجات، أو id تصنيف محدد
  category_id: string
}
