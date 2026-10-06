// Tiny Supabase REST helper (no extra npm package needed).
// Add your keys in a file named .env (see .env.example). Restart `npm run dev` after editing.
// The ANON key is safe in the browser ONLY because Row Level Security is enabled
// in database/schema.sql. Never put the service_role key in this project's frontend code.

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseReady = Boolean(url && key);

export async function saveContactMessage({ name, email, message }) {
  const res = await fetch(`${url}/rest/v1/contact_messages`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ name, email, message }),
  });
  if (!res.ok) throw new Error(`Could not save message (${res.status})`);
}
