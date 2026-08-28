// src/supabase.js
import { createClient } from '@supabase/supabase-js';

// .env.local에 저장해둔 URL과 KEY를 불러옵니다.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Supabase 클라이언트(연결 객체)를 생성해서 내보냅니다.
export const supabase = createClient(supabaseUrl, supabaseKey);

