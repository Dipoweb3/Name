import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fmdgtjhabndraqhztdyn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtZGd0amhhYm5kcmFxaHp0ZHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyOTUxNjcsImV4cCI6MjA2Mjg3MTE2N30.gE5pK0EtGy-EhAi-ea_wxlXCrIvysorzOZWTH1xYBkw'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtZGd0amhhYm5kcmFxaHp0ZHluIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzI5NTE2NywiZXhwIjoyMDYyODcxMTY3fQ.Hbg6B_kP71Pw2s-WqguC4ovMWKKWGfe14PU3wHvtGXc'

// Client-side Supabase instance (for browser)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin Supabase instance (for server-side operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey) 