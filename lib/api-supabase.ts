'use client'

import { createBrowserClient } from '@supabase/ssr'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const supabase = createClient()
/**
 * Khởi tạo Supabase Client cho Browser
 */
export function createClient() {
  return createBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)
}

// --- ĐỊNH NGHĨA TYPES (Data Models) ---

// 1. Chuyên gia MSCer
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

// 2. Ban Giảng Huấn (Mentor) - MỚI BỔ SUNG
export interface Mentor {
  id: string;
  full_name: string;
  slug: string;
  title: string;       // PGS.TS, CEO...
  description: string; // Giới thiệu ngắn
  email: string;
  phone?: string;
  avatar_url: string;
  organizations?:string;
  company?: string;
  specialties: string[];
  practical_projects: string[]; // <--- Thêm dòng này
  research_projects: string[];  // <--- Thêm dòng này
  awards: string[];             // <--- Thêm dòng này
  tech_business_achievements: string[]; // <--- Thêm dòng này 
  background: {
    education: string;
    experience: string;
  };
  is_active: boolean;
  order?: number;
}

// 3. Khóa học (Program)
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

// 4. Dự án (Project)
export interface Project {
  id: string;
  title: string;
  description: string;
  detailproject?: string; 
  image?: string;
  technologies?: string[];
  mentor_ids?: string[]; // IDs của các mentor tham gia
  mentors?: any[];       // Chứa data chi tiết sau khi fetch
  status?: 'ongoing' | 'completed' | 'planning';
  slug: string;
  category?: string;
}

// 5. Tin tức (BlogPost)
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


// --- API CLIENT OBJECT ---

export const api = {
  // ==========================================
  // 1. QUẢN LÝ MSCERS
  // ==========================================
  getMSCer: async (): Promise<MSCer[]> => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('mscers')
        .select('*')
        .eq('is_active', true)
        .order('order', { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("❌ Error fetching MSCers:", error);
      return [];
    }
  },

  getMSCerBySlug: async (slug: string): Promise<MSCer | null> => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('mscers').select('*').eq('slug', slug).single();
      if (error) return null;
      return data as MSCer;
    } catch (error) {
      return null;
    }
  },

  // ==========================================
  // 2. QUẢN LÝ MENTORS (Ban Giảng Huấn) - MỚI BỔ SUNG
  // ==========================================
  getMentors: async (): Promise<Mentor[]> => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .eq('is_active', true)
        .order('order', { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("❌ Error fetching mentors:", error);
      return [];
    }
  },

  getMentorBySlug: async (slug: string): Promise<Mentor | null> => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('mentors').select('*').eq('slug', slug).single();
      if (error) return null;
      return data as Mentor;
    } catch (error) {
      return null;
    }
  },

  // ==========================================
  // 3. QUẢN LÝ DỰ ÁN
  // ==========================================
  getProjects: async (): Promise<Project[]> => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      return [];
    }
  },

  getProjectBySlug: async (slug: string): Promise<Project | null> => {
    try {
      const supabase = createClient();
      const { data: project, error } = await supabase.from('projects').select('*').eq('slug', slug).single();
      if (error) return null;

      if (project.mentor_ids && project.mentor_ids.length > 0) {
        const { data: mentorsData } = await supabase
          .from('mentors')
          .select('id, full_name, avatar_url, slug, title')
          .in('id', project.mentor_ids);
        project.mentors = mentorsData || [];
      }
      return project as Project;
    } catch (error) {
      return null;
    }
  },

  // ==========================================
  // 4. QUẢN LÝ TIN TỨC (Blog)
  // ==========================================
  getBlogPosts: async (): Promise<BlogPost[]> => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('allblogposts').select('*').order('publish_date', { ascending: false });
      if (error) throw error;
      return (data || []).map((post: any) => ({
        ...post,
        id: post.id.toString(),
        authors: post.authors_details || [],
        publish_date: post.publish_date || post.created_at,
        read_time: post.read_time || '5 phút đọc'
      }));
    } catch (error) {
      return [];
    }
  },

  getBlogPostBySlug: async (slug: string): Promise<BlogPost | null> => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('allblogposts').select('*').eq('slug', slug).single();
      if (error) return null;
      return {
        ...data,
        id: data.id.toString(),
        authors: data.authors_details || [],
        publish_date: data.publish_date || data.created_at,
        read_time: data.read_time || '5 phút đọc'
      } as BlogPost;
    } catch (error) {
      return null;
    }
  },

  getBlogPostsByCategory: async (category: string): Promise<BlogPost[]> => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('allblogposts').select('*').ilike('category', `%${category}%`).order('publish_date', { ascending: false });
      if (error) throw error;
      return (data || []).map((post: any) => ({
        ...post,
        authors: post.authors_details || [],
        publish_date: post.publish_date || post.created_at,
        read_time: post.read_time || '5 phút đọc'
      }));
    } catch (error) {
      return [];
    }
  },

  getTopPosts: async (): Promise<any[]> => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('allblogposts').select('id, title, slug, image, views, category, publish_date, read_time').order('views', { ascending: false }).limit(5);
      if (error) throw error;
      return data || [];
    } catch (error) {
      return [];
    }
  },

  // ==========================================
  // 5. QUẢN LÝ KHÓA HỌC
  // ==========================================
  getPrograms: async (): Promise<Program[]> => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('programs').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      return [];
    }
  }
};

export default api;