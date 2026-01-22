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
      <section className="container mx-auto px-6 relative z-10">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="text-blue-600 mb-4" size={48} />
            </motion.div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Đang tải dữ liệu chuyên gia...</p>
          </motion.div>
        ) : filteredMscers.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch"
            >
              <AnimatePresence mode="popLayout">
                {filteredMscers.map((mscer, index) => (
                  <motion.div
                    key={mscer.id}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    layout
                    className="flex"
                  >
                    <Card className="flex flex-col w-full border-none bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden group relative border border-slate-200/50 dark:border-slate-700/50">
                      {/* Decorative top accent */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <CardContent className="p-8 md:p-10 flex flex-col items-center text-center h-full">

                        {/* Enhanced Avatar with ring effect */}
                        <div className="relative mb-8 shrink-0">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="relative w-48 h-48 rounded-full p-1 bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-900/30 dark:to-purple-900/30 shadow-2xl overflow-hidden border-4 border-white dark:border-slate-800"
                          >
                            <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-slate-700">
                              <Image
                                src={mscer.avatar_url || '/MSCers/default.webp'}
                                alt={mscer.full_name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-125"
                              />
                            </div>
                          </motion.div>
                          {/* Animated Star Badge */}
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 360 }}
                            className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full border-4 border-white dark:border-slate-800 shadow-xl text-white"
                          >
                            <Star size={20} className="fill-white" />
                          </motion.div>
                        </div>

                        {/* Information Container */}
                        <div className="w-full flex flex-col flex-grow">
                          {/* Role Badge */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.08 + 0.1 }}
                            className="inline-flex items-center justify-center mb-4 mx-auto"
                          >
                            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 text-blue-700 dark:text-blue-300">
                              {mscer.position}
                            </span>
                          </motion.div>

                          {/* Name */}
                          <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
                            {mscer.full_name}
                          </h3>

                          {/* Testimonial / Achievement */}
                          <div className="flex-grow flex items-center justify-center mb-8">
                            <blockquote className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed italic font-medium line-clamp-4">
                              "{mscer.testimonial || mscer.achievement_summary || 'Chuyên gia tài năng trong lĩnh vực của mình'}"
                            </blockquote>
                          </div>

                          {/* View Profile Button */}
                          <div className="w-full mt-auto">
                            <Link href={`/mscer/${mscer.slug}`} className="block group/btn">
                              <motion.button
                                whileHover={{ y: -2 }}
                                whileTap={{ y: 0 }}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl h-14 text-base font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2 group"
                              >
                                Xem Hồ Sơ
                                <motion.div
                                  className="group-hover:translate-x-1 transition-transform"
                                >
                                  <ArrowRight size={20} />
                                </motion.div>
                              </motion.button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Result count */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mt-12"
            >
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Hiển thị <span className="font-bold text-slate-700 dark:text-slate-300">{filteredMscers.length}</span> chuyên gia
              </p>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-slate-500 dark:text-slate-400 text-lg">Không tìm thấy chuyên gia với chức danh này</p>
          </motion.div>
        )}
      </section>
    </div>
  )
}
