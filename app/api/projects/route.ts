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

// Handler for creating a new project
export async function POST(req: NextRequest) {
  try {
    // 1. Parse the incoming JSON data from the request body
    const projectData = await req.json();

    // 2. Perform data validation (optional but recommended)
    if (!projectData.title || !projectData.slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    // 3. Insert the new project data into the 'projects' table
    //    Supabase expects an array of objects for insertion.
    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert([{
        title: projectData.title,
        slug: projectData.slug,
        description: projectData.description,
        detailproject: projectData.detailproject,
        image: projectData.image,
        technologies: projectData.technologies,
        status: projectData.status,
        category: projectData.category,
      }])
      .select()
      .single(); // Use .single() if you expect only one record to be inserted and want it returned

    // 4. Handle potential errors from the database operation
    if (error) {
      console.error('Supabase Admin Insert Error:', error);
      // Provide a more specific error message if possible
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json({ error: `A project with this slug already exists: ${projectData.slug}` }, { status: 409 }); // 409 Conflict
      }
      return NextResponse.json({ error: `Supabase error: ${error.message}` }, { status: 500 });
    }

    // 5. Return the newly created data with a 201 Created status
    return NextResponse.json({ data }, { status: 201 });

  } catch (error: any) {
    // 6. Handle other errors (e.g., JSON parsing error, network issues)
    console.error('API Route POST Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
