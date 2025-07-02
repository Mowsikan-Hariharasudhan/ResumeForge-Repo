
-- First, let's see what the current constraint allows and update it
-- We need to allow the new plan types: 'single', 'small', 'unlimited'
ALTER TABLE public.purchases 
DROP CONSTRAINT IF EXISTS purchases_plan_type_check;

-- Add new constraint that allows our updated plan types
ALTER TABLE public.purchases 
ADD CONSTRAINT purchases_plan_type_check 
CHECK (plan_type IN ('single', 'small', 'unlimited', 'professional'));

-- Update any existing records that might have old plan types
UPDATE public.purchases 
SET plan_type = CASE 
  WHEN plan_type = 'basic' THEN 'single'
  WHEN plan_type = 'premium' THEN 'small'
  ELSE plan_type
END
WHERE plan_type NOT IN ('single', 'small', 'unlimited', 'professional');
