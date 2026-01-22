'use client'

import { motion, Variants } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Users, Target, TrendingUp, CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { api, Project } from "@/lib/api-supabase"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const data = await api.getProjects()
        setProjects(data || [])
      } catch (err) {
        setError('Đã có lỗi xảy ra khi tải dữ liệu dự án.')
        console.error('Error fetching projects:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const stats = [
    { label: "Dự án tiêu biểu", value: `${projects.length}+`, icon: CheckCircle },
    { label: "Doanh nghiệp đối tác", value: "50+", icon: Target },
    { label: "Học viên được đào tạo", value: "5,000+", icon: Users },
    { label: "Lĩnh vực đào tạo", value: "10+", icon: TrendingUp },
  ]

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 font-medium">Đang tải dự án...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-lg font-bold">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4 rounded-xl">
            Thử lại
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <motion.section 
        className="py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-900 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 font-serif tracking-tight"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              DỰ ÁN ĐÃ TRIỂN KHAI
            </motion.h1>
            <motion.p 
              className="text-xl text-blue-100 mb-8 leading-relaxed opacity-90"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              Các dự án Mentoring & Coaching thực tế mà MSC Center đã triển khai.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container px-4 mx-auto">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {stats.map((stat, index) => (
              <motion.div key={index} className="text-center" variants={itemVariants}>
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-gray-800 shadow-lg">
                  <stat.icon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                <p className="text-gray-600 dark:text-gray-300 text-lg">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white font-serif uppercase tracking-tight">CÁC DỰ ÁN NỔI BẬT</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Từ các tập đoàn lớn đến đại học và cao đẳng, mỗi dự án là một câu chuyện thành công.
            </p>
          </motion.div>

          {projects.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {projects.map((project) => (
                <motion.div key={project.id} variants={itemVariants}>
                  <Card className="h-full flex flex-col group overflow-hidden border-2 border-transparent hover:border-blue-500 hover:shadow-2xl transition-all duration-300 rounded-[2rem] bg-white dark:bg-gray-800 dark:hover:border-blue-400">
                    <CardHeader className="p-0">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={project.image || '/placeholder-project.jpg'}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <Badge variant="secondary" className="absolute top-4 left-4 text-sm bg-white/95 text-black dark:bg-gray-700 dark:text-gray-50 shadow-sm border-none">
                          {project.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-8 flex flex-col flex-grow">
                      <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </CardTitle>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow line-clamp-3">
                        {project.description}
                      </p>
                      
                      <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Chuyên gia phụ trách:</p>
                        <div className="flex flex-wrap items-center gap-3">
                          {project.project_authors && project.project_authors.length > 0 ? (
                            project.project_authors.map((author: any, index: number) => (
                              <div key={index} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900/50 p-1.5 pr-3 rounded-full border border-gray-100 dark:border-gray-700">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm">
                                  <Image 
                                    src={author.avatar || '/placeholder-avatar.jpg'} 
                                    alt={author.name} 
                                    fill 
                                    className="object-cover"
                                  />
                                </div>
                                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{author.name}</span>
                              </div>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400 italic">Đang cập nhật nhân sự...</span>
                          )}
                        </div>
                      </div>

                      <Link href={`/du-an/${project.slug}`} className="mt-8">
                        <Button className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 group">
                          Xem chi tiết dự án 
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-[3rem] shadow-inner">
              <p className="text-xl text-gray-500 dark:text-gray-400 italic">Hiện tại chưa có dự án nào được công bố.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white dark:bg-gray-800">
        <div className="container px-4 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white font-serif uppercase tracking-tight">
              Bạn có dự án cần triển khai?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
              Hãy để MSC Center trở thành đối tác đồng hành, thiết kế chương trình đào tạo riêng biệt và hiệu quả cho tổ chức của bạn.
            </p>
            <Link href="/lien-he">
              <Button size="lg" className="h-16 px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-lg font-bold shadow-2xl shadow-blue-500/40">
                Liên hệ ngay
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}