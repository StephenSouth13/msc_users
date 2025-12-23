'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/api-supabase'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

// Trang quản trị để thêm dự án mới
export default function NewProjectPage() {
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  // State để lưu thông tin dự án từ form
  const [project, setProject] = useState({
    title: '',
    description: '',
    detailproject: '', // Thêm trường này
    image: '',
    technologies: '', // Nhập dưới dạng chuỗi, phân cách bằng dấu phẩy
    mentors: '',      // Nhập dưới dạng chuỗi, phân cách bằng dấu phẩy
    status: 'Đang phát triển',
    category: ''
  })
  const [loading, setLoading] = useState(false)

  // Xử lý khi có thay đổi trong input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProject(prev => ({ ...prev, [name]: value }))
  }

  // Xử lý khi submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Submitting form...');
    setLoading(true)

    // Chuyển đổi chuỗi technologies và mentors thành mảng
    const technologiesArray = project.technologies.split(',').map(item => item.trim()).filter(Boolean);
    const mentorsArray = project.mentors.split(',').map(item => item.trim()).filter(Boolean);

    const projectData = {
        ...project,
        technologies: technologiesArray,
        mentors: mentorsArray
      };

    console.log('Sending data to Supabase:', projectData);

    // Gọi API của Supabase để chèn dữ liệu
    const { error } = await supabase.from('projects').insert([projectData])

    setLoading(false)

    if (error) {
      console.error('Error inserting project:', error)
      toast({
        title: "Lỗi",
        description: `Không thể thêm dự án: ${error.message}`,
        variant: "destructive",
      })
    } else {
        console.log('Project inserted successfully!');
      toast({
        title: "Thành công!",
        description: "Dự án đã được thêm thành công.",
      })
      router.push('/admin') // Quay về trang admin sau khi thành công
      router.refresh() // Làm mới trang để cập nhật danh sách
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Thêm Dự Án Mới</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tiêu đề</label>
                <Input id="title" name="title" value={project.title} onChange={handleChange} required />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mô tả ngắn</label>
                <Textarea id="description" name="description" value={project.description} onChange={handleChange} required />
              </div>

              {/* Detail Project */}
              <div>
                <label htmlFor="detailproject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Chi tiết dự án</label>
                <Textarea id="detailproject" name="detailproject" value={project.detailproject} onChange={handleChange} rows={5} />
              </div>

              {/* Image URL */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL Hình ảnh</label>
                <Input id="image" name="image" value={project.image} onChange={handleChange} placeholder="/Projects/example.webp" />
              </div>

              {/* Technologies */}
              <div>
                <label htmlFor="technologies" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Công nghệ (phân cách bằng dấu phẩy)</label>
                <Input id="technologies" name="technologies" value={project.technologies} onChange={handleChange} placeholder="Next.js, Supabase, Tailwind CSS" />
              </div>

              {/* Mentors */}
              <div>
                <label htmlFor="mentors" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mentor (phân cách bằng dấu phẩy)</label>
                <Input id="mentors" name="mentors" value={project.mentors} onChange={handleChange} placeholder="DDM, HCL" />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lĩnh vực</label>
                <Input id="category" name="category" value={project.category} onChange={handleChange} required />
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Trạng thái</label>
                <Input id="status" name="status" value={project.status} onChange={handleChange} required />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>{loading ? 'Đang lưu...' : 'Thêm Dự Án'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
