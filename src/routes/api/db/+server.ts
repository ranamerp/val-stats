//TODO: make this the go-to place for supabase. Use this code as a baseline and build on it so all queries are server-side

import type { SupabaseClient, User } from '@supabase/supabase-js';
import { error, json } from '@sveltejs/kit';


export async function GET({ url, locals }) {
  const supabase: SupabaseClient = locals.supabase;
  const user: User | null = locals.user;

  if (!user) {
    return error(400, 'User is currently not found!');
  } 

  const action = url.searchParams.get('action');
  const userid = url.searchParams.get('userid');

  switch (action) {
    case 'getUserStats':
      return await getUserStats(userid, supabase);
    case 'getCurrentMatch':
      return await getCurrentMatch(userid, supabase);
    case 'getPresets':
      return await getPresets(user.id, supabase)
    default:
      return error(400, 'Invalid action');
  }
}

export async function POST({ request, locals }) {
  const supabase: SupabaseClient = locals.supabase;
  const { action, data } = await request.json();

  switch (action) {
    case 'updateUserPreset':
      return await updateUserPreset(data, supabase);
    default:
      return error(400, 'Invalid action');
  }
}

// Specific query functions
async function getUserStats(userId: string | null, supabase: SupabaseClient) {
  if (!userId) {
    return error(400, 'User ID is required');
  }

  const { data, error: dbError } = await supabase
    .schema('stats')
    .from('users')
    .select('user_id, current_preset, current_match')
    .eq('provider_username', userId)
    .single();

  if (dbError) {
    return error(500, dbError.message);
  }

  return json({
    status: 200,
    data
  });
}

async function getCurrentMatch(userId: string | null, supabase: SupabaseClient) {
  if (!userId) {
    return error(400, 'User ID is required');
  }

  const { data, error: dbError } = await supabase
    .schema('stats')
    .from('matches')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (dbError) {
    return error(500, dbError.message);
  }

  return json({
    status: 200,
    data
  });
}

async function getPresets(userid: string | null, supabase: SupabaseClient) {
  if (!userid) {
    return error(400, 'User ID is required');
  }

  const { data, error: dbError } = await supabase
    .schema('stats')
    .from('presets')
    .select('*')
    .eq("user_id", userid);

  if (dbError) {
    return error(500, dbError.message);
  }

  return json({
    status: 200,
    data
  })
  

}

async function updateUserPreset(data: any, supabase: SupabaseClient) {
  const { userId, preset } = data;

  if (!userId || !preset) {
    return error(400, 'User ID and preset are required');
  }

  const { error: dbError } = await supabase
    .schema('stats')
    .from('users')
    .update({ current_preset: preset })
    .eq('user_id', userId);

  if (dbError) {
    return error(500, dbError.message);
  }

  return json({
    status: 200,
    message: 'Preset updated successfully'
  });
}