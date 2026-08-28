import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { AccessToken } from 'npm:livekit-server-sdk@2.9.7';
import { RoomAgentDispatch, RoomConfiguration } from 'npm:@livekit/protocol@1.29.4';



Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const LIVEKIT_URL = Deno.env.get('LIVEKIT_URL')?.trim();
    const LIVEKIT_API_KEY = Deno.env.get('LIVEKIT_API_KEY')?.trim();
    const LIVEKIT_API_SECRET = Deno.env.get('LIVEKIT_API_SECRET')?.trim();


    if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
      return new Response(JSON.stringify({ error: 'LiveKit is not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Authenticate the caller
    const authHeader = req.headers.get('Authorization') ?? '';
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const user = userData.user;
    const identity = user.id;
    const name = (user.user_metadata?.full_name as string) || user.email || 'Candidate';
    const roomName = `mock-interview-${user.id}-${Date.now()}`;

    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity,
      name,
      ttl: '1h',
    });
    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });
    // Explicitly dispatch the "faizan" agent into this interview room
    at.roomConfig = new RoomConfiguration({
      agents: [new RoomAgentDispatch({ agentName: 'faizan' })],
    });
    const token = await at.toJwt();



    return new Response(JSON.stringify({ token, url: LIVEKIT_URL, room: roomName }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('livekit-token error:', e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
