import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// كلمات مفتاحية تدل على بوتات محركات البحث أو أدوات المراقبة (Uptime monitors)
// أي User-Agent يحتوي على واحدة منها، ما تُحسب زيارته ضمن الإحصائيات
const BOT_OR_MONITOR_PATTERNS = [
  'bot',
  'crawl',
  'spider',
  'slurp',
  'uptimerobot',
  'better uptime',
  'betteruptime',
  'betterstack',
  'pingdom',
  'statuscake',
  'monitor',
  'facebookexternalhit',
  'whatsapp',
  'headlesschrome',
  'lighthouse',
  'pagespeed',
  'ahrefsbot',
  'semrushbot',
  'mj12bot',
  'preview',
]

function isBotOrMonitor(userAgent: string): boolean {
  const ua = userAgent.toLowerCase()
  if (!ua) return true // لا يوجد User-Agent إطلاقاً غالباً يعني طلب آلي مو زيارة حقيقية
  return BOT_OR_MONITOR_PATTERNS.some((pattern) => ua.includes(pattern))
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const isLoginPage = request.nextUrl.pathname === '/admin/login'
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin')

  // تسجيل الزيارة للصفحات العامة فقط (باستثناء لوحة الأدمن)
  // بطريقة fire-and-forget عشان ما يبطّئ تحميل الصفحة
  // + نستثني بوتات محركات البحث وأدوات المراقبة (UptimeRobot, BetterStack...)
  if (!isAdminPage) {
    const userAgent = request.headers.get('user-agent') || ''

    if (!isBotOrMonitor(userAgent)) {
      supabaseAdmin
        .from('site_visits')
        .insert({})
        .then(() => {})
        .catch(() => {
          // تجاهل أي خطأ حتى ما يأثر على تجربة المستخدم
        })
    }

    return response
  }

  // من هنا وطالع: منطق حماية الأدمن الأصلي، بدون أي تغيير
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (isAdminPage && !isLoginPage && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  if (isLoginPage && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  // يشمل كل الموقع الآن (لتسجيل الزيارات) ما عدا: API، ملفات Next الثابتة، والصور
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
