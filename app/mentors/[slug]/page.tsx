'use client'

import { useState, useEffect } from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Users, BookOpen, ChevronRight, GraduationCap, Briefcase, Sparkles, Loader2, Award, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api, Mentor } from "@/lib/api-supabase"

export default function MentorsPage() {
  const [activeTab, setActiveTab] = useState('faculty')
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true)
        const data = await api.getMentors()
        setMentors(data.sort((a, b) => (a.order || 0) - (b.order || 0)))
      } catch (error) {
        console.error("❌ Error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchMentors()
  }, [])

  const teachingMethods = [
    { 
      icon: GraduationCap, 
      title: "10% - Học tập chính quy", 
      text: "Nắm vững kiến thức nền tảng và các mô hình quản trị tiên tiến thông qua bài giảng chuyên sâu từ các chuyên gia.",
      color: "from-blue-600 to-indigo-600"
    },
    { 
      icon: Users, 
      title: "20% - Học hỏi xã hội", 
      text: "Tương tác, thảo luận và nhận sự dẫn dắt (mentoring) trực tiếp từ những người đi trước giàu kinh nghiệm.",
      color: "from-teal-500 to-emerald-500"
    },
    { 
      icon: Briefcase, 
      title: "70% - Học qua trải nghiệm", 
      text: "Áp dụng kiến thức vào dự án thực tế, giải quyết các bài toán doanh nghiệp để hình thành năng lực thực chiến.",
      color: "from-orange-500 to-red-500"
    }
  ]

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      
      {/* --- HERO SECTION: ĐỒNG BỘ GIAO DIỆN TRANG ĐÀO TẠO --- */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-900 text-white relative overflow-hidden">
        <div className="container relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 font-serif tracking-tight uppercase"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              Ban Giảng Huấn
            </motion.h1>
            <motion.p 
              className="text-xl text-blue-100 mb-10 leading-relaxed italic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              "Nơi hội tụ những nhà lãnh đạo, chuyên gia đầu ngành mang tâm thế phụng sự và khát vọng chuyển giao tri thức."
            </motion.p>

            {/* Statistics Row - Giống UI trang Đào tạo */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/10 pt-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-300">20+</div>
                <div className="text-sm text-blue-200 uppercase tracking-widest font-bold">Chuyên gia</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-300">15+</div>
                <div className="text-sm text-blue-200 uppercase tracking-widest font-bold">Năm kinh nghiệm</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-300">100%</div>
                <div className="text-sm text-blue-200 uppercase tracking-widest font-bold">Tâm huyết</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-300">Top-tier</div>
                <div className="text-sm text-blue-200 uppercase tracking-widest font-bold">Chuyên môn</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
      </section>

      {/* --- STICKY TABS: ĐIỀU HƯỚNG --- */}
      <section className="sticky top-[72px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md z-30 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="container mx-auto py-4 flex justify-center gap-3 md:gap-4 px-4 overflow-x-auto">
          {[
            { id: 'faculty', label: 'Ban Giảng Huấn', icon: Users },
            { id: 'methods', label: 'Phương pháp 70-20-10', icon: BookOpen },
            { id: 'successors', label: 'Phát triển Kế thừa', icon: Sparkles },
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              className={`rounded-xl px-6 h-11 font-bold uppercase text-[11px] tracking-wider transition-all duration-300 ${
                activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400'
              }`}
            >
              <tab.icon className="mr-2 h-4 w-4" /> {tab.label}
            </Button>
          ))}
        </div>
      </section>

      <main className="container mx-auto py-20 px-4">
        <AnimatePresence mode="wait">
          
          {/* TAB: BAN GIẢNG HUẤN (GRID MENTORS) */}
          {activeTab === 'faculty' && (
            <motion.div key="faculty" variants={containerVariants} initial="hidden" animate="visible" exit={{ opacity: 0 }}>
              {loading ? (
                <div className="flex flex-col items-center py-20">
                  <Loader2 className="animate-spin text-blue-600 h-10 w-10 mb-4" />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Đang kết nối danh sách chuyên gia...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {mentors.map((mentor) => (
                    <motion.div key={mentor.id} variants={itemVariants}>
                      <Card className="h-full flex flex-col group bg-white dark:bg-gray-800 border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] overflow-hidden text-center border-gray-100">
                        <CardContent className="p-10 flex flex-col items-center h-full">
                          {/* Avatar Executive Style */}
                          <div className="relative w-44 h-44 mb-8">
                            <div className="absolute inset-0 rounded-full border-[6px] border-gray-50 dark:border-gray-700 shadow-xl overflow-hidden bg-white">
                              <Image 
                                src={mentor.avatar_url || "/Mentors/default.webp"} 
                                alt={mentor.full_name} fill 
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            </div>
                            <div className="absolute bottom-1 right-1 bg-blue-600 p-2.5 rounded-full border-4 border-white dark:border-gray-800 shadow-lg">
                              <Star size={14} className="fill-white text-white" />
                            </div>
                          </div>

                          <CardTitle className="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight group-hover:text-blue-600 transition-colors uppercase">
                            {mentor.full_name}
                          </CardTitle>
                          
                          <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-none px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                            {mentor.title}
                          </Badge>

                          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-10 leading-relaxed italic line-clamp-3 px-2">
                            "{mentor.organizations?.[0] || mentor.description}"
                          </p>

                          <div className="w-full mt-auto">
                            <Link href={`/mentors/${mentor.slug}`}>
                              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 rounded-2xl shadow-lg shadow-blue-500/20 transition-all gap-2 group/btn">
                                CHI TIẾT HỒ SƠ <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB: PHƯƠNG PHÁP (MÔ HÌNH 70-20-10) */}
          {activeTab === 'methods' && (
            <motion.div key="methods" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white uppercase tracking-tight mb-4 font-serif">Mô hình đào tạo chuẩn quốc tế</h2>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">Chúng tôi áp dụng mô hình 70-20-10 để tối ưu hóa khả năng hấp thụ tri thức.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {teachingMethods.map((item, idx) => (
                  <Card key={idx} className="border-none bg-gray-50 dark:bg-gray-800 rounded-[2.5rem] p-10 shadow-sm hover:shadow-xl transition-all duration-500 text-center group">
                    <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:rotate-6 transition-transform`}>
                      <item.icon className="text-white w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">{item.text}</p>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB: NHÂN SỰ KẾ THỪA */}
          {activeTab === 'successors' && (
             <motion.div key="successors" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-4xl mx-auto py-12">
                <div className="bg-blue-600 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl">
                  <Sparkles className="text-white w-10 h-10 animate-pulse" />
                </div>
                <h2 className="text-4xl font-bold mb-6 uppercase tracking-tight text-gray-900 dark:text-white font-serif">Phát triển tài năng kế thừa</h2>
                <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-10 italic">
                  "Chương trình chiến lược nhằm phát hiện, bồi dưỡng và đồng hành cùng thế hệ lãnh đạo trẻ, định hướng trở thành những nhân sự cốt cán trong hệ sinh thái MSC Center."
                </p>
                <Link href="/lien-he">
                  <Button size="lg" className="rounded-full px-12 h-14 bg-gray-900 hover:bg-blue-600 text-white font-bold uppercase text-xs tracking-widest transition-all">Nhận tư vấn lộ trình</Button>
                </Link>
             </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  )
}