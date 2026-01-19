
import { createClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

// Initialize the admin client with options to bypass RLS
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

// Handler for updating a project
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const projectData = await req.json();

    const { data, error } = await supabaseAdmin
      .from('projects')
      .update(projectData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase Admin Update Error:', error);
      return NextResponse.json({ error: `Supabase error: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error('API Route PATCH Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// Final, most robust handler for deleting a project
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Use .select() to get the deleted data back. 
    // If RLS prevents the delete, the data array will be empty.
    const { data, error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      // This catches actual database errors.
      console.error('Supabase Admin Delete Error:', error);
      return NextResponse.json({ error: `Supabase error: ${error.message}` }, { status: 500 });
    }

    // This is the crucial check. If the returned data array is empty, it means nothing was deleted.
    if (!data || data.length === 0) {
        console.warn(`[API] Attempted to delete project ${id}, but no rows were deleted. Check RLS policies.`);
        return NextResponse.json({ error: "Project not found or permission denied. Please check database rules (RLS)." }, { status: 404 });
    }

    // If we get here, data contains the deleted record, so it was a success.
    return NextResponse.json({ message: `Successfully deleted project.` }, { status: 200 });

  } catch (error: any) {
    console.error('API Route DELETE Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
