'use client'

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowRight, Rss, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { api, BlogPost } from "@/lib/api-supabase"

// ====================================
// ANIMATION VARIANTS
// ====================================
const containerVariants = { 
  hidden: { opacity: 0 }, 
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } } 
};
const itemVariants = { 
  hidden: { opacity: 0, y: 20 }, 
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } 
};

// ====================================
// HELPER COMPONENTS
// ====================================

// Component Card bài viết cho lưới phụ
const PostCard = ({ post }: { post: BlogPost }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Ngày không xác định';
    return new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  };

  return (
    <motion.div variants={itemVariants} className="h-full">
      <Link href={`/tin-tuc/${post.slug}`} className="block h-full">
        <Card className="h-full flex flex-col group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/60 hover:border-blue-500 dark:hover:border-blue-400">
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image 
              src={post.image || '/placeholder-image.jpg'} 
              alt={post.title} 
              fill 
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
          </div>
          <CardContent className="p-5 flex flex-col flex-grow">
            {post.category &&
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wider">{post.category}</p>
            }
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-snug group-hover:text-blue-700 dark:group-hover:text-blue-400">
              {post.title}
            </h2>
            <div className="mt-auto pt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
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
  )
};

// Component Card cho bài viết nổi bật
const FeaturedPostCard = ({ post }: { post: BlogPost }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Ngày không xác định';
    return new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  };

  return (
    <motion.div variants={itemVariants} className="w-full">
      <Link href={`/tin-tuc/${post.slug}`} className="block">
        <Card className="group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-800 grid md:grid-cols-2 border border-gray-200/80 dark:border-gray-700/60">
          <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden">
             <Image 
                src={post.image || '/placeholder-image.jpg'} 
                alt={post.title} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 767px) 100vw, 50vw"
              />
          </div>
          <div className="p-8 flex flex-col justify-center">
            <p className="text-md font-bold text-blue-600 dark:text-blue-400 mb-3 uppercase tracking-widest">Bài viết mới nhất</p>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 line-clamp-3 leading-tight group-hover:text-blue-700 dark:group-hover:text-blue-400">
              {post.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed">{post.excerpt}</p>
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{post.author || 'MSC Center'}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.publish_date)}</span>
                </div>
            </div>
             <div className="mt-8">
                <div className="inline-flex items-center font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-800 transition-colors duration-300">
                    Đọc bài viết
                    <ArrowRight className="ml-2 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
                </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}

// ====================================
// MAIN PAGE COMPONENT
// ====================================
export default function NewsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        // Lấy bài viết và sắp xếp theo ngày mới nhất
        const blogPosts = await api.getBlogPosts()
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

  const featuredPost = posts[0]
  const otherPosts = posts.slice(1)

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900/95">
      {/* Hero Section */}
      <motion.section 
        className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-900/95 text-center"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        <div className="container mx-auto px-4">
          <motion.div variants={itemVariants}>
            <div className="inline-block bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mb-6 ring-4 ring-blue-500/20">
              <Rss className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
              Tin tức & Sự kiện
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mx-auto max-w-2xl">
              Cập nhật những thông tin, bài viết và sự kiện mới nhất từ MSC Center.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <main className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-16"
          >
            {/* Featured Post */}
            {featuredPost && <FeaturedPostCard post={featuredPost} />}

            {/* Other Posts Grid */}
            {otherPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {otherPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}

            {/* No Posts State */}
            {posts.length === 0 && (
              <motion.div variants={itemVariants} className="text-center py-20">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Chưa có bài viết nào</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-4">Nội dung mới sẽ sớm được cập nhật. Vui lòng quay lại sau.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Newsletter Subscription Section */}
      <section className="py-24 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <div className="inline-block bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mb-6 ring-4 ring-blue-500/20">
                  <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Đừng bỏ lỡ tin tức mới</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
                  Đăng ký để nhận những bài viết chuyên sâu và cập nhật mới nhất từ chúng tôi, thẳng vào hộp thư của bạn.
              </p>
              <form className="flex flex-col sm:flex-row max-w-lg mx-auto gap-3">
                  <Input 
                      type="email" 
                      placeholder="Nhập email của bạn" 
                      className="flex-grow h-12 text-base bg-white dark:bg-gray-800"
                      required
                  />
                  <Button type="submit" size="lg" className="h-12 text-base">
                      Đăng ký ngay
                  </Button>
              </form>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
