'use client'

import { motion, Variants } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Users, Target, TrendingUp, CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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
        const projects = await api.getProjects()
        setProjects(projects || [])
      } catch (err) {
        setError('An error occurred while fetching projects')
        console.error(err)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Đang tải dự án...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section - GIỮ NGUYÊN UI CŨ */}
      <motion.section 
        className="py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-900 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 className="text-5xl md:text-7xl font-bold mb-6 font-serif" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }}>
              Dự án Đã Triển Khai
            </motion.h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Khám phá các dự án đào tạo và phát triển thực tế mà MSC Center đã triển khai.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Stats Section - GIỮ NGUYÊN UI CŨ */}
      <section className="py-20 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-gray-800 shadow-md">
                  <stat.icon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                <p className="text-gray-600 dark:text-gray-300 text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => {
              const mentors = project.mentors || [];
              const maxDisplay = 2; // Hiển thị 2 avatar chính, còn lại gộp
              const displayMentors = mentors.slice(0, maxDisplay);
              const remaining = mentors.length - maxDisplay;

              return (
                <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <Card className="h-full flex flex-col group overflow-hidden border-2 border-transparent hover:border-blue-500 hover:shadow-2xl transition-all duration-300 rounded-2xl bg-white dark:bg-gray-800">
                    <CardHeader className="p-0">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image src={project.image || '/placeholder-project.jpg'} alt={project.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <Badge className="absolute top-4 left-4 text-sm bg-white/90 text-black dark:bg-gray-700 dark:text-gray-50 border-none">{project.category}</Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 flex flex-col flex-grow">
                      {/* Cố định chiều cao tiêu đề để grid luôn đều */}
                      <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-tight h-[4rem] line-clamp-2">
                        {project.title}
                      </CardTitle>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow line-clamp-3">
                        {project.description}
                      </p>

                      {/* PHẦN GỘP TÁC GIẢ SIÊU XỊN */}
                      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400 mb-3 tracking-widest flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                          Mentoring & Coaching
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {/* Avatar Stack */}
                            <div className="flex -space-x-3 items-center">
                              {displayMentors.map((m, i) => (
                                <Avatar key={i} className="h-8 w-8 border-2 border-white dark:border-gray-800 shadow-sm">
                                  <AvatarImage src={m.avatar_url} className="object-cover" />
                                  <AvatarFallback className="text-[10px] bg-blue-50 text-blue-600 font-bold">{m.full_name?.[0]}</AvatarFallback>
                                </Avatar>
                              ))}
                              
                              {remaining > 0 && (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <button className="h-8 w-8 rounded-full bg-slate-900 text-white border-2 border-white flex items-center justify-center text-[10px] font-bold hover:bg-blue-600 transition-all z-10 shadow-md">
                                      +{remaining}
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-64 p-4 rounded-2xl shadow-2xl border-none bg-white dark:bg-gray-800 z-[100]">
                                    <p className="text-[10px] font-bold uppercase text-gray-400 mb-3 tracking-widest">Danh sách Mentor</p>
                                    <div className="space-y-3">
                                      {mentors.map((m: any, idx: number) => (
                                        <Link key={idx} href={`/mentors/${m.slug}`} className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded-lg transition-colors">
                                          <Avatar className="h-7 w-7"><AvatarImage src={m.avatar_url}/></Avatar>
                                          <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{m.full_name}</span>
                                        </Link>
                                      ))}
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              )}
                            </div>
                            
                            {/* Hiển thị tên text rút gọn */}
                            <div className="flex flex-col">
                              <span className="text-[11px] font-bold text-gray-700 dark:text-gray-200 leading-none">
                                {mentors[0]?.full_name}
                              </span>
                              {mentors.length > 1 && (
                                <span className="text-[9px] text-gray-400 font-medium mt-0.5">& {mentors.length - 1} chuyên gia khác</span>
                              )}
                            </div>
                          </div>

                          <div className="text-[10px] font-bold text-gray-400 flex items-center gap-1 uppercase">
                             <Calendar size={12}/> 2025
                          </div>
                        </div>
                      </div>

                      <Link href={`/du-an/${project.slug}`} className="mt-6">
                        <Button className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-6 rounded-xl">
                          Xem chi tiết dự án <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"/>
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section - GIỮ NGUYÊN UI CŨ */}
      <section className="py-24 bg-white dark:bg-gray-800">
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white font-serif">Bạn có dự án cần triển khai?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
            Hãy để MSC Center trở thành đối tác đồng hành cùng tổ chức của bạn.
          </p>
          <Link href="/lien-he">
            <Button size="lg" className="bg-blue-800 hover:bg-blue-900 text-white px-10 py-7 rounded-xl font-bold">
              Tư vấn giải pháp <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}