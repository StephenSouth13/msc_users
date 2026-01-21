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
        // Sắp xếp theo order ngay tại FE để đảm bảo tính nhất quán
        setMentors(data.sort((a, b) => (a.order || 0) - (b.order || 0)))
      } catch (error) {
        console.error("❌ Error fetching mentors:", error)
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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950">
      {/* --- HERO SECTION: ĐẲNG CẤP TỔ CHỨC --- */}
      <section className="relative py-28 bg-[#0f172a] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
            <Badge className="bg-blue-500/20 text-blue-400 border-none px-6 py-2 rounded-full mb-8 uppercase text-[10px] font-black tracking-[0.3em]">
              Leadership Excellence
            </Badge>
            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter uppercase leading-none italic">
              BAN GIẢNG <span className="text-blue-500">HUẤN</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto font-medium italic leading-relaxed">
              "Nơi hội tụ những nhà lãnh đạo, chuyên gia đầu ngành mang tâm thế phụng sự và khát vọng chuyển giao tri thức."
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- STICKY TABS: ĐIỀU HƯỚNG MƯỢT MÀ --- */}
      <section className="sticky top-[79px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-30 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="container mx-auto py-4 flex justify-center gap-3 md:gap-6 px-4 overflow-x-auto custom-scrollbar">
          {[
            { id: 'methods', label: 'Phương pháp', icon: BookOpen },
            { id: 'faculty', label: 'Ban Giảng Huấn', icon: Users },
            { id: 'successors', label: 'Nhân sự Kế thừa', icon: Sparkles },
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              className={`rounded-full px-8 h-12 font-black uppercase text-[10px] tracking-widest transition-all duration-300 flex-shrink-0 ${
                activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 scale-105' 
                : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <tab.icon className="mr-2 h-4 w-4" /> {tab.label}
            </Button>
          ))}
        </div>
      </section>

      <main className="container mx-auto py-24 px-4">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: PHƯƠNG PHÁP (MÔ HÌNH 70-20-10) */}
          {activeTab === 'methods' && (
            <motion.div key="methods" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="max-w-6xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-6">Mô hình đào tạo chuẩn quốc tế</h2>
                <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">Chúng tôi tin rằng tri thức chỉ thực sự có giá trị khi được tôi luyện qua trải nghiệm thực tế.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {teachingMethods.map((item, idx) => (
                  <Card key={idx} className="border-none bg-white dark:bg-slate-900 rounded-[3rem] p-12 shadow-sm hover:shadow-2xl transition-all duration-500 text-center relative group">
                    <div className={`w-24 h-24 rounded-[2.5rem] bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-10 shadow-lg group-hover:scale-110 transition-transform`}>
                      <item.icon className="text-white w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight">{item.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{item.text}</p>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 2: BAN GIẢNG HUẤN (GRID MENTORS) */}
          {activeTab === 'faculty' && (
            <motion.div key="faculty" variants={containerVariants} initial="hidden" animate="visible" exit={{ opacity: 0 }}>
              {loading ? (
                <div className="flex flex-col items-center py-20">
                  <Loader2 className="animate-spin text-blue-600 h-12 w-12 mb-4" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang tải danh sách giảng huấn...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-stretch">
                  {mentors.map((mentor) => (
                    <motion.div key={mentor.id} variants={itemVariants} className="h-full">
                      <Card className="h-full flex flex-col group bg-white dark:bg-gray-900 border-none shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_70px_rgba(37,99,235,0.1)] transition-all duration-500 rounded-[3rem] overflow-hidden text-center border-slate-100 relative">
                        <CardContent className="p-12 flex flex-col items-center h-full">
                          {/* Avatar Executive Style */}
                          <div className="relative w-48 h-48 mb-10 flex-shrink-0">
                            <div className="absolute inset-0 rounded-full border-[8px] border-white dark:border-slate-800 shadow-2xl overflow-hidden bg-slate-50">
                              <Image 
                                src={mentor.avatar_url || "/Mentors/default.webp"} 
                                alt={mentor.full_name} fill 
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            </div>
                            <div className="absolute bottom-2 right-2 bg-blue-600 p-3 rounded-full border-4 border-white dark:border-slate-900 shadow-xl">
                              <Star size={16} className="fill-white text-white" />
                            </div>
                          </div>

                          <CardTitle className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter flex-shrink-0 group-hover:text-blue-600 transition-colors">
                            {mentor.full_name}
                          </CardTitle>
                          
                          <div className="min-h-[44px] flex items-center justify-center mb-6 flex-shrink-0">
                            <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-none px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
                              {mentor.title}
                            </Badge>
                          </div>

                          <p className="text-slate-500 dark:text-slate-400 font-medium mb-12 leading-relaxed italic line-clamp-3 flex-grow px-2">
                            {mentor.organizations?.[0] || mentor.description}
                          </p>

                          <div className="w-full mt-auto">
                            <Link href={`/mentors/${mentor.slug}`}>
                              <Button className="w-full bg-[#3b82f6] hover:bg-blue-600 text-white font-black h-16 rounded-[1.5rem] shadow-xl shadow-blue-500/20 active:scale-95 transition-all text-base gap-2 group/btn">
                                Xem Hồ Sơ <ChevronRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
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

          {/* TAB 3: NHÂN SỰ KẾ THỪA */}
          {activeTab === 'successors' && (
             <motion.div key="successors" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-4xl mx-auto py-12">
                <div className="bg-blue-600 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-blue-500/20">
                  <Sparkles className="text-white w-12 h-12 animate-pulse" />
                </div>
                <h2 className="text-5xl font-black mb-8 uppercase tracking-tighter text-slate-900 dark:text-white leading-none">Phát triển tài năng kế thừa</h2>
                <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium italic mb-12">
                  "Chương trình chiến lược nhằm phát hiện, bồi dưỡng và đồng hành cùng thế hệ lãnh đạo trẻ, định hướng trở thành những nhân sự cốt cán trong hệ sinh thái MSC Center."
                </p>
                <Link href="/lien-he">
                  <Button size="lg" className="rounded-full px-14 h-16 bg-slate-900 hover:bg-blue-600 font-black uppercase text-xs tracking-[0.2em] shadow-2xl">Nhận tư vấn lộ trình</Button>
                </Link>
             </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  )
}