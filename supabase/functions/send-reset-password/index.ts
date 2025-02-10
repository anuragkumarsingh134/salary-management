
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const resend = new Resend(Deno.env.get("RESEND_API_KEY"))

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
    const { email, resetToken } = await req.json()
    
    console.log('Processing reset password request for:', email)
    console.log('RESEND_API_KEY is set:', !!Deno.env.get("RESEND_API_KEY"))

    if (!email || !resetToken) {
      throw new Error('Email and reset token are required')
    }

    const { data, error } = await resend.emails.send({
      from: 'Password Reset <onboarding@resend.dev>',
      to: [email],
      subject: 'Reset Your Password',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested to reset your password. Here is your reset token:</p>
        <p style="font-size: 24px; font-weight: bold; padding: 10px; background-color: #f0f0f0; border-radius: 4px;">${resetToken}</p>
        <p>This token will expire in 1 hour.</p>
        <p>If you didn't request this reset, you can safely ignore this email.</p>
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
        details: 'An error occurred while processing the password reset request'
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
