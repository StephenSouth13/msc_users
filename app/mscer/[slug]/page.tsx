//D:\MSC\msc_users\app\mscer\[slug]\page.tsx
'use client'

import { useState, useEffect } from 'react'
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft, Trophy, TrendingUp, Heart,
  GraduationCap, Briefcase, FileText, Loader2, Wrench, Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { api, MSCer } from "@/lib/api-supabase"

export default function MSCerDetailPage({ params }: { params: { slug: string } }) {
  const [mscer, setMscer] = useState<MSCer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true)
        const data = await api.getMSCerBySlug(params.slug)
        if (data) setMscer(data)
      } catch (error) {
        console.error("❌ Error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [params.slug])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
      <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
    </div>
  )

  if (!mscer) notFound()

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-b from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 pb-20">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Nút quay lại xịn */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/mscer" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-xs mb-12 transition-all group">
            <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
            QUAY LẠI CỘNG ĐỒNG MSCERS
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* CỘT TRÁI: THÔNG TIN CÁ NHÂN */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="rounded-[3rem] border-none bg-[#2563eb] text-white p-10 relative overflow-hidden shadow-2xl shadow-blue-500/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="relative z-10 text-center">
                <div className="relative w-44 h-44 mx-auto mb-8">
                  <Image 
                    src={mscer.avatar_url || '/MSCers/default.webp'} 
                    fill 
                    className="rounded-full border-8 border-white/20 shadow-2xl object-cover" 
                    alt={mscer.full_name} 
                  />
                  <div className="absolute bottom-2 right-2 bg-amber-400 p-3 rounded-full border-4 border-[#2563eb] shadow-xl">
                    <Star size={18} className="fill-white text-white" />
                  </div>
                </div>
                <h1 className="text-3xl font-black leading-tight mb-2 tracking-tighter">{mscer.full_name}</h1>
                <p className="font-bold text-blue-100 uppercase text-[10px] tracking-[0.2em] mb-8">{mscer.position}</p>
                
                {mscer.cv_url && (
                  <Button asChild className="w-full bg-white text-blue-600 hover:bg-blue-50 rounded-2xl font-black h-14 shadow-xl border-none">
                    <a href={mscer.cv_url} target="_blank" rel="noopener noreferrer">
                      <FileText className="mr-2" size={18} /> TẢI HỒ SƠ NĂNG LỰC
                    </a>
                  </Button>
                )}
              </div>
            </Card>

            {/* Khối Kỹ năng chuyên môn */}
            <Card className="rounded-[2.5rem] border-none shadow-sm p-8 bg-white dark:bg-slate-900">
              <h3 className="font-black uppercase text-[10px] text-slate-400 tracking-[0.2em] mb-6 flex items-center gap-2">
                <Wrench size={14} className="text-blue-600" /> Kỹ năng chuyên môn
              </h3>
              <div className="flex flex-wrap gap-2">
                {mscer.skills?.map((skill: string) => (
                  <Badge key={skill} className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-none px-4 py-2 rounded-xl font-bold text-[11px]">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>

          {/* CỘT PHẢI: NỘI DUNG CHI TIẾT */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Lộ trình thăng tiến */}
            <section className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3 italic text-blue-600 uppercase tracking-tighter">
                <TrendingUp /> Lộ trình thăng tiến
              </h2>
              <div className="p-8 bg-blue-50/50 dark:bg-blue-900/20 rounded-[2rem] border-l-8 border-blue-600">
                <p className="text-xl font-medium leading-relaxed italic text-slate-700 dark:text-slate-200">
                  "{mscer.promotion_path}"
                </p>
              </div>
            </section>

            {/* Thành tựu & Học vấn */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="space-y-6">
                <h3 className="text-xl font-black flex items-center gap-2 text-amber-500 uppercase tracking-tighter">
                  <Trophy /> Thành tựu nổi bật
                </h3>
                <div className="space-y-4">
                  {mscer.achievements_list?.map((item: string, i: number) => (
                    <div key={i} className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex gap-4">
                      <span className="text-blue-600 font-black">0{i + 1}</span>
                      <p className="text-sm font-bold text-slate-600 dark:text-slate-400">{item}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-xl font-black flex items-center gap-2 text-indigo-500 uppercase tracking-tighter">
                  <GraduationCap /> Nền tảng học vấn
                </h3>
                <div className="p-8 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-[2.5rem] border-t-4 border-indigo-500 shadow-sm">
                  <p className="text-sm leading-loose font-medium text-slate-600 dark:text-slate-400 whitespace-pre-line">
                    {mscer.background?.education}
                  </p>
                </div>
              </section>
            </div>

            {/* Kinh nghiệm thực chiến */}
            <section className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-emerald-600 uppercase tracking-tighter">
                <Briefcase /> Kinh nghiệm thực chiến
              </h2>
              <div className="text-slate-600 dark:text-slate-400 font-medium leading-[2] whitespace-pre-line">
                {mscer.background?.experience}
              </div>
            </section>

            {/* Tác động xã hội */}
            <section className="bg-gradient-to-br from-[#f43f5e] to-[#e11d48] p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
               <h2 className="text-2xl font-black mb-6 flex items-center gap-3 uppercase tracking-tighter relative z-10"></h2>
                 <Heart className="fill-white" /> Tác động xã hội
               <p className="text-lg font-medium leading-relaxed italic relative z-10 opacity-95">
                 {mscer.social_impact}
               </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
