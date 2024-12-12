//TODO: make this the go-to place for supabase. Use this code as a baseline and build on it so all queries are server-side

// /api/db/+server.ts
import { error, json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';




export async function GET({ url }) {
  const action = url.searchParams.get('action');
  const userId = url.searchParams.get('userId');

  switch (action) {
    case 'getUserStats':
      return await getUserStats(userId);
    case 'getCurrentMatch':
      return await getCurrentMatch(userId);
    default:
      return error(400, 'Invalid action');
  }
}

export async function POST({ request }) {
  const { action, data } = await request.json();

  switch (action) {
    case 'updateUserPreset':
      return await updateUserPreset(data);
    case 'createNewMatch':
      return await createNewMatch(data);
    default:
      return error(400, 'Invalid action');
  }
}

// Specific query functions
async function getUserStats(userId: string | null) {
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

async function getCurrentMatch(userId: string | null) {
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

async function updateUserPreset(data: any) {
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