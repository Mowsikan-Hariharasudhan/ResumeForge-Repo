
-- Check and fix RLS policies for purchases table
-- First, let's ensure proper RLS policies exist

-- Drop existing policies if they exist and recreate them properly
DROP POLICY IF EXISTS "Users can view their own purchases" ON public.purchases;
DROP POLICY IF EXISTS "Users can create their own purchases" ON public.purchases;
DROP POLICY IF EXISTS "Users can update their own purchases" ON public.purchases;

-- Create proper RLS policies for purchases
CREATE POLICY "Users can view their own purchases" 
  ON public.purchases 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own purchases" 
  ON public.purchases 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- IMPORTANT: Add UPDATE policy for payment verification
CREATE POLICY "Users can update their own purchases" 
  ON public.purchases 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add an index to improve query performance for payment verification
CREATE INDEX IF NOT EXISTS idx_purchases_payment_lookup 
  ON public.purchases (id, user_id, status);

-- Add an index for razorpay payment lookups
CREATE INDEX IF NOT EXISTS idx_purchases_razorpay 
  ON public.purchases (razorpay_payment_id, razorpay_order_id);
