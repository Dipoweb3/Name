import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { roomId } = await req.json();
  await supabase.from('rooms').update({ state: 'done' }).eq('roomId', roomId);
  return NextResponse.json({ success: true });
} 