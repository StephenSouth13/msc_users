// Database service layer using Supabase SSR
import { createSupabaseServerClient } from '@/lib/supabase'
import type { User, Program, Project, BlogPost } from '@/lib/supabase'

// Response interfaces
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T = any> {
  success: boolean
  data?: {
    data: T[]
    total: number
    page: number
    limit: number
    total_pages: number
  }
  error?: string
}

// Database service layer
export const databaseService = {
  // ========== AUTHENTICATION ==========
  async registerUser(userData: {
    email: string
    password: string
    full_name: string
    phone?: string
  }): Promise<ApiResponse<{ user: User; session: any }>> {
    try {
      const supabase = await createSupabaseServerClient()
      
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.full_name,
            phone: userData.phone
          }
        }
      })

      if (authError) {
        console.error('Auth signup error:', authError)
        return { success: false, error: authError.message }
      }

      if (!authData.user) {
        return { success: false, error: 'Failed to create user' }
      }

      // Create user profile in database
      const userProfile: Omit<User, 'id' | 'created_at' | 'updated_at'> = {
        email: userData.email,
        full_name: userData.full_name,
        phone: userData.phone,
        role: 'student'
      }

      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .insert({ ...userProfile, id: authData.user.id })
        .select()
        .single()

      if (profileError) {
        console.error('Profile creation error:', profileError)
        return { success: false, error: profileError.message }
      }

      return {
        success: true,
        data: { user: profileData, session: authData.session },
        message: 'Registration successful'
      }
    } catch (error: any) {
      console.error('Registration service error:', error)
      return {
        success: false,
        error: error.message,
        message: 'Registration failed'
      }
    }
  },

  async loginUser(credentials: {
    email: string
    password: string
  }): Promise<ApiResponse<{ user: User; session: any }>> {
    try {
      const supabase = await createSupabaseServerClient()
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })

      if (authError) {
        return { success: false, error: authError.message }
      }

      if (!authData.user) {
        return { success: false, error: 'Login failed' }
      }

      // Get user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (userError) {
        return { success: false, error: userError.message }
      }

      return {
        success: true,
        data: { user: userData, session: authData.session },
        message: 'Login successful'
      }
    } catch (error: any) {
      console.error('Login service error:', error)
      return {
        success: false,
        error: error.message,
        message: 'Login failed'
      }
    }
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const supabase = await createSupabaseServerClient()
      
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        return { success: false, error: 'Not authenticated' }
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (userError) {
        return { success: false, error: userError.message }
      }

      return { success: true, data: userData }
    } catch (error: any) {
      console.error('Get current user error:', error)
      return {
        success: false,
        error: error.message,
        message: 'Failed to get current user'
      }
    }
  },

  // ========== PROGRAMS ==========
  async getAllPrograms(): Promise<ApiResponse<Program[]>> {
    try {
      const supabase = await createSupabaseServerClient()
      
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data, message: 'Programs retrieved successfully' }
    } catch (error: any) {
      console.error('Get programs error:', error)
      return {
        success: false,
        error: error.message,
        message: 'Failed to get programs'
      }
    }
  },

  async getProgramBySlug(slug: string): Promise<ApiResponse<Program>> {
    try {
      const supabase = await createSupabaseServerClient()
      
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error: any) {
      console.error('Get program by slug error:', error)
      return {
        success: false,
        error: error.message,
        message: 'Failed to get program'
      }
    }
  },

  // ========== PROJECTS ==========
  async getAllProjects(): Promise<PaginatedResponse<Project>> {
    try {
      const supabase = await createSupabaseServerClient()
      
      const { data, error, count } = await supabase
        .from('projects')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

      if (error) {
        return { success: false, error: error.message }
      }

      return {
        success: true,
        data: {
          data: data || [],
          total: count || 0,
          page: 1,
          limit: data?.length || 0,
          total_pages: 1
        }
      }
    } catch (error: any) {
      console.error('Get projects error:', error)
      return { success: false, error: error.message }
    }
  },

  async getProjectBySlug(slug: string): Promise<ApiResponse<Project>> {
    try {
      const supabase = await createSupabaseServerClient()
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error: any) {
      console.error('Get project by slug error:', error)
      return {
        success: false,
        error: error.message,
        message: 'Failed to get project'
      }
    }
  },

  // ========== BLOG POSTS ==========
  async getAllBlogPosts(
    page: number = 1,
    limit: number = 10,
    category?: string
  ): Promise<PaginatedResponse<BlogPost>> {
    try {
      const supabase = await createSupabaseServerClient()
      
      let query = supabase
        .from('blog_posts')
        .select('*', { count: 'exact' })

      if (category) {
        query = query.eq('category', category)
      }

      const { data, error, count } = await query
        .order('publish_date', { ascending: false })
        .range((page - 1) * limit, page * limit - 1)

      if (error) {
        return { success: false, error: error.message }
      }

      return {
        success: true,
        data: {
          data: data || [],
          total: count || 0,
          page,
          limit,
          total_pages: Math.ceil((count || 0) / limit)
        }
      }
    } catch (error: any) {
      console.error('Get blog posts error:', error)
      return { success: false, error: error.message }
    }
  },

  async getBlogPostBySlug(slug: string): Promise<ApiResponse<BlogPost>> {
    try {
      const supabase = await createSupabaseServerClient()
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      // Increment view count
      await supabase
        .from('blog_posts')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', data.id)

      return { success: true, data }
    } catch (error: any) {
      console.error('Get blog post by slug error:', error)
      return {
        success: false,
        error: error.message,
        message: 'Failed to get blog post'
      }
    }
  },

  // ========== MSCERS & MENTORS ==========
  async getAllMSCers(): Promise<ApiResponse<any[]>> {
    try {
      const supabase = await createSupabaseServerClient()
      
      const { data, error } = await supabase
        .from('mscers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error: any) {
      console.error('Get MSCers error:', error)
      return {
        success: false,
        error: error.message,
        message: 'Failed to get MSCers'
      }
    }
  },

  async getMSCerById(id: string): Promise<ApiResponse<any>> {
    try {
      const supabase = await createSupabaseServerClient()
      
      const { data, error } = await supabase
        .from('mscers')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error: any) {
      console.error('Get MSCer by ID error:', error)
      return {
        success: false,
        error: error.message,
        message: 'Failed to get MSCer'
      }
    }
  },

  async getAllMentors(): Promise<ApiResponse<any[]>> {
    try {
      const supabase = await createSupabaseServerClient()
      
      const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .order('rating', { ascending: false })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error: any) {
      console.error('Get mentors error:', error)
      return {
        success: false,
        error: error.message,
        message: 'Failed to get mentors'
      }
    }
  },

  async getMentorById(id: string): Promise<ApiResponse<any>> {
    try {
      const supabase = await createSupabaseServerClient()
      
      const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error: any) {
      console.error('Get mentor by ID error:', error)
      return {
        success: false,
        error: error.message,
        message: 'Failed to get mentor'
      }
    }
  },

  // ========== UTILITY FUNCTIONS ==========
  async checkConnection(): Promise<ApiResponse<boolean>> {
    try {
      const supabase = await createSupabaseServerClient()
      
      const { data, error } = await supabase
        .from('programs')
        .select('count', { count: 'exact' })
        .limit(1)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data: true, message: 'Database connection successful' }
    } catch (error: any) {
      console.error('Database connection check error:', error)
      return {
        success: false,
        error: error.message,
        message: 'Database connection failed'
      }
    }
  },

  // Search functionality
  async searchContent(
    query: string,
    types: ('programs' | 'projects' | 'blog_posts')[] = ['programs', 'projects', 'blog_posts']
  ): Promise<ApiResponse<{
    programs: Program[]
    projects: Project[]
    blog_posts: BlogPost[]
  }>> {
    try {
      const supabase = await createSupabaseServerClient()
      const results: any = { programs: [], projects: [], blog_posts: [] }

      // Search programs
      if (types.includes('programs')) {
        const { data: programs } = await supabase
          .from('programs')
          .select('*')
          .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
          .limit(10)
        results.programs = programs || []
      }

      // Search projects
      if (types.includes('projects')) {
        const { data: projects } = await supabase
          .from('projects')
          .select('*')
          .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
          .limit(10)
        results.projects = projects || []
      }

      // Search blog posts
      if (types.includes('blog_posts')) {
        const { data: blogPosts } = await supabase
          .from('blog_posts')
          .select('*')
          .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
          .limit(10)
        results.blog_posts = blogPosts || []
      }

      return { success: true, data: results }
    } catch (error: any) {
      console.error('Search content error:', error)
      return {
        success: false,
        error: error.message,
        message: 'Search failed'
      }
    }
  }
}