'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Star, ArrowRight, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { api, MSCer } from "@/lib/api-supabase"

const POSITIONS = ["GIÁM ĐỐC MSC", "PHÓ GIÁM ĐỐC", "TRƯỞNG BỘ MÔN", "GIÁO VIÊN", "HỖ TRỢ"]

export default function MSCerPage() {
  const [mscers, setMscers] = useState<MSCer[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null)

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

  const filteredMscers = selectedPosition
    ? mscers.filter(m => m.position === selectedPosition)
    : mscers

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 pt-32 pb-24 font-sans relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-200 dark:bg-pink-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* --- Header Section --- */}
      <section className="container mx-auto px-6 mb-20 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 px-4 py-2 rounded-full mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Sparkles size={16} className="text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Khám phá đội ngũ tài năng
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-6 italic leading-tight">
            Đội ngũ
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-3">
              MSCers
            </span>
          </h1>
          <div className="flex gap-2 justify-center mb-8">
            <div className="w-16 h-1.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
            <div className="w-12 h-1.5 bg-gradient-to-r from-purple-600 to-pink-400 rounded-full"></div>
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-medium text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Kết nối cùng chúng tôi thông qua các chương trình đào tạo và lộ trình phát triển năng lực chuyên sâu.
            <span className="block text-sm mt-2 text-slate-500 dark:text-slate-400">
              Hơn {mscers.length} chuyên gia giàu kinh nghiệm sẵn sàng hỗ trợ bạn
            </span>
          </p>
        </motion.div>
      </section>

      {/* --- Filter Section --- */}
      <section className="container mx-auto px-6 mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <Button
            onClick={() => setSelectedPosition(null)}
            variant={selectedPosition === null ? "default" : "outline"}
            className={`rounded-full px-6 py-2.5 font-bold transition-all ${
              selectedPosition === null
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl'
                : 'border-slate-300 dark:border-slate-600 hover:border-blue-500'
            }`}
          >
            Tất cả ({mscers.length})
          </Button>

          {Array.from(new Set(mscers.map(m => m.position))).map((position, idx) => (
            <Button
              key={position}
              onClick={() => setSelectedPosition(position)}
              variant={selectedPosition === position ? "default" : "outline"}
              className={`rounded-full px-6 py-2.5 font-bold transition-all ${
                selectedPosition === position
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl'
                  : 'border-slate-300 dark:border-slate-600 hover:border-blue-500'
              }`}
            >
              {position} ({mscers.filter(m => m.position === position).length})
            </Button>
          ))}
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
