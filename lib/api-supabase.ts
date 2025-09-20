'use client'

import { createBrowserClient } from '@supabase/ssr'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-only Supabase client for browser
export function createClient() {
  return createBrowserClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  )
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
  image?: string
  technologies?: string[]
  mentors?: any[]
  status?: 'ongoing' | 'completed' | 'planning'
  slug?: string
  category?: string
}

export interface BlogPost {
  id: string
  title: string
  content?: string
  excerpt?: string
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
      console.log('🔍 Data:', data)
      console.log('🔍 Data length:', data?.length || 0)
      
      if (error) {
        console.error('❌ Supabase error:', error)
        throw error
      }
      
      // If no data from Supabase, return mock data for testing
      if (!data || data.length === 0) {
        console.log('⚠️ No data from Supabase, returning mock data for testing...')
        const mockPrograms: Program[] = [
          {
            id: '1',
            title: 'Digital Marketing Mastery',
            description: 'Học các kỹ năng marketing digital từ cơ bản đến nâng cao, bao gồm SEO, SEM, Social Media Marketing và Analytics.',
            detailed_content: 'Khóa học toàn diện về Digital Marketing với 40+ giờ học thực hành.',
            duration: '12 tuần',
            level: 'Trung bình',
            price: '5.000.000',
            students: '150',
            category: 'Marketing',
            highlights: [
              'Xây dựng chiến lược marketing tổng thể',
              'Quản lý quảng cáo Facebook & Google Ads',
              'Phân tích và báo cáo hiệu quả campaign',
              'Tối ưu hóa ROI và chuyển đổi',
              'Thực hành với dự án thực tế'
            ],
            image: '/dao-tao/digitalmarketing.webp',
            slug: 'digital-marketing-mastery',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Project Management Professional',
            description: 'Khóa học quản lý dự án chuyên nghiệp theo chuẩn PMP, phù hợp cho các quản lý và leader muốn nâng cao kỹ năng.',
            detailed_content: 'Học các phương pháp quản lý dự án hiện đại như Agile, Scrum, Waterfall.',
            duration: '16 tuần',
            level: 'Nâng cao',
            price: '8.000.000',
            students: '89',
            category: 'Quản lý',
            highlights: [
              'Học phương pháp Agile và Scrum',
              'Quản lý rủi ro và chất lượng dự án',
              'Lập kế hoạch và kiểm soát tiến độ',
              'Giao tiếp và lãnh đạo nhóm',
              'Chuẩn bị thi chứng chỉ PMP'
            ],
            image: '/dao-tao/PMP.webp',
            slug: 'project-management-professional',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '3',
            title: 'Leadership Development Program',
            description: 'Phát triển kỹ năng lãnh đạo và quản lý nhóm hiệu quả trong môi trường kinh doanh hiện đại.',
            detailed_content: 'Chương trình phát triển lãnh đạo toàn diện với các module thực hành và coaching cá nhân.',
            duration: '14 tuần',
            level: 'Nâng cao',
            price: '7.500.000',
            students: '125',
            category: 'Lãnh đạo',
            highlights: [
              'Phát triển tư duy lãnh đạo chiến lược',
              'Kỹ năng giao tiếp và thuyết trình',
              'Quản lý xung đột và đàm phán',
              'Xây dựng team hiệu suất cao',
              'Coaching và mentoring skills'
            ],
            image: '/dao-tao/leadership.webp',
            slug: 'leadership-development-program',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
        
        return mockPrograms
      }
      
      console.log('✅ Programs fetched successfully:', data?.length || 0, 'records')
      return data || []
    } catch (error) {
      console.error('❌ Error fetching programs:', error)
      return []
    }
  },

  // Projects
  getProjects: async (): Promise<Project[]> => {
    try {
      console.log('🔍 Starting getProjects API call...')
      
      const supabase = createClient()
      const { data, error } = await supabase
        .from('projects')
        .select('*')
      
      console.log('🔍 Projects query executed')
      console.log('🔍 Error:', error)
      console.log('🔍 Data:', data)
      console.log('🔍 Data length:', data?.length || 0)
      
      if (error) {
        console.error('❌ Supabase error:', error)
        throw error
      }
      
      // If no data from Supabase, return mock data for testing
      if (!data || data.length === 0) {
        console.log('⚠️ No projects from Supabase, returning mock data for testing...')
        const mockProjects: Project[] = [
          {
            id: '1',
            title: 'Binemo - Transformasi Digital Banking',
            description: 'Dự án đào tạo chuyển đổi số toàn diện cho ngân hàng Binemo, nâng cao năng lực nhân sự trong lĩnh vực fintech và dịch vụ ngân hàng số.',
            category: 'Fintech',
            status: 'completed',
            image: '/Projects/binemo.webp',
            slug: 'binemo-digital-banking-transformation',
            technologies: ['Digital Banking', 'Customer Experience', 'Data Analytics', 'Risk Management'],
            mentors: [
              { id: '1', name: 'Đặng Doãn Minh', avatar: '/Mentors/DDM.webp' },
              { id: '2', name: 'Hoàng Châu Long', avatar: '/Mentors/HCL.webp' }
            ]
          },
          {
            id: '2',
            title: 'VNPT - Chương trình Phát triển Lãnh đạo',
            description: 'Đào tạo kỹ năng lãnh đạo và quản lý cho đội ngũ middle management của VNPT, tập trung vào digital transformation và innovation.',
            category: 'Viễn thông',
            status: 'completed',
            image: '/Projects/VNPT.webp',
            slug: 'vnpt-leadership-development',
            technologies: ['Leadership Skills', 'Change Management', 'Digital Strategy'],
            mentors: [
              { id: '3', name: 'Lê Ngọc Thành Công', avatar: '/Mentors/LNTC.webp' },
              { id: '4', name: 'Nguyễn Công Tiến', avatar: '/Mentors/NCT.webp' }
            ]
          },
          {
            id: '3',
            title: 'Einstein School - Đào tạo Giáo viên STEM',
            description: 'Chương trình đào tạo giáo viên STEM hiện đại, ứng dụng công nghệ trong giảng dạy và phát triển tư duy sáng tạo cho học sinh.',
            category: 'Giáo dục',
            status: 'completed',
            image: '/Projects/einsteinschool.webp',
            slug: 'einstein-school-stem-training',
            technologies: ['STEM Education', 'Educational Technology', 'Creative Teaching'],
            mentors: [
              { id: '5', name: 'Phạm Hồng An', avatar: '/Mentors/PHA.webp' }
            ]
          },
          {
            id: '4',
            title: 'Happyland - Customer Experience Excellence',
            description: 'Dự án nâng cao trải nghiệm khách hàng cho chuỗi giải trí Happyland, đào tạo toàn diện về service excellence và customer relationship.',
            category: 'Giải trí',
            status: 'completed',
            image: '/Projects/Happyland.webp',
            slug: 'happyland-customer-experience',
            technologies: ['Customer Service', 'Experience Design', 'CRM Management'],
            mentors: [
              { id: '6', name: 'Phạm Phú Hiền', avatar: '/Mentors/PPH.webp' },
              { id: '7', name: 'Trần Lê Bảo Châu', avatar: '/Mentors/TLBC.webp' }
            ]
          },
          {
            id: '5',
            title: 'Fdeli - Digital Marketing Mastery',
            description: 'Đào tạo digital marketing cho team Fdeli, tập trung vào social media marketing, content strategy và performance analytics.',
            category: 'Thương mại điện tử',
            status: 'completed',
            image: '/Projects/Fdeli.webp',
            slug: 'fdeli-digital-marketing',
            technologies: ['Social Media Marketing', 'Content Creation', 'SEO/SEM', 'Analytics'],
            mentors: [
              { id: '8', name: 'Đặng Doãn Minh', avatar: '/Mentors/DDM.webp' }
            ]
          },
          {
            id: '6',
            title: 'Tam Châu - Agile Project Management',
            description: 'Triển khai phương pháp quản lý dự án Agile cho công ty Tam Châu, nâng cao hiệu suất làm việc và delivery quality.',
            category: 'Tư vấn',
            status: 'completed',
            image: '/Projects/Tam-Chau.webp',
            slug: 'tam-chau-agile-management',
            technologies: ['Agile Methodology', 'Scrum Framework', 'Team Leadership'],
            mentors: [
              { id: '9', name: 'Hoàng Châu Long', avatar: '/Mentors/HCL.webp' }
            ]
          }
        ]
        
        return mockProjects
      }
      
      console.log('✅ Projects fetched successfully:', data?.length || 0, 'records')
      return data || []
    } catch (error) {
      console.error('❌ Error fetching projects:', error)
      return []
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
        // If table doesn't exist or error, fallback to mock data
        console.log('⚠️ Supabase error, returning mock data for testing...')
        return getMockBlogPosts()
      }
      
      // If no data from Supabase, return mock data for testing
      if (!data || data.length === 0) {
        console.log('⚠️ No blog posts from Supabase, returning mock data for testing...')
        return getMockBlogPosts()
      }
      
      // Transform database data to match BlogPost interface
      const blogPosts: BlogPost[] = data.map((post: any) => ({
        id: post.id.toString(),
        title: post.title,
        content: post.details_blog,
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
      // Return mock data as fallback
      return getMockBlogPosts()
    }
  }
}

// Helper function to get mock blog posts
function getMockBlogPosts(): BlogPost[] {
  return [
    {
      id: '1',
      title: 'Khám phá phương pháp ASK - Công cụ mạnh mẽ để nâng cao hiệu quả giao tiếp',
      content: 'Phương pháp ASK (Acknowledge - Support - Know) là một trong những công cụ giao tiếp hiệu quả nhất trong môi trường doanh nghiệp...',
      excerpt: 'Tìm hiểu về phương pháp ASK và cách ứng dụng trong giao tiếp kinh doanh để xây dựng mối quan hệ bền vững với khách hàng và đối tác.',
      image: '/News/ASK.webp',
      author: 'Đặng Doãn Minh',
      author_avatar: '/Mentors/DDM.webp',
      category: 'Kỹ năng mềm',
      slug: 'phuong-phap-ask-giao-tiep-hieu-qua',
      published_at: '2024-09-15T10:00:00Z',
      publish_date: '2024-09-15T10:00:00Z',
      read_time: '5 phút đọc',
      tags: ['Giao tiếp', 'Kỹ năng mềm', 'ASK Method']
    },
    {
      id: '2',
      title: 'Ikigai - Tìm kiếm mục đích sống và ý nghĩa trong công việc',
      content: 'Ikigai là triết lý sống của người Nhật, giúp chúng ta tìm ra lý do tồn tại và động lực làm việc mỗi ngày...',
      excerpt: 'Khám phá triết lý Ikigai từ Nhật Bản và cách áp dụng để tìm ra đam mê thực sự, xác định mục tiêu cuộc sống và sự nghiệp.',
      image: '/News/ikigai.webp',
      author: 'Hoàng Châu Long',
      author_avatar: '/Mentors/HCL.webp',
      category: 'Phát triển bản thân',
      slug: 'ikigai-muc-dich-song-cong-viec',
      published_at: '2024-09-12T14:30:00Z',
      publish_date: '2024-09-12T14:30:00Z',
      read_time: '7 phút đọc',
      tags: ['Ikigai', 'Phát triển bản thân', 'Mục đích sống']
    },
    {
      id: '3',
      title: 'Kaizen - Phương pháp cải tiến liên tục trong quản lý và phát triển cá nhân',
      content: 'Kaizen không chỉ là phương pháp quản lý mà còn là cách sống, giúp chúng ta không ngừng cải thiện bản thân...',
      excerpt: 'Tìm hiểu về triết lý Kaizen và cách áp dụng nguyên tắc cải tiến liên tục vào công việc và cuộc sống hàng ngày.',
      image: '/News/kaizen.webp',
      author: 'Lê Ngọc Thành Công',
      author_avatar: '/Mentors/LNTC.webp',
      category: 'Quản trị Nhân sự',
      slug: 'kaizen-cai-tien-lien-tuc',
      published_at: '2024-09-10T09:15:00Z',
      publish_date: '2024-09-10T09:15:00Z',
      read_time: '6 phút đọc',
      tags: ['Kaizen', 'Cải tiến', 'Quản lý']
    },
    {
      id: '4',
      title: 'Trainer vs Mentor vs Coach - Phân biệt vai trò và chọn đúng phương pháp phát triển',
      content: 'Trong thế giới phát triển nhân sự hiện đại, việc hiểu rõ sự khác biệt giữa Trainer, Mentor và Coach là vô cùng quan trọng...',
      excerpt: 'Phân tích chi tiết sự khác biệt giữa ba vai trò quan trọng trong phát triển nhân sự và cách chọn phương pháp phù hợp.',
      image: '/News/trainer-mentor-coach.webp',
      author: 'Nguyễn Công Tiến',
      author_avatar: '/Mentors/NCT.webp',
      category: 'Coaching & Mentoring',
      slug: 'trainer-mentor-coach-phan-biet',
      published_at: '2024-09-08T16:45:00Z',
      publish_date: '2024-09-08T16:45:00Z',
      read_time: '8 phút đọc',
      tags: ['Trainer', 'Mentor', 'Coach', 'Phát triển nhân sự']
    }
  ]
}

// Client API for user operations
export const apiClient = {
  register: async (userData: RegisterData) => {
    try {
      const supabase = createClient()
      
      // First, create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
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
        console.error('Auth registration error:', authError)
        // If Supabase auth fails, try to insert directly into users table
        return await registerInUsersTable(userData)
      }

      // If auth succeeds, also try to save to users table for additional data storage
      if (authData.user) {
        try {
          const { error: userTableError } = await supabase
            .from('users')
            .insert([
              {
                id: authData.user.id,
                email: userData.email,
                name: userData.name,
                fullName: userData.fullName || userData.name,
                phone: userData.phone,
                university: userData.university,
                major: userData.major,
                role: 'user',
                status: 'active',
                avatar: null,
                password: null, // Don't store password in users table when using auth
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            ])

          if (userTableError) {
            console.warn('Could not save to users table:', userTableError)
            // Continue anyway as auth registration succeeded
          } else {
            console.log('User data saved to users table successfully')
          }
        } catch (userTableError) {
          console.warn('Users table not accessible, continuing with auth only')
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
      console.error('Registration error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed'
      }
    }
  }
}

// Helper function for direct users table registration
async function registerInUsersTable(userData: RegisterData) {
  try {
    const supabase = createClient()
    
    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', userData.email)
      .single()

    if (existingUser) {
      return {
        success: false,
        error: 'Email đã được sử dụng'
      }
    }

    // Insert new user
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          email: userData.email,
          name: userData.name,
          fullName: userData.fullName || userData.name,
          phone: userData.phone,
          university: userData.university,
          major: userData.major,
          role: 'user',
          status: 'active',
          avatar: null,
          password: userData.password, // Store password when not using auth
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data: {
        user: data,
        session: null
      }
    }
  } catch (error) {
    console.error('Users table registration error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed'
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
      
      // Try to get additional user data from users table if exists
      try {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single()
          
        if (userData) {
          console.log('✅ Found additional user data in users table')
          // Merge auth data with users table data
          return {
            success: true,
            data: {
              user: {
                ...authData.user,
                user_metadata: {
                  ...authData.user.user_metadata,
                  full_name: userData.fullName || userData.name || authData.user.user_metadata?.full_name,
                  phone: userData.phone || authData.user.user_metadata?.phone,
                  university: userData.university || authData.user.user_metadata?.university,
                  major: userData.major || authData.user.user_metadata?.major,
                  role: userData.role || authData.user.user_metadata?.role || 'user'
                }
              },
              session: authData.session
            }
          }
        }
      } catch (userTableError) {
        console.log('⚠️ Could not fetch additional user data, using auth data only')
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
        // If we have an authenticated user, try to get additional data from users table
        try {
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', user.email)
            .single()

          if (!error && userData) {
            return {
              id: user.id,
              email: user.email || '',
              name: userData.name || user.user_metadata?.full_name || '',
              fullName: userData.fullName || user.user_metadata?.full_name || '',
              avatar: userData.avatar || user.user_metadata?.avatar_url,
              phone: userData.phone,
              university: userData.university,
              major: userData.major,
              role: userData.role,
              status: userData.status
            }
          }
        } catch (userTableError) {
          console.log('Users table not accessible, using auth data only')
        }

        // Fallback to auth data only
        return {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.full_name || '',
          fullName: user.user_metadata?.full_name || '',
          avatar: user.user_metadata?.avatar_url
        }
      }
      
      return null
    } catch (error) {
      console.error('Get current user error:', error)
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