'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Program, api } from '@/lib/api-supabase'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ProgramDetailPage() {
  const params = useParams()
  const [program, setProgram] = useState<Program | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const programs = await api.getPrograms()
        const foundProgram = programs.find(p => p.id === params.id || p.slug === params.id)
        setProgram(foundProgram || null)
      } catch (error) {
        console.error('Error fetching program:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProgram()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Đang tải chương trình...</p>
        </div>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Không tìm thấy chương trình</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">Chương trình bạn đang tìm kiếm không tồn tại.</p>
          <Link href="/dao-tao">
            <Button>Quay lại danh sách chương trình</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/dao-tao">
              <Button variant="outline" className="mb-4">← Quay lại danh sách</Button>
            </Link>
            
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{program.title}</h1>
            
            <div className="flex flex-wrap gap-4 mb-6">
              {program.level && (
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                  {program.level}
                </span>
              )}
              {program.category && (
                <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-sm">
                  {program.category}
                </span>
              )}
              {program.duration && (
                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm">
                  {program.duration}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {program.image && (
                <div className="mb-8">
                  <img 
                    src={program.image} 
                    alt={program.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="prose prose-lg dark:prose-invert max-w-none">
                <h2>Mô tả chương trình</h2>
                <p className="text-gray-700 dark:text-gray-300">{program.description}</p>
                
                {program.detailed_content && (
                  <>
                    <h2>Nội dung chi tiết</h2>
                    <div className="text-gray-700 dark:text-gray-300">
                      {program.detailed_content}
                    </div>
                  </>
                )}

                {program.highlights && program.highlights.length > 0 && (
                  <>
                    <h2>Điểm nổi bật</h2>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                      {program.highlights.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Thông tin khóa học</h3>
                
                <div className="space-y-4">
                  {program.price && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Học phí:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{program.price}</span>
                    </div>
                  )}
                  
                  {program.duration && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Thời gian:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{program.duration}</span>
                    </div>
                  )}
                  
                  {program.students && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Học viên:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{program.students}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  <Link href="/lien-he">
                    <Button className="w-full">Đăng ký ngay</Button>
                  </Link>
                  <Link href="/lien-he">
                    <Button variant="outline" className="w-full">Tư vấn miễn phí</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
