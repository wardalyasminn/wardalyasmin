'use server'

import { supabaseAdmin } from '@/lib/supabase'
import { Product, Category, Settings, PaymentMethod } from '@/lib/types'
import { revalidatePath } from 'next/cache'

// ---------- PRODUCTS ----------

export async function getProductsAdmin() {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*, category:categories(*)')
    .order('sort_order')
  if (error) throw new Error(error.message)
  return data as Product[]
}

export async function createProduct(product: Partial<Product>) {
  const { category, ...cleanProduct } = product as any
  const { error } = await supabaseAdmin.from('products').insert(cleanProduct)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/')
}

export async function updateProduct(id: string, product: Partial<Product>) {
  const { category, ...cleanProduct } = product as any
  const { error } = await supabaseAdmin.from('products').update(cleanProduct).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/')
}

export async function deleteProduct(id: string) {
  const { error } = await supabaseAdmin.from('products').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/')
}

// ---------- CATEGORIES ----------

export async function getCategoriesAdmin() {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .order('sort_order')
  if (error) throw new Error(error.message)
  return data as Category[]
}

export async function createCategory(category: Partial<Category>) {
  const { error } = await supabaseAdmin.from('categories').insert(category)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/')
}

export async function updateCategory(id: string, category: Partial<Category>) {
  const { error } = await supabaseAdmin.from('categories').update(category).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/')
}

export async function deleteCategory(id: string) {
  const { error } = await supabaseAdmin.from('categories').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/')
}

// ---------- PAYMENT METHODS ----------

export async function getPaymentMethodsAdmin() {
  const { data, error } = await supabaseAdmin
    .from('payment_methods')
    .select('*')
    .order('sort_order')
  if (error) throw new Error(error.message)
  return data as PaymentMethod[]
}

export async function createPaymentMethod(method: Partial<PaymentMethod>) {
  const { error } = await supabaseAdmin.from('payment_methods').insert(method)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/')
}

export async function updatePaymentMethod(id: string, method: Partial<PaymentMethod>) {
  const { error } = await supabaseAdmin.from('payment_methods').update(method).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/')
}

export async function deletePaymentMethod(id: string) {
  const { error } = await supabaseAdmin.from('payment_methods').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/')
}

// ---------- SETTINGS ----------

export async function getSettingsAdmin() {
  const { data, error } = await supabaseAdmin.from('settings').select('*')
  if (error) throw new Error(error.message)
  const settings: Record<string, string> = {}
  data?.forEach((s) => {
    settings[s.key] = s.value
  })
  return settings
}

export async function updateSetting(key: string, value: string) {
  const { error } = await supabaseAdmin
    .from('settings')
    .upsert({ key, value }, { onConflict: 'key' })
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/')
}

export async function updateSettingsBulk(settings: Record<string, string>) {
  const rows = Object.entries(settings).map(([key, value]) => ({ key, value }))
  const { error } = await supabaseAdmin.from('settings').upsert(rows, { onConflict: 'key' })
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/')
}

// ---------- IMAGE UPLOAD ----------
// Expects a bucket called "images" to exist in Supabase Storage (public).

export async function uploadImage(formData: FormData): Promise<string> {
  const file = formData.get('file') as File
  if (!file) throw new Error('لم يتم اختيار ملف')

  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const path = `uploads/${fileName}`

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { error } = await supabaseAdmin.storage
    .from('images')
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (error) throw new Error(error.message)

  const { data } = supabaseAdmin.storage.from('images').getPublicUrl(path)
  return data.publicUrl
}