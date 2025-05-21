import React from 'react';
import { supabase, supabaseAdmin } from '../../lib/supabase';

export default async function TestPage() {
  try {
    // Test 1: Basic Connection (Client)
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('*')
      .limit(1);

    // Test 2: Create a test room (Admin)
    const testRoomId = 'test-' + Math.random().toString(36).substring(2, 8);
    const { data: newRoom, error: createError } = await supabaseAdmin
      .from('rooms')
      .insert([
        {
          room_id: testRoomId,
          category: 'Test Category',
          state: 'waiting'
        }
      ])
      .select();

    // Test 3: Delete the test room (Admin)
    const { error: deleteError } = await supabaseAdmin
      .from('rooms')
      .delete()
      .eq('room_id', testRoomId);

    return (
      <div style={{ padding: '20px' }}>
        <h1>Supabase Connection Test</h1>
        
        <h2>Test 1: Basic Connection (Client)</h2>
        <pre>
          {roomsError 
            ? `Error: ${roomsError.message}`
            : `Success! Found ${rooms?.length || 0} rooms`}
        </pre>

        <h2>Test 2: Create Room (Admin)</h2>
        <pre>
          {createError 
            ? `Error: ${createError.message}`
            : `Success! Created room: ${JSON.stringify(newRoom, null, 2)}`}
        </pre>

        <h2>Test 3: Delete Room (Admin)</h2>
        <pre>
          {deleteError 
            ? `Error: ${deleteError.message}`
            : 'Success! Test room deleted'}
        </pre>

        <h2>Connection Info</h2>
        <pre>
          Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}
          Client Status: {roomsError ? 'Error' : 'Connected'}
          Admin Status: {createError ? 'Error' : 'Connected'}
        </pre>
      </div>
    );
  } catch (error) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Error Testing Connection</h1>
        <pre>{(error as Error).message}</pre>
      </div>
    );
  }
} 