export interface Project {
  id: string
  title: string
  description: string
  detailproject?: string 
  image?: string
  technologies?: string[]
  // Cập nhật kiểu dữ liệu cho mentors
  mentors?: {
    id: string;
    full_name: string;
    avatar_url: string;
  }[]
  status?: 'ongoing' | 'completed' | 'planning'
  slug?: string
  category?: string
}