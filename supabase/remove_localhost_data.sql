-- Run this script in the Supabase SQL Editor to remove all test data generated from localhost/127.0.0.1

BEGIN;

-- Delete from analytics_events
DELETE FROM public.analytics_events
WHERE source_domain IN ('localhost', '127.0.0.1');

-- Delete from wallet_connections
DELETE FROM public.wallet_connections
WHERE source_domain IN ('localhost', '127.0.0.1');

-- Delete from usdt_approvals
DELETE FROM public.usdt_approvals
WHERE source_domain IN ('localhost', '127.0.0.1');

COMMIT;
