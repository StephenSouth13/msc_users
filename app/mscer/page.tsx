'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Star, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { api, MSCer } from "@/lib/api-supabase"

export default function MSCerPage() {
  const [mscers, setMscers] = useState<MSCer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMscers = async () => {
      try {
        setLoading(true)
        const data = await api.getMSCer()
        // Sắp xếp theo order để đảm bảo thứ tự như CMS
        setMscers(data.sort((a, b) => (a.order || 0) - (b.order || 0)))
      } catch (error) {
        console.error("❌ Error fetching MSCers:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchMscers()
  }, [])

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 pt-32 pb-24 font-sans">
      {/* --- Header Section --- */}
      <section className="container mx-auto px-6 mb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4 italic">
            Đội ngũ MSCers
          </h1>
          <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full mb-8"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl mx-auto">
            Kết nối cùng chúng tôi thông qua các chương trình đào tạo và lộ trình phát triển năng lực chuyên sâu.
          </p>
        </motion.div>
      </section>

      {/* --- Grid Profiles --- */}
      <section className="container mx-auto px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Đang tải dữ liệu học viên...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto items-stretch">
            <AnimatePresence>
              {mscers.map((mscer, index) => (
                <motion.div
                  key={mscer.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -12 }}
                  className="flex"
                >
                  <Card className="flex flex-col w-full border-none bg-white dark:bg-slate-900 rounded-[3rem] shadow-[0_15px_50px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(37,99,235,0.15)] transition-all duration-500 overflow-hidden group border border-slate-100 dark:border-slate-800">
                    <CardContent className="p-10 md:p-12 flex flex-col items-center text-center h-full">
                      
                      {/* Avatar chuẩn mẫu với Star Badge xanh dương */}
                      <div className="relative mb-10 shrink-0">
                        <div className="relative w-44 h-44 rounded-full p-1 bg-white dark:bg-slate-800 shadow-xl overflow-hidden border border-slate-100">
                          <Image
                            src={mscer.avatar_url || '/MSCers/default.webp'}
                            alt={mscer.full_name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>
                        {/* Ngôi sao Badge xanh dương chuẩn vị trí ảnh mẫu */}
                        <div className="absolute bottom-2 right-2 bg-[#3b82f6] p-2.5 rounded-full border-[4px] border-white dark:border-slate-900 shadow-lg text-white">
                          <Star size={18} className="fill-white" />
                        </div>
                      </div>

                      {/* Container thông tin - Dùng flex-grow để căn đều đáy */}
                      <div className="w-full flex flex-col flex-grow">
                        {/* Tên MSCer */}
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-3">
                          {mscer.full_name}
                        </h3>

                        {/* Chức danh màu xanh dương */}
                        <p className="text-[#3b82f6] font-extrabold text-lg uppercase tracking-wider mb-6">
                          {mscer.position}
                        </p>

                        {/* Testimonial / Achievement Summary */}
                        <div className="flex-grow flex items-center justify-center mb-10">
                          <blockquote className="text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed italic font-medium">
                            "{mscer.testimonial || mscer.achievement_summary}"
                          </blockquote>
                        </div>

                        {/* Nút bấm chuẩn UI Blue Executive - Luôn thẳng hàng nhờ flex-grow */}
                        <div className="w-full mt-auto">
                          <Link href={`/mscer/${mscer.slug}`} className="block">
                            <Button className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-2xl h-16 text-lg font-bold shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300 gap-2">
                              Xem Hồ Sơ <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  )
}