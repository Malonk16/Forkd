import { createClient } from '@supabase/supabase-js';

const rateLimitStore = new Map();
const RATE_LIMIT = 20;
const RATE_WINDOW = 60 * 1000;

export async function verifyAuth(request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { user: null, error: 'Missing authorization header' };
  }
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return { user: null, error: 'Invalid or expired token' };
  return { user, error: null };
}

export function checkRateLimit(userId) {
  const now = Date.now();
  const record = rateLimitStore.get(userId);
  if (!record || now - record.start > RATE_WINDOW) {
    rateLimitStore.set(userId, { start: now, count: 1 });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }
  if (record.count >= RATE_LIMIT) return { allowed: false, remaining: 0 };
  record.count++;
  return { allowed: true, remaining: RATE_LIMIT - record.count };
}

export function validateOrigin(request) {
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    'http://localhost:3000',
    'https://forkd-delta.vercel.app',
  ].filter(Boolean);
  return !origin || allowedOrigins.some(o => origin.startsWith(o));
}

export function unauthorizedResponse(message = 'Unauthorized') {
  return Response.json({ error: message }, { status: 401 });
}

export function rateLimitResponse() {
  return Response.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 });
}

export function forbiddenResponse() {
  return Response.json({ error: 'Forbidden' }, { status: 403 });
}