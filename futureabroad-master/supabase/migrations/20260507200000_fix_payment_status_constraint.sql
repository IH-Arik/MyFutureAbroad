-- Fix: payment_status CHECK constraint is missing 'cancelled' value.
-- The cancel order endpoint tries to set payment_status='cancelled' but
-- the constraint only allows ('pending','paid','failed','refunded').
-- This causes a silent database constraint violation → 500 error.

ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_payment_status_check;

ALTER TABLE public.orders
  ADD CONSTRAINT orders_payment_status_check
  CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'cancelled'));
