// src/components/ProjectCard.tsx

"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Users, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Project } from "@/lib/api-supabase"

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="h-full flex flex-col overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 group bg-white dark:bg-neutral-800 border-none">
      {/* PHẦN ẢNH DỰ ÁN */}
      <CardHeader className="p-0">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={project.image || '/placeholder.jpg'}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Lớp phủ gradient để nổi bật Badge */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
          
          <Badge className="absolute top-4 left-4 bg-white/95 dark:bg-neutral-900/90 text-blue-700 dark:text-blue-400 font-bold shadow-lg border-none px-3 py-1 text-[11px] uppercase tracking-wider">
            {project.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 flex flex-col flex-grow">
        {/* TIÊU ĐỀ & MÔ TẢ */}
        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
          {project.title}
        </CardTitle>
        <p className="text-gray-600 dark:text-neutral-400 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
          {project.description}
        </p>
        
<<<<<<< HEAD
        {/* PHẦN ĐỘI NGŨ MENTOR - THIẾT KẾ XỊN ĐẸP */}
        <div className="mt-auto pt-5 border-t border-gray-100 dark:border-neutral-700">
          <p className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-[0.15em] flex items-center gap-2 mb-3">
            <span className="flex h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            Mentoring & Coaching
          </p>
          
          <div className="flex flex-wrap gap-2.5">
            {project.mentors && project.mentors.length > 0 ? (
              project.mentors.map((mentor, index) => (
                <Link 
                  key={mentor.id || index} 
                  href={`/mentors/${mentor.slug}`} // Link chuẩn bạn yêu cầu
                  className="group/mentor relative flex items-center transition-all duration-300 active:scale-95"
                  onClick={(e) => e.stopPropagation()} // Tránh bị nhảy vào trang chi tiết dự án khi click vào mentor
                >
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-neutral-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-1 pr-3 rounded-full border border-gray-200 dark:border-neutral-700 group-hover/mentor:border-blue-300 dark:group-hover/mentor:border-blue-800 transition-all shadow-sm">
                    {/* Avatar nhỏ gọn */}
                    <div className="relative w-7 h-7 overflow-hidden rounded-full border-2 border-white dark:border-neutral-800 shadow-sm shrink-0">
                      <Image 
                        src={mentor.avatar_url || '/placeholder-avatar.jpg'} 
                        alt={mentor.full_name} 
                        fill 
                        sizes="28px"
                        className="object-cover transition-transform duration-500 group-hover/mentor:scale-115"
                      />
                    </div>
                    
                    {/* Tên Mentor & Tooltip chức danh ẩn */}
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-gray-800 dark:text-neutral-200 group-hover/mentor:text-blue-700 dark:group-hover/mentor:text-blue-400 transition-colors leading-none">
                        {mentor.full_name}
                      </span>
                    </div>
                  </div>

                  {/* Tooltip Chức danh (Hiện khi hover) */}
                  {mentor.title && (
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[9px] font-bold rounded shadow-xl opacity-0 group-hover/mentor:opacity-100 pointer-events-none transition-all duration-300 -translate-y-1 group-hover/mentor:translate-y-0 z-50 whitespace-nowrap">
                      {mentor.title}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-neutral-900 dark:bg-white rotate-45"></div>
                    </div>
                  )}
                </Link>
              ))
            ) : (
              <span className="text-[11px] text-gray-400 italic">Đang cập nhật chuyên gia...</span>
            )}
          </div>
=======
        <div className="mt-auto space-y-3">
            <div className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Người hướng dẫn:</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {Array.isArray(project.mentors) && project.mentors.length > 0 && project.mentors[0] !== '' ? (
                    project.mentors.map((mentorName: string, index: number) => (
                        <Badge key={index} variant="outline" className="font-normal bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200">
                            <Award className="h-3 w-3 mr-1.5" />
                            {mentorName}
                        </Badge>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">Chưa có thông tin</p>
                )}
            </div>

>>>>>>> a05a58dc4d60f7219407f17c7066bf57b15f0e95
        </div>
        
        {/* NÚT XEM CHI TIẾT */}
        <Link href={`/du-an/${project.slug || project.id}`} className="mt-6">
          <Button className="w-full bg-blue-800 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-bold rounded-xl h-11 group/btn shadow-lg shadow-blue-100 dark:shadow-none transition-all">
            Xem chi tiết dự án
            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
