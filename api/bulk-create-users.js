import { createClient } from '@supabase/supabase-js'

export const config = { runtime: 'edge' }

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { users } = await req.json()
    // users = [{ name, email, password, role, department, year, section, roll_number, staff_id }, ...]

    const supabaseUrl = 'https://vmhoxpomaqsochxpxagl.supabase.co'
    const serviceKey = process.env.SUPABASE_SERVICE_KEY

    if (!serviceKey) {
      return new Response(JSON.stringify({ error: 'Service key missing' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    const results = []

    for (const u of users) {
      try {
        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: u.email,
          password: u.password || 'vce@2026',
          email_confirm: true
        })

        if (authError) {
          results.push({ email: u.email, status: 'failed', reason: authError.message })
          continue
        }

        // Insert profile
        const profile = {
          id: authData.user.id,
          name: u.name,
          email: u.email,
          role: u.role || 'student',
          department: u.department,
        }

        if ((u.role || 'student') === 'student') {
          profile.year = parseInt(u.year)
          profile.section = u.section
          profile.roll_number = u.roll_number
        } else {
          profile.staff_id = u.staff_id
        }

        const { error: profileError } = await supabase.from('profiles').insert(profile)

        if (profileError) {
          results.push({ email: u.email, status: 'failed', reason: profileError.message })
          continue
        }

        results.push({ email: u.email, status: 'success' })
      } catch (err) {
        results.push({ email: u.email, status: 'failed', reason: err.message })
      }
    }

    return new Response(JSON.stringify({ results }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}