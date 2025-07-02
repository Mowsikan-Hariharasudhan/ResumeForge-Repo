
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { plan_type, amount } = await req.json()
    
    console.log('Received plan_type:', plan_type, 'amount:', amount)
    
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('User not authenticated')
    }

    // Get Razorpay credentials
    const razorpayKeyId = 'rzp_live_RbZjUu8cORJ4Pw'
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')
    
    if (!razorpayKeySecret) {
      throw new Error('Razorpay key secret not configured')
    }

    console.log('Creating Razorpay order for amount:', amount * 100)

    // Create order with Razorpay
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Razorpay expects amount in paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}_${user.id.slice(0, 8)}`,
        notes: {
          plan_type,
          user_id: user.id,
          created_at: new Date().toISOString()
        }
      }),
    })

    if (!razorpayResponse.ok) {
      const errorText = await razorpayResponse.text()
      console.error('Razorpay API error:', errorText)
      throw new Error(`Razorpay order creation failed: ${errorText}`)
    }

    const razorpayOrder = await razorpayResponse.json()
    console.log('Razorpay order created:', razorpayOrder.id)
    
    // Calculate expiry date and downloads based on plan type
    let expires_at: Date
    let downloads_remaining: number

    switch (plan_type) {
      case 'single':
        expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        downloads_remaining = 1
        break
      case 'small':
        expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        downloads_remaining = 10
        break
      case 'unlimited':
        expires_at = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
        downloads_remaining = 999999
        break
      default:
        throw new Error(`Invalid plan type: ${plan_type}`)
    }

    // Create purchase record
    const { data: purchase, error: purchaseError } = await supabaseClient
      .from('purchases')
      .insert({
        user_id: user.id,
        plan_type,
        amount,
        currency: 'INR',
        razorpay_order_id: razorpayOrder.id,
        status: 'pending',
        downloads_remaining,
        expires_at: expires_at.toISOString(),
      })
      .select()
      .single()

    if (purchaseError) {
      console.error('Purchase creation error:', purchaseError)
      throw new Error(`Failed to create purchase: ${purchaseError.message}`)
    }

    console.log('Purchase record created:', purchase.id)

    return new Response(
      JSON.stringify({
        order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        purchase_id: purchase.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Create order error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
