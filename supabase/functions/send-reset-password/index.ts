
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const resend = new Resend(Deno.env.get("RESEND_API_KEY"))
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const supabase = createClient(supabaseUrl!, supabaseKey!)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        ...corsHeaders,
      },
      status: 204,
    })
  }

  try {
    const { email } = await req.json()
    
    console.log('Processing password reminder request for:', email)
    console.log('RESEND_API_KEY is set:', !!Deno.env.get("RESEND_API_KEY"))

    if (!email) {
      throw new Error('Email is required')
    }

    // Get the user's current password from user_settings
    const { data: settings, error: fetchError } = await supabase
      .from('user_settings')
      .select('show_data_password')
      .eq('recovery_email', email)
      .single()

    if (fetchError || !settings?.show_data_password) {
      throw new Error('No password found for this email')
    }

    const { data, error } = await resend.emails.send({
      from: 'Password Reminder <onboarding@resend.dev>',
      to: [email],
      subject: 'Your Show Data Password',
      html: `
        <h1>Your Password Reminder</h1>
        <p>You requested your show data password. Here it is:</p>
        <p style="font-size: 24px; font-weight: bold; padding: 10px; background-color: #f0f0f0; border-radius: 4px;">${settings.show_data_password}</p>
        <p>Please keep this password safe.</p>
        <p>If you didn't request this reminder, you can safely ignore this email.</p>
      `
    })

    if (error) {
      console.error('Error sending email:', error)
      throw error
    }

    console.log('Email sent successfully:', data)

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in send-reset-password function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'An error occurred while processing the password reminder request'
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
        status: 500,
      }
    )
  }
})
