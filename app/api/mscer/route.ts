
import { createClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

// This admin client is correctly configured to use the service_role key.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(req: NextRequest) {
  try {
    const mscerData = await req.json();

    // FINAL & CORRECT APPROACH: Call the PostgreSQL function.
    // This function runs with SECURITY DEFINER and bypasses RLS safely.
    const { data, error } = await supabaseAdmin
      .rpc('add_mscer_admin', { mscer_data: mscerData })
      .select()
      .single();

    if (error) {
      // The error from the RPC call will be much more informative.
      console.error('Supabase RPC Error:', error);
      return NextResponse.json({ error: `Database RPC error: ${error.message}` }, { status: 500 });
    }

    // The function returns the new row, so we just pass it along.
    return NextResponse.json({ data }, { status: 201 });
    
  } catch (error: any) {
    console.error('API Route POST Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
