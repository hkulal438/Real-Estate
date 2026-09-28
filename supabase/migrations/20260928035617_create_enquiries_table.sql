/*
# Create enquiries table (single-tenant, no auth)

1. New Tables
- `enquiries`
  - `id` (uuid, primary key)
  - `name` (text, not null) — full name of the enquirer
  - `email` (text, not null) — contact email
  - `phone` (text, not null) — contact phone number
  - `unit_type` (text, not null) — which residence type they're interested in
  - `message` (text) — optional message from the enquirer
  - `created_at` (timestamptz, default now)

2. Security
- Enable RLS on `enquiries`.
- Allow anon + authenticated INSERT only (public enquiry form, no sign-in).
- No SELECT/UPDATE/DELETE from the client — only the server-side service role can read enquiries.

3. Notes
- This is a single-tenant landing page with no sign-in screen, so the anon key
  must be able to insert. We intentionally do NOT add a SELECT policy so
  enquiry data is never exposed to the public client.
*/

CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  unit_type text NOT NULL,
  message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Allow public insert (anon + authenticated)
DROP POLICY IF EXISTS "anon_insert_enquiries" ON enquiries;
CREATE POLICY "anon_insert_enquiries" ON enquiries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- No SELECT/UPDATE/DELETE policies: only the service role (bypasses RLS) can read.
