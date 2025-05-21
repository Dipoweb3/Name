import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getRandomCategory } from '@/lib/categories';

export async function POST(req: NextRequest) {
  const { fid, username } = await req.json();
  const roomId = Math.random().toString(36).substring(2, 8);
  const category = getRandomCategory();

  await supabase.from('rooms').insert([{ roomId, category, state: 'waiting', createdAt: new Date() }]);
  await supabase.from('participants').insert([{ roomId, fid, username }]);

  return NextResponse.json({ roomId, category, link: `https://name-name.xyz/room/${roomId}` });
} 