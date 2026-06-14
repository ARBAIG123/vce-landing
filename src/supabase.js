import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vmhoxpomaqsochxpxagl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtaG94cG9tYXFzb2NoeHB4YWdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzMjcwMDEsImV4cCI6MjA5NjkwMzAwMX0.fke65b8HCrQ5CokUFO-avor88Bq8x6fbIFmt8LCg0Hg'

export const supabase = createClient(supabaseUrl, supabaseKey)