import { createClient } from '@supabase/supabase-js'

// Мы берем ключи из файла .env (который мы создавали ранее)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Создаем клиента
export const supabase = createClient(supabaseUrl, supabaseAnonKey)