'use client'

import { createBrowserClient } from '@supabase/ssr'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/**
 * Khởi tạo Supabase Client cho Browser
 */
export function createClient() {
  return createBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)
}

export const supabase = createClient()

/**
 * // // Nguồn: HÀM HELPER QUAN TRỌNG
 * Hàm hỗ trợ lấy URL ảnh đầy đủ từ Supabase Storage.
 * Nếu path là 'folder/image.png', hàm sẽ trả về link https://...
 */
const getPublicUrl = (path: string | null | undefined) => {
  if (!path) return '/placeholder-avatar.jpg'; // Ảnh mặc định nếu dữ liệu rỗng
  if (path.startsWith('http')) return path;    // Nếu đã là link web thì giữ nguyên
  
  // Trả về link public từ bucket 'media' 
  // (Lưu ý: Nếu bạn đổi tên Bucket trong Supabase, hãy sửa chữ 'media' ở đây)
  const { data } = supabase.storage.from('media').getPublicUrl(path);
  return data.publicUrl;
};

// --- ĐỊNH NGHĨA TYPES (Data Models) ---

export interface MSCer {
  id: string;
  full_name: string;
  slug: string;
  company: string;
  position: string;
  avatar_url: string;
  cv_url?: string;
  achievement_summary: string;
  testimonial: string;
  graduation_year: string;
  promotion_path: string;
  social_impact: string;
  course_taken: string;
  skills: string[];
  achievements_list: string[];
  mentoring_content: string;
  background: {
    education: string;
    previous_role: string;
    experience: string;
  };
  is_active: boolean;
  is_director: boolean;
  order?: number;
}

export interface Mentor {
  id: string;
  full_name: string;
  slug: string;
  title: string;
  description: string;
  email: string;
  phone?: string;
  avatar_url: string;
  organizations?: string;
  company?: string;
  specialties: string[];
  practical_projects: string[];
  research_projects: string[];
  awards: string[];
  tech_business_achievements: string[];
  background: {
    education: string;
    experience: string;
  };
  is_active: boolean;
  order?: number;
}

export interface Program {
  id: string;
  title: string;
  description?: string;
  detailed_content?: string;
  highlights?: string[];
  duration?: string;
  price?: string;
  image?: string;
  slug?: string;
  level?: string;
  category?: string;
  students?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  detailproject?: string; 
  image?: string;
  video_url?: string;
  hashtags?: string;
  order_index?: number;
  seo_title?: string;
  technologies?: string[];
  featured?: boolean;
  author_ids?: string[];
  project_authors?: {
    name: string;
    avatar: string;
    profile_link: string;
    title?: string;
  }[];
  status?: 'ongoing' | 'completed' | 'planning';
  slug: string;
  category?: string;
  created_at?: string;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  fullName?: string;
  avatar?: string;
  phone?: string;
  university?: string;
  major?: string;
  role?: string;
  status?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  image?: string;
  category?: string;
  slug: string;
  publish_date: string;
  read_time?: string;
  authors: {
    full_name: string;
    avatar_url: string;
    slug: string;
    title?: string;
  }[];
  tags?: string[];
  views?: number;
}

// ==========================================
// 1. QUẢN LÝ XÁC THỰC (AuthAPI)
// ==========================================
export const authAPI = {
  getCurrentUser: async (): Promise<UserData | null> => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    
    return {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.full_name || user.email || 'Người dùng',
      fullName: user.user_metadata?.full_name,
      avatar: getPublicUrl(user.user_metadata?.avatar_url), // Xử lý avatar user
      phone: user.user_metadata?.phone,
      university: user.user_metadata?.university,
      major: user.user_metadata?.major
    };
  },

  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return {
      success: !error,
      data,
      error: error?.message
    };
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
};

// ==========================================
// 2. QUẢN LÝ DỮ LIỆU (API)
// ==========================================
export const api = {
  getMSCer: async (): Promise<MSCer[]> => {
    try {
      const { data, error } = await supabase
        .from('mscers')
        .select('*')
        .eq('is_active', true)
        .order('order', { ascending: true });
      if (error) throw error;
      // Trả về kèm xử lý Public URL ảnh
      return (data || []).map(m => ({ ...m, avatar_url: getPublicUrl(m.avatar_url) }));
    } catch (error) {
      console.error("❌ Error fetching MSCers:", error);
      return [];
    }
  },

  getMentors: async (): Promise<Mentor[]> => {
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .eq('is_active', true)
        .order('order', { ascending: true });
      if (error) throw error;
      return (data || []).map(m => ({ ...m, avatar_url: getPublicUrl(m.avatar_url) }));
    } catch (error) {
      return [];
    }
  },

  getProjects: async (): Promise<Project[]> => {
    try {
      const supabase = createClient();
      
      // 1. Fetch danh sách dự án (Ưu tiên order_index đã kéo thả ở Backend)
      const { data: projects, error: pError } = await supabase
        .from('projects')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false });

      if (pError) throw pError;

      // 2. Fetch danh sách Authors (Bỏ cột 'type' vì DB thực tế không có)
      const { data: authorsData } = await supabase
        .from('authors')
        .select('id, full_name, avatar_url, slug, title, position'); 

      // 3. Mapping dữ liệu Project + Authors
      const mappedProjects = projects.map((p: any) => {
        const matched = authorsData?.filter(a => p.author_ids?.includes(a.id)) || [];
        return {
          ...p,
          image: getPublicUrl(p.image), // Xử lý ảnh bìa dự án
          project_authors: matched.map(a => ({
            name: a.full_name,
            avatar: getPublicUrl(a.avatar_url), // Xử lý avatar chuyên gia
            profile_link: `/mentors/${a.slug}`, // Mặc định hướng về trang mentor
            title: a.title || a.position
          }))
        };
      });

      return mappedProjects as Project[];
    } catch (error) {
      console.error("❌ Error fetching projects:", error);
      return [];
    }
  },

  getProjectBySlug: async (slug: string): Promise<Project | null> => {
    try {
      const { data: project, error } = await supabase.from('projects').select('*').eq('slug', slug).single();
      if (error || !project) return null;

      if (project.author_ids && project.author_ids.length > 0) {
        const { data: authorsData } = await supabase
          .from('authors')
          .select('id, full_name, avatar_url, slug, title, position')
          .in('id', project.author_ids);
        
        project.project_authors = authorsData?.map(a => ({
          name: a.full_name,
          avatar: getPublicUrl(a.avatar_url),
          profile_link: `/mentors/${a.slug}`,
          title: a.title || a.position
        })) || [];
      }
      // Trả về project kèm xử lý ảnh bìa
      return { ...project, image: getPublicUrl(project.image) } as Project;
    } catch (error) {
      return null;
    }
  },

  getBlogPosts: async (): Promise<BlogPost[]> => {
    try {
      const { data, error } = await supabase.from('allblogposts').select('*').order('publish_date', { ascending: false });
      if (error) throw error;
      return (data || []).map((post: any) => ({
        ...post,
        id: post.id.toString(),
        authors: post.authors_details || [],
        publish_date: post.publish_date || post.created_at,
        read_time: post.read_time || '5 phút đọc',
        image: getPublicUrl(post.image)
      }));
    } catch (error) {
      return [];
    }
  },

  getBlogPostBySlug: async (slug: string): Promise<BlogPost | null> => {
    try {
      const { data, error } = await supabase.from('allblogposts').select('*').eq('slug', slug).single();
      if (error) return null;
      return {
        ...data,
        id: data.id.toString(),
        authors: data.authors_details || [],
        publish_date: data.publish_date || data.created_at,
        read_time: data.read_time || '5 phút đọc',
        image: getPublicUrl(data.image)
      } as BlogPost;
    } catch (error) {
      return null;
    }
  },

  getPrograms: async (): Promise<Program[]> => {
    try {
      const { data, error } = await supabase.from('programs').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(p => ({ ...p, image: getPublicUrl(p.image) }));
    } catch (error) {
      return [];
    }
  }
};

export default api;