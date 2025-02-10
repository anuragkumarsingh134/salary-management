
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const resend = new Resend(Deno.env.get("RESEND_API_KEY"))

// Update CORS headers to be more permissive
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  console.log('Received request:', req.method);
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, {
      headers: corsHeaders,
      status: 204
    });
  }

  try {
    const requestBody = await req.text();
    console.log('Raw request body:', requestBody);
    
    const { email, resetToken } = JSON.parse(requestBody);
    
    console.log('Processing reset password request for:', email);
    console.log('RESEND_API_KEY is set:', !!Deno.env.get("RESEND_API_KEY"));
    console.log('Parsed request body:', { email, resetToken: resetToken ? '[REDACTED]' : undefined });

    if (!email || !resetToken) {
      throw new Error('Email and reset token are required');
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
    });

    if (error) {
      console.error('Error sending email:', error);
      throw error;
    }

    console.log('Email sent successfully:', data);

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error in send-reset-password function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack,
        details: 'An error occurred while processing the password reset request'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
})
