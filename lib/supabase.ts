import { createClient } from '@supabase/supabase-js'

// lib/supabase.ts - Updated for SSR with @supabase/ssr
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

// Supabase URL và Anon Key từ environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client-side Supabase client for browser operations
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
)

// Server-side Supabase client for API routes and Server Components
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.delete({ name, ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// Legacy admin client for API routes that need service role
export const createSupabaseAdmin = () => {
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  if (!supabaseServiceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
  }
  
  return createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Database table interfaces
export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  avatar_url?: string
  role: 'student' | 'mentor' | 'admin'
  created_at: string
  updated_at: string
}

export interface Program {
  id: string
  slug: string
  title: string
  description: string
  detailed_content: string
  image: string
  duration: string
  level: 'beginner' | 'intermediate' | 'advanced'
  price: string
  students: string
  highlights: string[]
  category: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  slug: string
  title: string
  description: string
  image: string
  category: string
  status: 'active' | 'completed' | 'planning'
  mentors: Array<{
    name: string
    avatar: string
  }>
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  details_blog: string
  image: string
  author: string
  author_avatar: string
  publish_date: string
  category: string
  read_time: string
  views: number
  likes: number
  created_at: string
  updated_at: string
}

export interface MSCer {
  id: string
  name: string
  position: string
  company: string
  avatar: string
  bio: string
  skills: string[]
  experience: string
  education: string
  achievements: string[]
  social_links: {
    linkedin?: string
    github?: string
    website?: string
  }
  created_at: string
  updated_at: string
}

export interface Mentor {
  id: string
  name: string
  title: string
  company: string
  avatar: string
  bio: string
  expertise: string[]
  experience: string
  education: string
  rating: number
  total_students: number
  social_links: {
    linkedin?: string
    github?: string
    website?: string
  }
  created_at: string
  updated_at: string
}

// Database helper functions
export const dbHelpers = {
  // Users
  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) throw error
    return data
  },

  async updateUser(id: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Programs
  async getPrograms() {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getProgramBySlug(slug: string) {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error) throw error
    return data
  },

  // Projects
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getProjectBySlug(slug: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error) throw error
    return data
  },

  // Blog Posts
  async getBlogPosts(page: number = 1, limit: number = 10, category?: string) {
    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .order('publish_date', { ascending: false })
    
    if (category) {
      query = query.eq('category', category)
    }
    
    const { data, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)
    
    if (error) throw error
    
    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
      total_pages: Math.ceil((count || 0) / limit)
    }
  },

  async getBlogPostBySlug(slug: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error) throw error
    return data
  },

  async incrementBlogPostViews(id: string) {
    const { data, error } = await supabase
      .rpc('increment_blog_views', { post_id: id })
    
    if (error) throw error
    return data
  },

  // MSCers
  async getMSCers() {
    const { data, error } = await supabase
      .from('mscers')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getMSCerById(id: string) {
    const { data, error } = await supabase
      .from('mscers')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Mentors
  async getMentors() {
    const { data, error } = await supabase
      .from('mentors')
      .select('*')
      .order('rating', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getMentorById(id: string) {
    const { data, error } = await supabase
      .from('mentors')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }
}

// Auth helpers
export const authHelpers = {
  async signUp(email: string, password: string, fullName: string, phone?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone
        }
      }
    })
    
    if (error) throw error
    return data
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  async updateProfile(updates: { full_name?: string; phone?: string; avatar_url?: string }) {
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    })
    
    if (error) throw error
    return data
  }
}