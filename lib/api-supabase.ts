
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

// Helper function to safely parse JSON array fields
const safeParseArray = (field: any): string[] => {
  if (Array.isArray(field)) {
    return field;
  }
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return []; // Return empty array if parsing fails
    }
  }
  return []; // Return empty array for any other type
};

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
<<<<<<< HEAD
  // CẬP NHẬT ĐOẠN NÀY
  mentors?: {
    id: string;
    full_name: string;
    avatar_url: string;
    slug: string;   // Thêm dòng này
    title?: string; // Thêm dòng này
  }[]
=======
  mentors?: string[]
>>>>>>> a05a58dc4d60f7219407f17c7066bf57b15f0e95
  status?: 'ongoing' | 'completed' | 'planning'
  slug?: string
  category?: string
  featured?: boolean // Thêm nếu bạn dùng logic lọc dự án tiêu biểu
}

<<<<<<< HEAD
// This interface now matches the structure from data/mscer.ts and the database table
export interface MSCer {
  id: string;
  name: string;
  company?: string;
  position?: string;
  avatar?: string;
  achievement?: string;
  testimonial?: string;
  graduationYear?: string;
  promotion?: string;
  socialImpact?: string;
  course?: string;
  skills?: string[];
  achievements?: string[];
  mentoring?: string;
  background?: { // This is a JSONB field
    education?: string;
    previousRole?: string;
    experience?: string;
  };
  created_at?: string;
}

=======
>>>>>>> parent of 48b962a (up trang chia sẻ)
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
      const supabase = createClient()
      const { data, error } = await supabase
        .from('programs')
        .select('*')
      
      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('row-level security')) {
          console.error('❌ RLS Policy Error - Check Supabase RLS policies for programs table')
        }
        throw error
      }
      
      // Safely parse highlights for each program
      const processedData = (data || []).map(program => ({
        ...program,
        highlights: safeParseArray(program.highlights),
      }));

      return processedData;

    } catch (error) {
      console.error('❌ Error fetching programs:', error)
      return []
    }
  },

  // Projects

  getProjects: async (): Promise<Project[]> => {
    try {
<<<<<<< HEAD
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
=======
      const supabase = createClient()
      const { data, error } = await supabase
        .from('projects')
        .select('*')
      
      if (error) {
        console.error('❌ Supabase error:', error)
        throw error
      }
      
      // Safely parse mentors and technologies fields
      const processedData = (data || []).map(project => ({
        ...project,
        mentors: safeParseArray(project.mentors),
        technologies: safeParseArray(project.technologies),
      }));

      return processedData;
>>>>>>> a05a58dc4d60f7219407f17c7066bf57b15f0e95
    } catch (error) {
      console.error('❌ Error fetching projects:', error);
      return [];
    }
  },
  
<<<<<<< HEAD
<<<<<<< HEAD
=======
  getProjectById: async (id: string): Promise<Project | null> => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw error;
      }
      
      if (!data) return null;

      // Safely parse mentors and technologies
      return {
        ...data,
        mentors: safeParseArray(data.mentors),
        technologies: safeParseArray(data.technologies),
      };
    } catch (error) {
      console.error('❌ Error fetching project by id:', error);
      return null;
    }
  },

  getProjectBySlug: async (slug: string): Promise<Project | null> => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null // Project not found
        }
        throw error
      }

      if (!data) return null;

      // Safely parse mentors and technologies
      return {
        ...data,
        mentors: safeParseArray(data.mentors),
        technologies: safeParseArray(data.technologies),
      };
    } catch (error) {
      console.error('❌ Error fetching project by slug:', error)
      return null
    }
  },

  createProject: async (projectData: Partial<Project>): Promise<Project> => {
    try {
      const response = await fetch(`/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create project');
      }

      const { data } = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Error creating project:', error);
      throw error;
    }
  },

  updateProject: async (id: string, projectData: Partial<Project>): Promise<Project> => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update project');
      }

      const { data } = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Error updating project:', error);
      throw error;
    }
  },

  deleteProject: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete project');
      }
    } catch (error) {
      console.error('❌ Error deleting project:', error);
      throw error;
    }
  },

  // MSCers
  getMSCer: async (): Promise<MSCer[]> => {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('mscers')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('❌ Supabase error fetching mscers:', error);
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('❌ Error fetching mscers:', error);
        return [];
    }
  },

  addMSCer: async (mscerData: Partial<MSCer>): Promise<MSCer> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

    try {
      const response = await fetch('/api/mscer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mscerData),
        signal: controller.signal, // AbortSignal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add MSCer');
      }

      const { data } = await response.json();
      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.error('❌ API request timed out');
        throw new Error('Yêu cầu đã hết thời gian. Máy chủ không phản hồi.');
      }
      console.error('❌ Error adding MSCer:', error);
      throw error;
    }
  },

  getMSCerById: async (id: string): Promise<MSCer | null> => {
      try {
          const supabase = createClient();
          const { data, error } = await supabase
              .from('mscers')
              .select('*')
              .eq('id', id)
              .single();

          if (error) {
              if (error.code === 'PGRST116') {
                  return null; // Not found is not an error
              }
              console.error('❌ Supabase error fetching mscer by id:', error);
              throw error;
          }

          return data;
      } catch (error) {
          console.error(`❌ Error fetching mscer by id ${id}:`, error);
          return null;
      }
  },
>>>>>>> a05a58dc4d60f7219407f17c7066bf57b15f0e95

  // Blog posts
  getBlogPosts: async (): Promise<BlogPost[]> => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
=======

  // Blog posts
  getBlogPosts: async (): Promise<BlogPost[]> => {
    try {
      console.log('🔍 Starting getBlogPosts API call...')
      
      const supabase = createClient()
      const { data, error } = await supabase
>>>>>>> parent of 48b962a (up trang chia sẻ)
        .from('allblogposts')
        .select('*')
        .order('publish_date', { ascending: false })
      
<<<<<<< HEAD
      if (error) {
        throw error
      }
=======
      console.log('🔍 Blog posts query executed')
      console.log('🔍 Error:', error)
      console.log('🔍 Data:', data)
      console.log('🔍 Data length:', data?.length || 0)
>>>>>>> parent of 48b962a (up trang chia sẻ)
      
      if (error) {
        console.error('❌ Supabase error:', error)
        throw error
      }
      
      // Transform database data to match BlogPost interface
      const blogPosts: BlogPost[] = (data || []).map((post: any) => ({
        id: post.id.toString(),
        title: post.title,
<<<<<<< HEAD
        content: post.content || post.details_blog,
=======
        content: post.content || post.details_blog, // Use content field if available, fallback to details_blog
>>>>>>> parent of 48b962a (up trang chia sẻ)
        excerpt: post.excerpt,
        image: post.image,
        author: post.author,
        author_avatar: post.author_avatar,
        published_at: post.publish_date,
        publish_date: post.publish_date,
        read_time: post.read_time,
        category: post.category,
        slug: post.slug,
<<<<<<< HEAD
        tags: []
      }))
      
=======
        tags: [] // Database doesn't have tags field, so empty array
      }))
      
      console.log('✅ Blog posts fetched successfully:', blogPosts.length, 'records')
>>>>>>> parent of 48b962a (up trang chia sẻ)
      return blogPosts
    } catch (error) {
      console.error('❌ Error fetching blog posts:', error)
      return []
    }
  },

  // Get single blog post by slug
  getBlogPostBySlug: async (slug: string): Promise<BlogPost | null> => {
    try {
<<<<<<< HEAD
=======
      console.log('🔍 Starting getBlogPostBySlug API call for:', slug)
      
>>>>>>> parent of 48b962a (up trang chia sẻ)
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
<<<<<<< HEAD
=======
        console.error('❌ Supabase error:', error)
>>>>>>> parent of 48b962a (up trang chia sẻ)
        if (error.code === 'PGRST116') {
          return null // Post not found
        }
        throw error
      }
      
<<<<<<< HEAD
      const blogPost: BlogPost = {
        id: data.id.toString(),
        title: data.title,
        content: data.content || data.details_blog,
=======
      // Transform database data to match BlogPost interface
      const blogPost: BlogPost = {
        id: data.id.toString(),
        title: data.title,
        content: data.content || data.details_blog, // Use content field if available, fallback to details_blog
>>>>>>> parent of 48b962a (up trang chia sẻ)
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
      
<<<<<<< HEAD
=======
      console.log('✅ Blog post fetched successfully:', blogPost.title)
>>>>>>> parent of 48b962a (up trang chia sẻ)
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
      
<<<<<<< HEAD
      if (error) {
        throw error
      }
      
      const blogPosts: BlogPost[] = (data || []).map((post: any) => ({
        id: post.id.toString(),
        title: post.title,
        content: post.content || post.details_blog,
=======
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
>>>>>>> parent of 48b962a (up trang chia sẻ)
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
      
<<<<<<< HEAD
=======
      console.log('✅ Blog posts by category fetched successfully:', blogPosts.length, 'records')
>>>>>>> parent of 48b962a (up trang chia sẻ)
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
      
<<<<<<< HEAD
      if (error) {
        throw error
      }
      
=======
      console.log('🔍 Top posts query executed')
      console.log('🔍 Error:', error)
      console.log('🔍 Data:', data)
      console.log('🔍 Data length:', data?.length || 0)
      
      if (error) {
        console.error('❌ Supabase error:', error)
        throw error
      }
      
      console.log('✅ Top posts fetched successfully:', data?.length || 0, 'records')
>>>>>>> parent of 48b962a (up trang chia sẻ)
      return data || []
    } catch (error) {
      console.error('❌ Error fetching top posts:', error)
      return []
    }
  },
<<<<<<< HEAD

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
=======
>>>>>>> a05a58dc4d60f7219407f17c7066bf57b15f0e95
}

// Client API for user operations
export const apiClient = {
  register: async (userData: RegisterData) => {
    try {
      const supabase = createClient()
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
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
        return {
          success: false,
          error: authError.message === 'User already registered' ? 
            'Email đã được sử dụng' : 
            authError.message
        }
      }

      if (authData.user) {
        try {
          const profileData = {
            id: authData.user.id,
            full_name: userData.fullName || userData.name,
            avatar_url: null,
            role: 'user',
            phone: userData.phone || null
          }
          
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([profileData])

          if (profileError) {
            console.error('❌ Failed to create profile:', profileError)
          }
        } catch (profileTableError) {
          console.error('❌ Profile table error:', profileTableError)
        }
      }

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
      const supabase = createClient()
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) {
        return {
          success: false,
          error: authError.message === 'Invalid login credentials' ? 
            'Email hoặc mật khẩu không chính xác' : 
            authError.message
        }
      }

      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single()
          
        if (profileData) {
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
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          if (!profileError && profileData) {
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
          }
        } catch (profileTableError) {
        }

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