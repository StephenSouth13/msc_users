'use client'

import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Users, ExternalLink, Github, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
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
      <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Đang tải dự án...</p>
        </div>
      </div>
    )
  }

  if (!project) notFound()

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'ongoing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'planning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
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
      <div className="container py-8">
        <div className="mb-8">
          <Link href="/du-an">
            <Button variant="ghost" className="hover:bg-white dark:hover:bg-gray-800 shadow-sm rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <article className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-blue-900/5 overflow-hidden border border-gray-100 dark:border-gray-700">
              {/* Hero Image */}
              <div className="relative h-[450px]">
                <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
                <div className="absolute bottom-10 left-10 right-10">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <Badge className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border-none">
                      {project.category}
                    </Badge>
                    <Badge className={`${getStatusColor(project.status)} px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border-none`}>
                      {getStatusText(project.status)}
                    </Badge>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-2xl">
                    {project.title}
                  </h1>
                </div>
              </div>

              <div className="p-10 space-y-12">
                {/* Section Mô tả */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <Calendar size={20} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Tổng quan dự án</h2>
                  </div>
                  <div className="prose prose-blue dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight, rehypeRaw]}>
                      {project.description || ''}
                    </ReactMarkdown>
                  </div>
                </section>

                {/* Section Đội ngũ chuyên gia (ĐÃ FIX LỖI TYPE) */}
                {project.mentors && project.mentors.length > 0 && (
                  <section className="pt-10 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                        <Award size={20} />
                      </div>
                      <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Đội ngũ chuyên gia</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {project.mentors.map((mentor: any, index: number) => (
                        <Link key={mentor.id || index} href={`/mentors/${mentor.slug}`}>
                          <Card className="group hover:border-blue-500 transition-all duration-300 overflow-hidden border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md">
                            <CardContent className="p-5 flex items-center gap-5">
                              <Avatar className="w-16 h-16 border-2 border-white dark:border-gray-900 shadow-md group-hover:scale-110 transition-transform">
                                <AvatarImage src={mentor.avatar_url} className="object-cover" />
                                <AvatarFallback className="bg-blue-50 text-blue-600 font-bold uppercase">
                                  {mentor.full_name?.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                  {mentor.full_name}
                                </h3>
                                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wider text-[10px] mt-1">
                                  {mentor.title || 'Chuyên gia phụ trách'}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                {/* Section Nội dung chi tiết */}
                {project.detailproject && (
                  <section className="pt-10 border-t border-gray-100 dark:border-gray-700">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-8">Chi tiết triển khai</h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none 
                      prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:font-black
                      prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-li:text-gray-600 dark:prose-li:text-gray-300
                      prose-img:rounded-3xl prose-img:shadow-2xl prose-blockquote:border-blue-500">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight, rehypeRaw]}>
                        {project.detailproject}
                      </ReactMarkdown>
                    </div>
                  </section>
                )}
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 sticky top-24">
              <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6">Thông tin bổ sung</h3>
              <div className="space-y-6">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Trạng thái</span>
                  <Badge className={`${getStatusColor(project.status)} w-fit px-3 border-none font-bold`}>{getStatusText(project.status)}</Badge>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lĩnh vực</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{project.category}</span>
                </div>
              </div>

              <div className="mt-10 space-y-3">
                <Link href="/lien-he" className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 font-bold shadow-lg shadow-blue-200 dark:shadow-none">
                    Liên hệ tư vấn
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}