
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nmegscxlwywkuzrgyouh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tZWdzY3hsd3l3a3V6cmd5b3VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5NDQ0ODUsImV4cCI6MjA2MjUyMDQ4NX0.6Ce1wG2tkZ_8XpeChmuUNPSM_bl3tMgzpXfMWQ_In5o'

export const supabase = createClient(supabaseUrl, supabaseKey)
