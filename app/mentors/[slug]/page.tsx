'use client'

import { useState, useEffect } from 'react'
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { 
  ArrowLeft, Trophy, TrendingUp, Heart, 
  GraduationCap, Briefcase, Mail, Phone, Loader2, Wrench, Star, ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
      <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
    </div>
  )

  if (!mentor) notFound()

  return (
    <div className="min-h-screen pt-20 bg-white dark:bg-gray-950 pb-20">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <Link href="/mentors" className="inline-flex items-center gap-2 text-gray-400 hover:text-blue-600 font-bold text-xs mb-12 transition-all group">
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> 
          QUAY LẠI BAN GIẢNG HUẤN
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN: PERSONAL INFO */}
          <div className="lg:col-span-4 space-y-8">
            {/* Profile Card */}
            <Card className="rounded-[3rem] border-none bg-gradient-to-br from-blue-600 to-blue-700 text-white p-10 relative overflow-hidden shadow-2xl shadow-blue-500/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="relative z-10 text-center">
                {/* Avatar */}
                <div className="relative w-48 h-48 mx-auto mb-8">
                  <Image 
                    src={mentor.avatar_url || '/Mentors/default.webp'} 
                    fill 
                    className="rounded-full border-8 border-white/20 shadow-2xl object-cover" 
                    alt={mentor.full_name} 
                  />
                  <div className="absolute bottom-2 right-2 bg-amber-400 p-3 rounded-full border-4 border-blue-600 shadow-xl">
                    <Star size={18} className="fill-white text-white" />
                  </div>
                </div>
                
                <h1 className="text-4xl font-black leading-tight mb-2 tracking-tighter">{mentor.full_name}</h1>
                <p className="font-bold text-blue-100 uppercase text-[11px] tracking-[0.2em] mb-8">{mentor.title}</p>
                
                {/* Contact Info */}
                <div className="space-y-3 text-sm mb-8">
                  {mentor.email && (
                    <div className="flex items-center gap-2 justify-center text-blue-100 hover:text-white transition-colors">
                      <Mail size={14} />
                      <a href={`mailto:${mentor.email}`} className="hover:underline">{mentor.email}</a>
                    </div>
                  )}
                  {mentor.phone && (
                    <div className="flex items-center gap-2 justify-center text-blue-100 hover:text-white transition-colors">
                      <Phone size={14} />
                      <a href={`tel:${mentor.phone}`} className="hover:underline">{mentor.phone}</a>
                    </div>
                  )}
                </div>

                <Button asChild className="w-full bg-white text-blue-600 hover:bg-blue-50 rounded-2xl font-black h-14 shadow-xl border-none">
                  <Link href="/lien-he">
                    <ExternalLink className="mr-2" size={18} /> LIÊN HỆ MENTOR
                  </Link>
                </Button>
              </div>
            </Card>

            {/* Specialties */}
            {mentor.specialties && mentor.specialties.length > 0 && (
              <Card className="rounded-[2.5rem] border-none shadow-sm p-8 bg-white dark:bg-gray-900">
                <h3 className="font-black uppercase text-[10px] text-gray-400 dark:text-gray-500 tracking-[0.2em] mb-6 flex items-center gap-2">
                  <Wrench size={14} className="text-blue-600" /> Chuyên môn
                </h3>
                <div className="flex flex-wrap gap-2">
                  {mentor.specialties.map((specialty: string) => (
                    <Badge key={specialty} className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-none px-4 py-2 rounded-xl font-bold text-[11px]">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* RIGHT COLUMN: DETAILED CONTENT */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Description */}
            {mentor.description && (
              <section className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-800">
                <h2 className="text-2xl font-black mb-8 flex items-center gap-3 italic text-blue-600 uppercase tracking-tighter">
                  <TrendingUp /> Tiểu sử
                </h2>
                <div className="p-8 bg-blue-50/50 dark:bg-blue-900/20 rounded-[2rem] border-l-8 border-blue-600">
                  <p className="text-lg font-medium leading-relaxed text-gray-700 dark:text-gray-300">
                    {mentor.description}
                  </p>
                </div>
              </section>
            )}

            {/* Education & Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Education */}
              {mentor.background?.education && (
                <section className="space-y-6">
                  <h3 className="text-xl font-black flex items-center gap-2 text-indigo-500 uppercase tracking-tighter">
                    <GraduationCap /> Nền tảng học vấn
                  </h3>
                  <div className="p-8 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-[2.5rem] border-t-4 border-indigo-500 shadow-sm">
                    <p className="text-sm leading-loose font-medium text-gray-600 dark:text-gray-400 whitespace-pre-line">
                      {mentor.background.education}
                    </p>
                  </div>
                </section>
              )}

              {/* Experience */}
              {mentor.background?.experience && (
                <section className="space-y-6">
                  <h3 className="text-xl font-black flex items-center gap-2 text-emerald-500 uppercase tracking-tighter">
                    <Briefcase /> Kinh nghiệm chuyên sâu
                  </h3>
                  <div className="p-8 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-[2.5rem] border-t-4 border-emerald-500 shadow-sm">
                    <p className="text-sm leading-loose font-medium text-gray-600 dark:text-gray-400 whitespace-pre-line">
                      {mentor.background.experience}
                    </p>
                  </div>
                </section>
              )}
            </div>

            {/* Practical Projects */}
            {mentor.practical_projects && mentor.practical_projects.length > 0 && (
              <section className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-800">
                <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-orange-500 uppercase tracking-tighter">
                  <Trophy /> Dự án thực tiễn
                </h2>
                <div className="space-y-4">
                  {mentor.practical_projects.map((project: string, i: number) => (
                    <div key={i} className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex gap-4">
                      <span className="text-blue-600 font-black text-lg flex-shrink-0">0{i + 1}</span>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{project}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Research Projects */}
            {mentor.research_projects && mentor.research_projects.length > 0 && (
              <section className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-800">
                <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-purple-500 uppercase tracking-tighter">
                  <TrendingUp /> Dự án nghiên cứu
                </h2>
                <div className="space-y-4">
                  {mentor.research_projects.map((project: string, i: number) => (
                    <div key={i} className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex gap-4">
                      <span className="text-purple-600 font-black text-lg flex-shrink-0">0{i + 1}</span>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{project}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Awards */}
            {mentor.awards && mentor.awards.length > 0 && (
              <section className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-10 rounded-[3.5rem] border border-amber-100 dark:border-amber-800/30 shadow-sm">
                <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-amber-600 uppercase tracking-tighter">
                  <Trophy className="fill-amber-600" /> Giải thưởng & Công nhận
                </h2>
                <div className="space-y-4">
                  {mentor.awards.map((award: string, i: number) => (
                    <div key={i} className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-amber-100 dark:border-amber-800/30 shadow-sm flex gap-4">
                      <span className="text-amber-600 font-black text-lg flex-shrink-0">★</span>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{award}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Organizations */}
            {typeof mentor.organizations === 'string' && mentor.organizations && (
              <section className="bg-gradient-to-br from-blue-600 to-indigo-600 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                <h2 className="text-2xl font-black mb-6 flex items-center gap-3 uppercase tracking-tighter relative z-10">
                  <Briefcase className="fill-white" /> Tổ chức công tác
                </h2>
                <p className="text-lg font-medium leading-relaxed italic relative z-10 opacity-95 whitespace-pre-line">
                  {mentor.organizations}
                </p>
              </section>
            )}
          </div>
        </div>

        {/* Related Mentors */}
        <div className="mt-20 pt-12 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8 uppercase tracking-tighter">Các Mentor Khác</h2>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Link href="/mentors" className="text-blue-600 hover:underline font-bold">
              Xem danh sách đầy đủ Ban Giảng Huấn →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
