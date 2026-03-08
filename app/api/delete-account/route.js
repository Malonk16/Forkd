import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
      return Response.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
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