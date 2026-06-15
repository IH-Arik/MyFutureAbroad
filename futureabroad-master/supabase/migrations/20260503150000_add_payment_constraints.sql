-- Add payment integrity constraints
-- Ensures stripe_payment_intent_id is populated when payment is completed

-- Add constraint: if payment_status is 'paid', stripe_payment_intent_id must not be null
ALTER TABLE public.orders
ADD CONSTRAINT orders_paid_intent_check
CHECK ((payment_status != 'paid') OR (stripe_payment_intent_id IS NOT NULL))
NOT VALID;

-- Validate the constraint
ALTER TABLE public.orders VALIDATE CONSTRAINT orders_paid_intent_check;

-- Add constraint: amount must be positive when present
ALTER TABLE public.orders
ADD CONSTRAINT orders_amount_check
CHECK ((amount IS NULL) OR (amount > 0))
NOT VALID;

ALTER TABLE public.orders VALIDATE CONSTRAINT orders_amount_check;
