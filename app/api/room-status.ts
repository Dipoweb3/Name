import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get('roomId');

  if (!roomId) {
    return NextResponse.json({ error: 'roomId is required' }, { status: 400 });
  }

  const { data: room, error: roomError } = await supabase.from('rooms').select('*').eq('roomId', roomId).single();
  if (roomError) {
    return NextResponse.json({ error: roomError.message }, { status: 400 });
  }

  const { data: participants, error: participantsError } = await supabase.from('participants').select('*').eq('roomId', roomId);
  if (participantsError) {
    return NextResponse.json({ error: participantsError.message }, { status: 400 });
  }

  const { data: submissions, error: submissionsError } = await supabase.from('submissions').select('*').eq('roomId', roomId);
  if (submissionsError) {
    return NextResponse.json({ error: submissionsError.message }, { status: 400 });
  }

  const { data: votes, error: votesError } = await supabase.from('votes').select('*').eq('roomId', roomId);
  if (votesError) {
    return NextResponse.json({ error: votesError.message }, { status: 400 });
  }

  return NextResponse.json({ room, participants, submissions, votes });
} 