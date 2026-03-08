import { createClient } from '@supabase/supabase-js';
import { verifyAuth, validateOrigin, unauthorizedResponse, forbiddenResponse } from '../middleware';

// Admin client — uses service role key to delete auth users
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    if (!validateOrigin(request)) return forbiddenResponse();

    const { user, error: authError } = await verifyAuth(request);
    if (authError || !user) return unauthorizedResponse(authError);

    // Delete the auth user — cascades everything linked to auth.users
    const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    if (error) {
      console.error('Delete user error:', error);
      return Response.json({ error: 'Failed to delete account' }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete account error:', error);
    return Response.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}