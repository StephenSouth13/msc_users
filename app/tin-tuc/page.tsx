'use client'

import { motion, Variants } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, Clock, ArrowRight, Rss } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { api, BlogPost } from "@/lib/api-supabase"

export default function NewsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const blogPosts = await api.getBlogPosts() // Fetching posts
        setPosts(blogPosts || [])
      } catch (err) {
        setError('Có lỗi xảy ra khi tải bài viết.')
        console.error('Error fetching posts:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Ngày không xác định';
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: "easeOut" } 
    }
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-lg font-semibold text-gray-700 dark:text-gray-200">Đang tải trang Tin tức...</p>
        </div>
      </div>
    )
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-red-50 dark:bg-red-900/10 flex items-center justify-center text-center p-4">
        <div>
          <h2 className="text-2xl font-bold text-red-700 dark:text-red-400">Đã xảy ra lỗi</h2>
          <p className="text-red-600 dark:text-red-300 mt-2">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-6">
            Tải lại trang
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <motion.section 
        className="py-28 bg-gradient-to-r from-gray-900 to-gray-800 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div 
              className="inline-block bg-white/10 p-4 rounded-full mb-6 ring-4 ring-white/20"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            >
              <Rss className="h-10 w-10 text-white" />
            </motion.div>
            <motion.h1 
              className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight"
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            >
              Tin tức & Sự kiện
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-300 mx-auto max-w-2xl"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            >
              Cập nhật những thông tin, bài viết và sự kiện mới nhất từ MSC Center.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Posts Grid Section */}
      <main className="py-20">
        <div className="container mx-auto px-4">
          {posts.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {posts.map((post) => (
                <motion.div key={post.id} variants={itemVariants}>
                  <Link href={`/tin-tuc/${post.slug}`}>
                    <Card className="h-full flex flex-col group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <div className="relative aspect-h-9 aspect-w-16 overflow-hidden">
                        <Image 
                          src={post.image || '/placeholder-image.jpg'} 
                          alt={post.title} 
                          fill 
                          className="object-cover transition-transform duration-500 group-hover:scale-105" 
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                        />
                        <div className="absolute inset-0 bg-black/30"></div>
                      </div>

                      <CardContent className="p-5 flex flex-col flex-grow">
                        {post.category &&
                          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">{post.category}</p>
                        }
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-snug group-hover:text-blue-700 dark:group-hover:text-blue-400">
                          {post.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-grow text-sm">{post.excerpt}</p>
                        
                        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span className="font-medium truncate">{post.author || 'MSC Center'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(post.publish_date)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500 dark:text-gray-400">Chưa có bài viết nào để hiển thị.</p>
            </div>
          )}
        </div>
      </main>

    </div>
  )
}
