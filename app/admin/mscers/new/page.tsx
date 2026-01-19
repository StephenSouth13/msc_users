'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/api-supabase'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

// Trang quản trị để thêm hồ sơ MSCer mới
export default function NewMSCerPage() {
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  // State để lưu thông tin từ form
  const [mscer, setMscer] = useState({
    id: '',
    name: '',
    company: '',
    position: '',
    avatar: '',
    achievement: '',
    testimonial: '',
    graduationYear: '',
    promotion: '',
    socialImpact: '',
    course: '',
    skills: '', // Chuỗi, phân cách bởi dấu phẩy
    achievements: '', // Chuỗi, phân cách bởi dấu phẩy
    mentoring: '',
    background_education: '',
    background_previousRole: '',
    background_experience: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setMscer(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const skillsArray = mscer.skills.split(',').map(s => s.trim()).filter(Boolean);
    const achievementsArray = mscer.achievements.split(',').map(a => a.trim()).filter(Boolean);

    const { error } = await supabase.from('mscers').insert([
      {
        id: mscer.id,
        name: mscer.name,
        company: mscer.company,
        position: mscer.position,
        avatar: mscer.avatar,
        achievement: mscer.achievement,
        testimonial: mscer.testimonial,
        graduationYear: mscer.graduationYear,
        promotion: mscer.promotion,
        socialImpact: mscer.socialImpact,
        course: mscer.course,
        skills: skillsArray,
        achievements: achievementsArray,
        mentoring: mscer.mentoring,
        background: {
          education: mscer.background_education,
          previousRole: mscer.background_previousRole,
          experience: mscer.background_experience
        }
      }
    ])

    setLoading(false)

    if (error) {
      console.error('Error inserting MSCer:', error)
      toast({ title: "Lỗi", description: "Không thể thêm hồ sơ. Vui lòng thử lại.", variant: "destructive" })
    } else {
      toast({ title: "Thành công!", description: "Hồ sơ MSCer đã được thêm.", })
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Thêm Hồ Sơ MSCer Mới</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ID (slug) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ID (ví dụ: 'ten-cua-ban')</label>
                <Input name="id" value={mscer.id} onChange={handleChange} required />
              </div>

              {/* Tên */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tên</label>
                <Input name="name" value={mscer.name} onChange={handleChange} required />
              </div>

              {/* Công ty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Công ty</label>
                <Input name="company" value={mscer.company} onChange={handleChange} />
              </div>

              {/* Vị trí */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vị trí</label>
                <Input name="position" value={mscer.position} onChange={handleChange} />
              </div>

              {/* Avatar URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL Avatar</label>
                <Input name="avatar" value={mscer.avatar} onChange={handleChange} />
              </div>

              {/* Thành tựu nổi bật */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Thành tựu nổi bật</label>
                <Textarea name="achievement" value={mscer.achievement} onChange={handleChange} />
              </div>

              {/* Testimonial */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Testimonial</label>
                <Textarea name="testimonial" value={mscer.testimonial} onChange={handleChange} />
              </div>

              {/* Năm tốt nghiệp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Năm tốt nghiệp</label>
                <Input name="graduationYear" value={mscer.graduationYear} onChange={handleChange} />
              </div>

              {/* Lộ trình thăng tiến */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lộ trình thăng tiến</label>
                <Input name="promotion" value={mscer.promotion} onChange={handleChange} />
              </div>

              {/* Tác động xã hội */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tác động xã hội</label>
                <Textarea name="socialImpact" value={mscer.socialImpact} onChange={handleChange} />
              </div>

              {/* Khóa học */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Khóa học</label>
                <Input name="course" value={mscer.course} onChange={handleChange} />
              </div>

              {/* Kỹ năng */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kỹ năng (phân cách bằng dấu phẩy)</label>
                <Input name="skills" value={mscer.skills} onChange={handleChange} />
              </div>

              {/* Thành tích */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Thành tích (phân cách bằng dấu phẩy)</label>
                <Textarea name="achievements" value={mscer.achievements} onChange={handleChange} />
              </div>

              {/* Mentoring */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mentoring</label>
                <Textarea name="mentoring" value={mscer.mentoring} onChange={handleChange} />
              </div>

              {/* Nền tảng: Học vấn */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Học vấn</label>
                <Input name="background_education" value={mscer.background_education} onChange={handleChange} />
              </div>

               {/* Nền tảng: Vai trò trước đây */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vai trò trước đây</label>
                <Input name="background_previousRole" value={mscer.background_previousRole} onChange={handleChange} />
              </div>

               {/* Nền tảng: Kinh nghiệm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kinh nghiệm</label>
                <Textarea name="background_experience" value={mscer.background_experience} onChange={handleChange} />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>{loading ? 'Đang lưu...' : 'Thêm Hồ Sơ'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
