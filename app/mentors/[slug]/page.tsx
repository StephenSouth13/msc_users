'use client'

import { useState, useEffect } from 'react'
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { 
  ArrowLeft, GraduationCap, Briefcase, Award, 
  Loader2, Star, BookOpen, Quote, Trophy, Rocket, 
  Building2, Wrench, Lightbulb, MapPin, Mail, ChevronRight, Globe, Linkedin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api, Mentor } from "@/lib/api-supabase"

export default function MentorDetailPage({ params }: { params: { slug: string } }) {
  const [mentor, setMentor] = useState<Mentor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true)
        const data = await api.getMentorBySlug(params.slug)
        if (data) setMentor(data)
      } catch (error) {
        console.error("❌ Error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [params.slug])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
    </div>
  )

  if (!mentor) notFound()

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 pb-24">
      
      {/* 1. HERO HEADER SECTION */}
      <section className="bg-slate-900 pt-32 pb-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent" />
        <div className="container max-w-7xl mx-auto px-6 relative z-10">
          <Link href="/mentors" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-400 font-black text-[10px] tracking-[0.3em] mb-12 transition-all group uppercase">
            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> Quay lại Ban Giảng Huấn
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="max-w-3xl">
              <Badge className="bg-blue-600 text-white border-none px-5 py-1.5 rounded-full font-black text-[10px] tracking-[0.2em] mb-8 uppercase shadow-lg shadow-blue-600/20">
                {mentor.title}
              </Badge>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-6 italic">
                {mentor.full_name}
              </h1>
              <div className="flex flex-wrap gap-8 text-slate-400 font-bold text-xs uppercase tracking-widest">
                <span className="flex items-center gap-2 text-blue-400"><MapPin size={16}/> TP. Hồ Chí Minh</span>
                <span className="flex items-center gap-2"><Mail size={16}/> {mentor.email || 'contact@msc.edu.vn'}</span>
              </div>
            </div>
            <div className="flex gap-4 pb-2">
               <Button asChild size="lg" className="rounded-2xl bg-white text-slate-900 hover:bg-blue-50 font-black px-10 h-16 shadow-2xl border-none transition-transform hover:-translate-y-1">
                  <Link href="/lien-he">KẾT NỐI MENTORING <ChevronRight className="ml-2" size={18}/></Link>
               </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT GRID */}
      <div className="container max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* CỘT TRÁI: FIXED INFO (Sticky on Laptop) */}
          <aside className="lg:col-span-4 space-y-10">
            <div className="sticky top-32 space-y-10">
              {/* Profile Image */}
              <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-2xl border-8 border-white dark:border-slate-900 bg-slate-200 group">
                 <Image src={mentor.avatar_url || '/Mentors/default.webp'} fill className="object-cover transition-transform duration-700 group-hover:scale-110" alt={mentor.full_name} />
              </div>

              {/* Core Specialties */}
              <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-sm border border-slate-100 dark:border-white/5">
                <h3 className="font-black uppercase text-[11px] text-slate-400 tracking-[0.3em] mb-8 flex items-center gap-3">
                  <Wrench size={16} className="text-blue-600" /> Chuyên môn đào tạo
                </h3>
                <div className="flex flex-wrap gap-3">
                  {mentor.specialties?.map((spec, i) => (
                    <Badge key={i} className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-none px-5 py-2.5 rounded-xl font-bold text-[11px]">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Social Connect */}
              <div className="flex gap-4">
                 <Button variant="outline" className="flex-1 h-14 rounded-2xl border-slate-200 hover:bg-blue-50 hover:text-blue-600 font-bold gap-2">
                    <Linkedin size={18} /> LinkedIn
                 </Button>
                 <Button variant="outline" className="w-14 h-14 rounded-2xl border-slate-200 hover:bg-slate-50">
                    <Globe size={18} />
                 </Button>
              </div>
            </div>
          </aside>

          {/* CỘT PHẢI: SCROLLING DETAILS */}
          <main className="lg:col-span-8 space-y-12 lg:pt-16">
            
            {/* Quote / Philosophy */}
            <section className="relative p-12 md:p-16 bg-blue-600 rounded-[3.5rem] text-white shadow-2xl shadow-blue-600/20 overflow-hidden">
              <Quote className="text-white/10 absolute top-10 right-10 w-32 h-32 rotate-12" />
              <div className="relative z-10">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 opacity-60">Triết lý giảng huấn</h2>
                <p className="text-2xl md:text-4xl font-medium leading-[1.3] italic tracking-tight">
                  "{mentor.description}"
                </p>
              </div>
            </section>

            {/* Organizations Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-white/5 flex flex-col justify-center">
                  <h3 className="text-xl font-black flex items-center gap-3 text-indigo-500 uppercase tracking-tighter mb-8 italic">
                    <GraduationCap size={24} /> Nền tảng học vấn
                  </h3>
                  <div className="text-sm leading-relaxed font-medium text-slate-500 whitespace-pre-line">
                    {mentor.background?.education}
                  </div>
               </div>
               <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-white/5 flex flex-col justify-center">
                  <h3 className="text-xl font-black flex items-center gap-3 text-emerald-500 uppercase tracking-tighter mb-8 italic">
                    <Briefcase size={24} /> Kinh nghiệm công tác
                  </h3>
                  <div className="text-sm leading-relaxed font-medium text-slate-500 whitespace-pre-line">
                    {mentor.background?.experience}
                  </div>
               </div>
            </section>

            {/* Research & Practical Work (Tab-like design) */}
            <section className="space-y-8">
               <div className="flex items-center gap-4">
                  <h3 className="text-3xl font-black uppercase tracking-tighter">Hoạt động <span className="text-blue-600">thực chiến</span></h3>
                  <div className="h-1 flex-grow bg-slate-100 dark:bg-white/5 rounded-full" />
               </div>
               
               <div className="space-y-6">
                  <div className="p-10 bg-slate-900 rounded-[3.5rem] text-white relative overflow-hidden">
                    <Rocket className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5" />
                    <h4 className="text-amber-400 font-black uppercase text-[10px] tracking-[0.3em] mb-10">Công trình áp dụng thực tiễn</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {mentor.practical_projects?.map((item, i) => (
                         <div key={i} className="flex gap-4 items-start p-5 bg-white/5 rounded-2xl border border-white/5">
                            <span className="text-blue-500 font-black text-xs">0{i+1}</span>
                            <p className="text-sm font-bold text-slate-300">{item}</p>
                         </div>
                       ))}
                    </div>
                  </div>

                  <div className="p-10 bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-white/5">
                    <h4 className="text-purple-500 font-black uppercase text-[10px] tracking-[0.3em] mb-10">Dự án & Đề tài nghiên cứu</h4>
                    <div className="space-y-4">
                       {mentor.research_projects?.map((item, i) => (
                         <div key={i} className="flex items-center gap-4 text-slate-600 dark:text-slate-400 group">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 transition-all group-hover:scale-150 shrink-0" />
                            <p className="text-sm font-medium">{item}</p>
                         </div>
                       ))}
                    </div>
                  </div>
               </div>
            </section>

            {/* Recognition & Awards */}
            <section className="bg-white dark:bg-slate-900 p-12 rounded-[4rem] shadow-sm border border-slate-100 dark:border-white/5">
               <div className="flex justify-between items-center mb-12">
                  <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-4">
                    <Trophy className="text-amber-500" size={32} /> Giải thưởng vinh danh
                  </h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {mentor.awards?.map((award, i) => (
                    <div key={i} className="flex gap-5 items-start">
                       <div className="p-3 bg-amber-50 rounded-2xl text-amber-500"><Award size={20} /></div>
                       <p className="text-base font-bold text-slate-700 dark:text-slate-300 leading-snug pt-1">{award}</p>
                    </div>
                  ))}
               </div>
            </section>

            {/* Bottom Connect CTA */}
            <section className="p-12 bg-slate-100 dark:bg-white/5 rounded-[3.5rem] text-center">
               <Building2 className="mx-auto mb-6 text-slate-400" size={40} />
               <h3 className="text-xl font-black mb-4 uppercase tracking-tight">Thành viên Ban Giảng Huấn MSC Center</h3>
               <p className="text-slate-500 dark:text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
                 Đóng góp trực tiếp vào việc xây dựng lộ trình phát triển năng lực và chuyển giao tri thức cho cộng đồng nhân sự kế thừa.
               </p>
            </section>

          </main>
        </div>
      </div>
    </div>
  )
}