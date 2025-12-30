'use client'

import { createBrowserClient } from '@supabase/ssr'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Minimal fallback stub for Supabase client when env vars are missing
function createFallbackClient() {
  // chainable query builder stub
  const queryStub = () => {
    const q: any = {}
    q.select = async () => ({ data: [], error: null })
    q.order = () => q
    q.limit = () => q
    q.ilike = () => q
    q.eq = () => q
    q.single = async () => ({ data: null, error: { code: 'PGRST116', message: 'Not found' } })
    q.insert = () => ({ select: async () => ({ data: null, error: null }) })
    return q
  }

  return {
    from: (_table: string) => queryStub(),
    auth: {
      // auth stubs return an error to indicate missing config
      signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
      signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
      getUser: async () => ({ data: { user: null }, error: null }),
      signOut: async () => ({ error: null }),
    },
  }
}

// Client-only Supabase client for browser
export function createClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn('Supabase client not configured: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing. Using fallback stub.')
    }
    return createFallbackClient() as any
  }

  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

// Types exports - Simple client types
export interface UserData {
  id?: string
  email: string
  name: string
  fullName: string
  avatar?: string
  phone?: string
  university?: string
  major?: string
  role?: string
  status?: string
  created_at?: string
  updated_at?: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  fullName: string
  phone?: string
  confirmPassword?: string
  university?: string
  major?: string
}

export interface Program {
  id: string // uuid from database
  title: string
  description?: string
  detailed_content?: string
  highlights?: string[] // jsonb from database
  duration?: string
  price?: string // character varying in database
  image?: string
  slug?: string
  level?: string
  category?: string
  students?: string // character varying in database
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  description: string
  detailproject?: string 
  image?: string
  technologies?: string[]
  // CẬP NHẬT ĐOẠN NÀY
  mentors?: {
    id: string;
    full_name: string;
    avatar_url: string;
    slug: string;   // Thêm dòng này
    title?: string; // Thêm dòng này
  }[]
  status?: 'ongoing' | 'completed' | 'planning'
  slug?: string
  category?: string
  featured?: boolean // Thêm nếu bạn dùng logic lọc dự án tiêu biểu
}

export interface BlogPost {
  id: string
  title: string
  content?: string
  excerpt?: string
  context?: string
  image?: string
  author?: string
  author_avatar?: string
  published_at?: string
  publish_date?: string
  read_time?: string
  created_at?: string
  tags?: string[]
  category?: string
  slug?: string
}

// Simple API for client-side operations
export const api = {
  // Programs
  getPrograms: async (): Promise<Program[]> => {
    try {
      console.log('🔍 Starting getPrograms API call...')
      console.log('🔍 SUPABASE_URL:', SUPABASE_URL)
      console.log('🔍 SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? 'Present' : 'Missing')
      
      const supabase = createClient()
      console.log('🔍 Supabase client created successfully')
      
      const { data, error } = await supabase
        .from('programs')
        .select('*')
      
      console.log('🔍 Supabase query executed')
      console.log('🔍 Error:', error)
      console.log('🔍 Error details:', error ? {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      } : null)
      console.log('🔍 Data:', data)
      console.log('🔍 Data length:', data?.length || 0)
      
      if (error) {
        console.error('❌ Supabase error details:', error)
        
        // Check if it's RLS related error
        if (error.code === 'PGRST116' || error.message.includes('row-level security')) {
          console.error('❌ RLS Policy Error - Check Supabase RLS policies for programs table')
          throw new Error('Không có quyền truy cập dữ liệu programs. Vui lòng liên hệ admin.')
        }
        
        throw error
      }
      
      console.log('✅ Programs fetched successfully:', data?.length || 0, 'records')
      return data || []
    } catch (error) {
      console.error('❌ Error fetching programs:', error)
      
      // Return empty array for graceful degradation
      console.log('⚠️ Returning empty array due to error')
      return []
    }
  },

  // Projects

  getProjects: async (): Promise<Project[]> => {
    try {
      const supabase = createClient();
      
      // 1. Lấy danh sách dự án
      const { data: projectsData, error: projError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projError) throw projError;

      // 2. Lấy toàn bộ danh sách mentors để map thủ công (Tối ưu hơn fetch từng cái)
      const { data: mentorsList, error: mentError } = await supabase
        .from('mentors')
        .select('id, full_name, avatar_url, slug, title');

      if (mentError) throw mentError;

      // 3. Map Mentor vào từng Project
      const formattedProjects: Project[] = (projectsData || []).map((project: any) => {
        const projectMentorIds = project.mentor_ids || [];
        
        // Tìm thông tin chi tiết của các mentor dựa trên mảng ID
        const matchedMentors = (mentorsList || []).filter((m: { id: string; full_name: string; avatar_url: string; slug: string; title?: string }) => 
  (project.mentor_ids || []).includes(m.id)
)

        return {
          ...project,
          mentors: matchedMentors // Gán mảng object mentor vào đây
        };
      });

      return formattedProjects;
    } catch (error) {
      console.error('❌ Error fetching projects:', error);
      return [];
    }
  },
  

  // Blog posts
  getBlogPosts: async (): Promise<BlogPost[]> => {
    try {
      console.log('🔍 Starting getBlogPosts API call...')
      
      const supabase = createClient()
      const { data, error } = await supabase
        .from('allblogposts')
        .select('*')
        .order('publish_date', { ascending: false })
      
      console.log('🔍 Blog posts query executed')
      console.log('🔍 Error:', error)
      console.log('🔍 Data:', data)
      console.log('🔍 Data length:', data?.length || 0)
      
      if (error) {
        console.error('❌ Supabase error:', error)
        throw error
      }
      
      // Transform database data to match BlogPost interface
      const blogPosts: BlogPost[] = (data || []).map((post: any) => ({
        id: post.id.toString(),
        title: post.title,
        content: post.content || post.details_blog, // Use content field if available, fallback to details_blog
        excerpt: post.excerpt,
        image: post.image,
        author: post.author,
        author_avatar: post.author_avatar,
        published_at: post.publish_date,
        publish_date: post.publish_date,
        read_time: post.read_time,
        category: post.category,
        slug: post.slug,
        tags: [] // Database doesn't have tags field, so empty array
      }))
      
      console.log('✅ Blog posts fetched successfully:', blogPosts.length, 'records')
      return blogPosts
    } catch (error) {
      console.error('❌ Error fetching blog posts:', error)
      return []
    }
  },

  // Get single blog post by slug
  getBlogPostBySlug: async (slug: string): Promise<BlogPost | null> => {
    try {
      console.log('🔍 Starting getBlogPostBySlug API call for:', slug)
      
      const supabase = createClient()
      const { data, error } = await supabase
        .from('allblogposts')
        .select('*')
        .eq('slug', slug)
        .single()
      
      console.log('🔍 Blog post by slug query executed')
      console.log('🔍 Error:', error)
      console.log('🔍 Data:', data)
      
      if (error) {
        console.error('❌ Supabase error:', error)
        if (error.code === 'PGRST116') {
          return null // Post not found
        }
        throw error
      }
      
      // Transform database data to match BlogPost interface
      const blogPost: BlogPost = {
        id: data.id.toString(),
        title: data.title,
        content: data.content || data.details_blog, // Use content field if available, fallback to details_blog
        excerpt: data.excerpt,
        context: data.context,
        image: data.image,
        author: data.author,
        author_avatar: data.author_avatar,
        published_at: data.publish_date,
        publish_date: data.publish_date,
        read_time: data.read_time,
        category: data.category,
        slug: data.slug,
        tags: []
      }
      
      console.log('✅ Blog post fetched successfully:', blogPost.title)
      return blogPost
    } catch (error) {
      console.error('❌ Error fetching blog post by slug:', error)
      return null
    }
  },

  // Get blog posts by category
  getBlogPostsByCategory: async (category: string): Promise<BlogPost[]> => {
    try {
      console.log('🔍 Starting getBlogPostsByCategory API call for:', category)
      
      const supabase = createClient()
      const { data, error } = await supabase
        .from('allblogposts')
        .select('*')
        .ilike('category', `%${category}%`)
        .order('publish_date', { ascending: false })
      
      console.log('🔍 Blog posts by category query executed')
      console.log('🔍 Error:', error)
      console.log('🔍 Data length:', data?.length || 0)
      
      if (error) {
        console.error('❌ Supabase error:', error)
        throw error
      }
      
      // Transform database data to match BlogPost interface
      const blogPosts: BlogPost[] = (data || []).map((post: any) => ({
        id: post.id.toString(),
        title: post.title,
        content: post.content || post.details_blog, // Use content field if available, fallback to details_blog
        excerpt: post.excerpt,
        image: post.image,
        author: post.author,
        author_avatar: post.author_avatar,
        published_at: post.publish_date,
        publish_date: post.publish_date,
        read_time: post.read_time,
        category: post.category,
        slug: post.slug,
        tags: []
      }))
      
      console.log('✅ Blog posts by category fetched successfully:', blogPosts.length, 'records')
      return blogPosts
    } catch (error) {
      console.error('❌ Error fetching blog posts by category:', error)
      return []
    }
  },

  // Get top posts from view
  getTopPosts: async (): Promise<any[]> => {
    try {
      console.log('🔍 Starting getTopPosts API call...')
      
      const supabase = createClient()
      const { data, error } = await supabase
        .from('top_posts')
        .select('*')
        .order('views', { ascending: false })
        .limit(5)
      
      console.log('🔍 Top posts query executed')
      console.log('🔍 Error:', error)
      console.log('🔍 Data:', data)
      console.log('🔍 Data length:', data?.length || 0)
      
      if (error) {
        console.error('❌ Supabase error:', error)
        throw error
      }
      
      console.log('✅ Top posts fetched successfully:', data?.length || 0, 'records')
      return data || []
    } catch (error) {
      console.error('❌ Error fetching top posts:', error)
      return []
    }
  },

  // Get single project by slug
 // Get single project by slug (Kèm thông tin chi tiết Mentor)
  getProjectBySlug: async (slug: string): Promise<Project | null> => {
    try {
      console.log('🔍 Starting getProjectBySlug API call for:', slug)
      
      const supabase = createClient()
      
      // 1. Lấy dữ liệu dự án từ bảng 'projects'
      const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single()
      
      if (error) {
        console.error('❌ Supabase error:', error)
        if (error.code === 'PGRST116') return null // Không tìm thấy dự án
        throw error
      }

      // 2. Lấy thông tin chi tiết Mentors dựa trên mảng mentor_ids của dự án
      const mentorIds = project.mentor_ids || []
      
      if (mentorIds.length > 0) {
        const { data: mentorsData, error: mentorError } = await supabase
          .from('mentors')
          .select('id, full_name, avatar_url, slug, title')
          .in('id', mentorIds) // Lọc những mentor có ID nằm trong mảng mentor_ids

        if (mentorError) {
          console.error('⚠️ Error fetching mentors for project:', mentorError)
          project.mentors = []
        } else {
          project.mentors = mentorsData || []
        }
      } else {
        project.mentors = []
      }
      
      console.log('✅ Project with Mentors fetched successfully:', project.title)
      
      // Trả về project đã được gán thêm mảng mentors chi tiết
      return project as Project
      
    } catch (error) {
      console.error('❌ Error fetching project by slug:', error)
      return null
    }
  }
}

// Client API for user operations
export const apiClient = {
  register: async (userData: RegisterData) => {
    try {
      const supabase = createClient()
      
      console.log('🔐 Starting registration process for:', userData.email)
      
      // First, create user in Supabase Auth with phone number
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        phone: userData.phone, // Store phone in auth.users
        options: {
          data: {
            full_name: userData.fullName || userData.name,
            phone: userData.phone,
            university: userData.university,
            major: userData.major
          }
        }
      })

      if (authError) {
        console.error('❌ Auth registration error:', authError)
        return {
          success: false,
          error: authError.message === 'User already registered' ? 
            'Email đã được sử dụng' : 
            authError.message
        }
      }

      console.log('✅ Supabase Auth registration successful for user:', authData.user?.email)

      // If auth succeeds, create profile in profiles table
      if (authData.user) {
        try {
          console.log('🔐 Creating profile for user ID:', authData.user.id)
          
          const profileData = {
            id: authData.user.id, // Reference to auth.users(id)
            full_name: userData.fullName || userData.name,
            avatar_url: null,
            role: 'user',
            phone: userData.phone || null
            // created_at sẽ tự động được set bởi default now()
          }
          
          console.log('🔐 Profile data to insert:', profileData)
          
          const { data: insertedProfile, error: profileError } = await supabase
            .from('profiles')
            .insert([profileData])
            .select()
            .single()

          if (profileError) {
            console.error('❌ Failed to create profile:', profileError)
            console.error('❌ Profile error details:', {
              message: profileError.message,
              details: profileError.details,
              hint: profileError.hint,
              code: profileError.code
            })
            
            // Don't fail the whole registration if profile creation fails
            // Auth account was created successfully, so registration is considered successful
            console.log('⚠️ Profile creation failed, but auth registration succeeded - continuing as success')
          } else {
            console.log('✅ User profile created successfully in profiles table:', insertedProfile)
          }
        } catch (profileTableError) {
          console.error('❌ Profile table error:', profileTableError)
          // Don't fail the whole registration - auth account exists
          console.log('⚠️ Profile table error, but auth registration succeeded - continuing as success')
        }
      }

      // Always return success if auth registration succeeded
      // This ensures user gets redirected to login page
      return {
        success: true,
        data: {
          user: authData.user,
          session: authData.session
        }
      }
    } catch (error) {
      console.error('❌ Registration error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Đã xảy ra lỗi khi đăng ký'
      }
    }
  }
}

export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      console.log('🔐 Starting login process for:', email)
      const supabase = createClient()
      
      // Try Supabase Auth with real accounts
      console.log('🔐 Attempting Supabase Auth login...')
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) {
        console.log('⚠️ Supabase Auth failed:', authError.message)
        
        // Return error for real auth failure
        return {
          success: false,
          error: authError.message === 'Invalid login credentials' ? 
            'Email hoặc mật khẩu không chính xác' : 
            authError.message
        }
      }

      console.log('✅ Supabase Auth successful for user:', authData.user?.email)
      
      // Try to get additional user data from profiles table first
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single()
          
        if (profileData) {
          console.log('✅ Found user profile data')
          // Merge auth data with profiles table data
          return {
            success: true,
            data: {
              user: {
                ...authData.user,
                user_metadata: {
                  ...authData.user.user_metadata,
                  full_name: profileData.full_name || authData.user.user_metadata?.full_name,
                  phone: authData.user.phone || authData.user.user_metadata?.phone,
                  university: authData.user.user_metadata?.university,
                  major: authData.user.user_metadata?.major,
                  role: profileData.role || 'user',
                  avatar_url: profileData.avatar_url
                }
              },
              session: authData.session
            }
          }
        }
      } catch (profileTableError) {
        console.log('⚠️ Could not fetch profile data, using auth data only')
      }
      
      // Return standard auth data if no additional user data found
      return {
        success: true,
        data: {
          user: authData.user,
          session: authData.session
        }
      }
    } catch (error) {
      console.error('❌ Login error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Đã xảy ra lỗi trong quá trình đăng nhập'
      }
    }
  },

  logout: async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error
      
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Logout failed'
      }
    }
  },

  getCurrentUser: async (): Promise<UserData | null> => {
    try {
      const supabase = createClient()
      
      // First try to get user from Supabase Auth
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        console.log('✅ Found authenticated user:', user.email)
        
        // Try to get user data from profiles table first
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          if (!profileError && profileData) {
            console.log('✅ Found user profile data')
            return {
              id: user.id,
              email: user.email || '',
              name: profileData.full_name || user.user_metadata?.full_name || '',
              fullName: profileData.full_name || user.user_metadata?.full_name || '',
              avatar: profileData.avatar_url || user.user_metadata?.avatar_url,
              phone: user.phone || user.user_metadata?.phone, // Get phone from auth.users
              university: user.user_metadata?.university,
              major: user.user_metadata?.major,
              role: profileData.role || 'user',
              status: 'active',
              created_at: profileData.created_at
            }
          } else {
            console.log('⚠️ No profile data found, using auth data only')
          }
        } catch (profileTableError) {
          console.log('⚠️ Profiles table not accessible, using auth data only')
        }

        // Final fallback to auth data only
        console.log('⚠️ Using auth data only')
        return {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.full_name || '',
          fullName: user.user_metadata?.full_name || '',
          avatar: user.user_metadata?.avatar_url,
          phone: user.phone || user.user_metadata?.phone,
          role: 'user'
        }
      }
      
      return null
    } catch (error) {
      console.error('❌ Get current user error:', error)
      return null
    }
  },

  updateProfile: async (updates: Partial<UserData>) => {
    try {
      const supabase = createClient()
      
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: updates.name,
          avatar_url: updates.avatar
        }
      })

      if (error) throw error
      
      return { success: true }
    } catch (error) {
      console.error('Update profile error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Update failed'
      }
    }
  }
}

export default api
