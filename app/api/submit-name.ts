import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { roomId, fid, answer } = await req.json();

  // Duplicate answer validation
  const { data: existing } = await supabase
    .from('submissions')
    .select('*')
    .eq('roomId', roomId)
    .eq('fid', fid)
    .eq('answer', answer);

  if (existing && existing.length > 0) {
    return NextResponse.json({ error: 'Duplicate answer' }, { status: 400 });
  }

  const { data, error } = await supabase.from('submissions').insert([{ roomId, fid, answer, timestamp: new Date() }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
} 