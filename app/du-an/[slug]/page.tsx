'use client'

import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Users, ExternalLink, Github } from "lucide-react"
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
        
        // Fetch current project
        const currentProject = await api.getProjectBySlug(params.slug)
        if (!currentProject) {
          notFound()
          return
        }
        setProject(currentProject)

        // Fetch related projects (same category)
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

  if (!project) {
    notFound()
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'ongoing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'planning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'Đã hoàn thành'
      case 'ongoing':
        return 'Đang thực hiện'
      case 'planning':
        return 'Đang lên kế hoạch'
      default:
        return 'Không xác định'
    }
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="container py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/du-an">
            <Button variant="ghost" className="hover:bg-gray-100 dark:hover:bg-gray-800">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách dự án
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              {/* Hero Image */}
              <div className="relative h-96">
                <Image 
                  src={project.image || "/placeholder.svg"} 
                  alt={project.title} 
                  fill 
                  className="object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <div className="flex items-center gap-2 mb-4">
                    {project.category && (
                      <Badge className="bg-blue-600 text-white">{project.category}</Badge>
                    )}
                    {project.status && (
                      <Badge className={getStatusColor(project.status)}>
                        {getStatusText(project.status)}
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    {project.title}
                  </h1>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-8">
                {/* Basic Description */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Mô tả dự án</h2>
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight, rehypeRaw]}
                      components={{
                        p: ({children}) => <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{children}</p>,
                        strong: ({children}) => <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>,
                        ul: ({children}) => <ul className="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">{children}</ul>,
                        li: ({children}) => <li className="mb-1">{children}</li>
                      }}
                    >
                      {project.description || ''}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Công nghệ sử dụng</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Detailed Content with Full Markdown Support */}
                {project.detailproject && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Chi tiết dự án</h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none
                      prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:font-bold
                      prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                      prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
                      prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded
                      prose-pre:bg-gray-900 prose-pre:text-gray-100
                      prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic
                      prose-ul:list-disc prose-ol:list-decimal
                      prose-li:text-gray-700 dark:prose-li:text-gray-300
                      prose-img:rounded-lg prose-img:shadow-md">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight, rehypeRaw]}
                        components={{
                          h1: ({children}) => <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 mt-8 first:mt-0">{children}</h1>,
                          h2: ({children}) => <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-6">{children}</h2>,
                          h3: ({children}) => <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 mt-5">{children}</h3>,
                          h4: ({children}) => <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 mt-4">{children}</h4>,
                          p: ({children}) => <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{children}</p>,
                          ul: ({children}) => <ul className="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal list-inside mb-4 text-gray-700 dark:text-gray-300">{children}</ol>,
                          li: ({children}) => <li className="mb-1">{children}</li>,
                          blockquote: ({children}) => (
                            <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg italic text-gray-600 dark:text-gray-400">
                              {children}
                            </blockquote>
                          ),
                          code: ({children, className}) => {
                            const isInline = !className;
                            return isInline ? 
                              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-gray-800 dark:text-gray-200">{children}</code> :
                              <code className={className}>{children}</code>
                          },
                          pre: ({children}) => <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
                          table: ({children}) => (
                            <div className="overflow-x-auto mb-4">
                              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                {children}
                              </table>
                            </div>
                          ),
                          th: ({children}) => (
                            <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              {children}
                            </th>
                          ),
                          td: ({children}) => (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                              {children}
                            </td>
                          ),
                          img: ({src, alt}) => (
                            <div className="my-6">
                              <Image 
                                src={src || '/placeholder.svg'} 
                                alt={alt || ''} 
                                width={800} 
                                height={400} 
                                className="rounded-lg shadow-md w-full h-auto"
                              />
                            </div>
                          ),
                          a: ({href, children}) => (
                            <a href={href} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline" target="_blank" rel="noopener noreferrer">
                              {children}
                            </a>
                          )
                        }}
                      >
                        {project.detailproject}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* Team Section */}
                {project.mentors && project.mentors.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Đội ngũ thực hiện</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.mentors.map((mentor, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {typeof mentor === 'string' ? mentor : mentor.name || 'Thành viên'}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {typeof mentor === 'object' ? mentor.role || 'Developer' : 'Developer'}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>

            {/* Related Projects */}
            {relatedProjects.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Dự án liên quan</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedProjects.map((relatedProject) => (
                    <Card key={relatedProject.id} className="hover:shadow-lg transition-shadow duration-300">
                      <div className="relative">
                        <Image
                          src={relatedProject.image || "/placeholder.svg"}
                          alt={relatedProject.title}
                          width={400}
                          height={200}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-4 right-4">
                          {relatedProject.status && (
                            <Badge className={getStatusColor(relatedProject.status)}>
                              {getStatusText(relatedProject.status)}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {relatedProject.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                          {relatedProject.description}
                        </p>
                        <Link href={`/du-an/${relatedProject.slug || relatedProject.id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            Xem chi tiết
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Thông tin dự án</h3>
              
              <div className="space-y-4">
                {project.status && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Trạng thái:</span>
                    <Badge className={getStatusColor(project.status)}>
                      {getStatusText(project.status)}
                    </Badge>
                  </div>
                )}
                
                {project.category && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Danh mục:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{project.category}</span>
                  </div>
                )}

                {project.mentors && project.mentors.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Thành viên:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{project.mentors.length} người</span>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-3">
                <Link href="/lien-he">
                  <Button className="w-full">
                    Liên hệ tham gia
                  </Button>
                </Link>
                <Link href="/du-an">
                  <Button variant="outline" className="w-full">
                    Xem tất cả dự án
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
