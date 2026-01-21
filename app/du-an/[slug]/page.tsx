'use client'

import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Users, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api, Project } from "@/lib/api-supabase"
import { useEffect, useState } from "react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import 'highlight.js/styles/github.css'

interface Props {
  params: { slug: string }
}

export default function ProjectDetailPage({ params }: Props) {
  const [project, setProject] = useState<Project | null>(null)
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const currentProject = await api.getProjectBySlug(params.slug)
        if (!currentProject) {
          notFound()
          return
        }
        setProject(currentProject)

        const allProjects = await api.getProjects()
        const related = allProjects
          .filter((p) => p.id !== currentProject.id && p.category === currentProject.category)
          .slice(0, 3)
        setRelatedProjects(related)
      } catch (error) {
        console.error('Error fetching project data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (!project) notFound()

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'ongoing': return 'bg-blue-100 text-blue-800'
      case 'planning': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'completed': return 'Đã hoàn thành'
      case 'ongoing': return 'Đang thực hiện'
      case 'planning': return 'Đang lên kế hoạch'
      default: return 'Không xác định'
    }
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50 dark:bg-gray-900">
      <div className="container py-8 mx-auto px-4">
        <div className="mb-8">
          <Link href="/du-an">
            <Button variant="ghost" className="rounded-full shadow-sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="relative h-96">
                <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <div className="flex gap-2 mb-4">
                    {project.category && <Badge className="bg-blue-600">{project.category}</Badge>}
                    <Badge className={getStatusColor(project.status)}>{getStatusText(project.status)}</Badge>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white">{project.title}</h1>
                </div>
              </div>

              <div className="p-8">
                <section className="mb-10">
                  <h2 className="text-2xl font-bold mb-4">Mô tả dự án</h2>
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.description}</ReactMarkdown>
                  </div>
                </section>

                {project.technologies && project.technologies.length > 0 && (
                  <section className="mb-10">
                    <h3 className="text-xl font-bold mb-4">Công nghệ sử dụng</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, idx) => (
                        <Badge key={idx} variant="outline">{tech}</Badge>
                      ))}
                    </div>
                  </section>
                )}

                {project.detailproject && (
                  <section className="pt-10 border-t border-gray-100 dark:border-gray-700">
                    <h2 className="text-2xl font-black mb-8 uppercase tracking-tight">Chi tiết triển khai</h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight, rehypeRaw]}>
                        {project.detailproject}
                      </ReactMarkdown>
                    </div>
                  </section>
                )}
              </div>
            </article>

            {relatedProjects.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-8">Dự án liên quan</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedProjects.map((rp) => (
                    <Card key={rp.id} className="overflow-hidden group">
                      <div className="relative aspect-video">
                        <Image src={rp.image || "/placeholder.svg"} alt={rp.title} fill className="object-cover transition group-hover:scale-105" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold mb-2 line-clamp-1">{rp.title}</h3>
                        <Link href={`/du-an/${rp.slug}`}>
                          <Button variant="link" className="p-0 text-blue-600">Xem thêm</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-28 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-6 italic border-l-4 border-blue-600 pl-3">Thông tin dự án</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Trạng thái:</span>
                  <Badge className={getStatusColor(project.status)}>{getStatusText(project.status)}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Danh mục:</span>
                  <span className="font-bold">{project.category}</span>
                </div>
              </div>
              <Button className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 font-bold shadow-lg shadow-blue-100">
                Liên hệ tư vấn
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}