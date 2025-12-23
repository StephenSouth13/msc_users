'use client'

import { useEffect, useState } from 'react'
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Star, Award, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { api, MSCer } from "@/lib/api-supabase"

export default function MSCerPage() {
  const [mscers, setMscers] = useState<MSCer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMscers = async () => {
      try {
        setLoading(true)
        const data = await api.getMSCer()
        setMscers(data)
      } catch (error) {
        console.error("Error fetching MSCers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMscers()
  }, [])

  const successStats = [
    { label: "MSCer thành công", value: "5,000+", icon: Users },
    { label: "Doanh nghiệp đối tác", value: "100+", icon: Award },
    { label: "Câu chuyện truyền cảm hứng", value: "Hàng trăm", icon: Star },
  ]

  const getTestimonial = (mscer: MSCer) => {
    if (typeof mscer.content === 'object' && mscer.content !== null && 'testimonial' in mscer.content) {
      return mscer.content.testimonial;
    }
    return 'Hành trình tại MSC đã mở ra cho tôi nhiều cơ hội mới.';
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-900 text-white">
        <div className="container">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block bg-white/10 p-4 rounded-full mb-6">
              <Users className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-serif">Cộng đồng MSCer</h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Nơi hội tụ những câu chuyện thành công, những gương mặt ưu tú đã trưởng thành từ các chương trình đào tạo của MSC Center.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Success Stats */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {successStats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600 dark:text-blue-200" />
                </div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                <p className="text-gray-600 dark:text-gray-300 text-lg">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MSCers Profiles Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white font-serif">Câu Chuyện Thành Công</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Những MSCer tiêu biểu với hành trình phát triển sự nghiệp ấn tượng sau khi hoàn thành các chương trình đào tạo.
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center text-gray-500 dark:text-gray-400">Đang tải danh sách MSCer...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mscers.map((mscer, index) => (
                <motion.div
                  key={mscer.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full flex flex-col group overflow-hidden bg-white dark:bg-gray-800 hover:shadow-2xl transition-all duration-300 rounded-2xl text-center border dark:border-gray-700">
                    <CardContent className="p-8 flex flex-col flex-grow items-center">
                      <div className="relative mb-6">
                        <Image
                          src={mscer.avatar || '/MSCers/default.webp'}
                          alt={mscer.name}
                          width={128}
                          height={128}
                          className="rounded-full w-32 h-32 object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-blue-500 to-teal-400 p-2 rounded-full shadow-md">
                          <Star className="h-5 w-5 text-white fill-white" />
                        </div>
                      </div>
                      
                      <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">{mscer.name}</CardTitle>
                      <p className="text-blue-600 dark:text-blue-400 font-semibold text-base mb-4">{mscer.position}</p>
                      
                      <blockquote className="text-base text-gray-600 dark:text-gray-300 italic leading-relaxed mb-6 flex-grow">
                        "{getTestimonial(mscer)}"
                      </blockquote>
                      
                      <div className="mt-auto w-full">
                        <Button asChild className="w-full group-hover:bg-blue-700 transition-colors bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700">
                          <Link href={`/mscer/${mscer.id}`}>
                            Xem Hồ Sơ
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Join MSCer Community Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="container text-center">
           <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
           >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">Viết nên câu chuyện của riêng bạn</h2>
              <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
                Bắt đầu hành trình phát triển sự nghiệp cùng MSC Center và trở thành gương mặt thành công tiếp theo trong cộng đồng MSCer.
              </p>
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-10 py-6">
                <Link href="/dao-tao">
                  Khám phá các khóa học
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
           </motion.div>
        </div>
      </section>
    </div>
  )
}
