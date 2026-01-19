'use client'

import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Facebook, Twitter, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api, BlogPost } from "@/lib/api-supabase"
import { useEffect, useState } from "react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import 'highlight.js/styles/github.css'

interface Props {
  params: { slug: string }
}

export default function BlogPostPage({ params }: Props) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [topPosts, setTopPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch current post
        const currentPost = await api.getBlogPostBySlug(params.slug)
        if (!currentPost) {
          notFound()
          return
        }
        setPost(currentPost)

        // Fetch related posts (same category)
        const allPosts = await api.getBlogPosts()
        const related = allPosts
          .filter((p) => p.id !== currentPost.id && p.category === currentPost.category)
          .slice(0, 3)
        setRelatedPosts(related)

        // Fetch top posts
        const topPostsData = await api.getTopPosts()
        setTopPosts(topPostsData)
        
      } catch (error) {
        console.error('Error fetching blog data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải bài viết...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/chia-se">
            <Button variant="ghost" className="hover:bg-gray-100">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách bài viết
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Hero Image */}
              <div className="relative h-96">
                <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <Badge className="bg-blue-600 text-white mb-4">{post.category}</Badge>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">{post.title}</h1>
                </div>
              </div>

              {/* Article Meta */}
              <div className="p-8 border-b border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <Image
                      src={post.author_avatar || "/placeholder.svg"}
                      alt={post.author || 'Author'}
                      width={50}
                      height={50}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{post.author}</p>
                      <p className="text-sm text-gray-600">Chuyên gia tại MSC Center</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{post.publish_date ? new Date(post.publish_date).toLocaleDateString("vi-VN") : ''}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.read_time}</span>
                    </div>
                  </div>
                </div>

                {/* Social Share */}
                <div className="flex items-center justify-end">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 mr-2">Chia sẻ:</span>
                    <Button variant="outline" size="sm" className="p-2 bg-transparent">
                      <Facebook className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button variant="outline" size="sm" className="p-2 bg-transparent">
                      <Twitter className="h-4 w-4 text-blue-400" />
                    </Button>
                    <Button variant="outline" size="sm" className="p-2 bg-transparent">
                      <Linkedin className="h-4 w-4 text-blue-700" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-8">
                {/* Main Content */}
                <div className="prose prose-lg max-w-none mb-8 
                  prose-headings:text-gray-900 prose-headings:font-bold
                  prose-p:text-gray-700 prose-p:leading-relaxed
                  prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-900 prose-strong:font-semibold
                  prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded
                  prose-pre:bg-gray-900 prose-pre:text-gray-100
                  prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic
                  prose-ul:list-disc prose-ol:list-decimal
                  prose-li:text-gray-700
                  prose-img:rounded-lg prose-img:shadow-md">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight, rehypeRaw]}
                    components={{
                      // Custom components for better styling
                      h1: ({children}) => <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8 first:mt-0">{children}</h1>,
                      h2: ({children}) => <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-6">{children}</h2>,
                      h3: ({children}) => <h3 className="text-xl font-bold text-gray-900 mb-3 mt-5">{children}</h3>,
                      p: ({children}) => <p className="text-gray-700 leading-relaxed mb-4">{children}</p>,
                      ul: ({children}) => <ul className="list-disc list-inside mb-4 text-gray-700">{children}</ul>,
                      ol: ({children}) => <ol className="list-decimal list-inside mb-4 text-gray-700">{children}</ol>,
                      li: ({children}) => <li className="mb-1">{children}</li>,
                      blockquote: ({children}) => (
                        <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 rounded-r-lg italic text-gray-600">
                          {children}
                        </blockquote>
                      ),
                      code: ({children, className}) => {
                        const isInline = !className;
                        return isInline ? 
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">{children}</code> :
                          <code className={className}>{children}</code>
                      },
                      pre: ({children}) => <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
                      img: ({src, alt}) => (
                        <div className="my-6">
                          <Image 
                            src={src || '/placeholder.svg'} 
                            alt={alt || ''} 
                            width={800} 
                            height={400} 
                            className="rounded-lg shadow-md w-full h-auto"
                          />
                        </div>
                      ),
                      a: ({href, children}) => (
                        <a href={href} className="text-blue-600 hover:text-blue-800 hover:underline" target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      )
                    }}
                  >
                    {post.content || post.excerpt || ''}
                  </ReactMarkdown>
                </div>
                
                {/* Excerpt if different from content */}
                {post.excerpt && post.content && post.excerpt !== post.content && (
                  <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Tóm tắt:</h3>
                    <div className="prose prose-sm max-w-none text-gray-700">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight, rehypeRaw]}
                      >
                        {post.excerpt}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* Context Section */}
                {post.context && (
                  <div className="mt-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Bối cảnh bài viết
                    </h3>
                    <div className="prose prose-sm max-w-none text-gray-700">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight, rehypeRaw]}
                      >
                        {post.context}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* Author Bio */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-start space-x-4">
                    <Image
                      src={post.author_avatar || "/placeholder.svg"}
                      alt={post.author || 'Author'}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Về tác giả</h3>
                      <p className="text-gray-700 mb-4">{post.author} - Chuyên gia tại MSC Center</p>
                      <Link href="/mentors">
                        <Button variant="outline" size="sm">
                          Xem hồ sơ đầy đủ
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Bài viết liên quan</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Card key={relatedPost.id} className="hover:shadow-lg transition-shadow duration-300">
                      <div className="relative">
                        <Image
                          src={relatedPost.image || "/placeholder.svg"}
                          alt={relatedPost.title}
                          width={400}
                          height={200}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <Badge className="absolute top-3 left-3 bg-blue-600 text-white">{relatedPost.category}</Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{relatedPost.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{relatedPost.excerpt}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <span>{relatedPost.read_time}</span>
                        </div>
                        <Link href={`/chia-se/${relatedPost.slug}`} className="block">
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            Đọc thêm
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Top Posts */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Bài viết được xem nhiều nhất</h3>
                  <div className="space-y-4">
                    {topPosts.map((topPost, index) => (
                      <div key={topPost.id} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <Link href={`/chia-se/${topPost.slug}`}>
                            <h4 className="font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-1">
                              {topPost.title}
                            </h4>
                          </Link>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Badge variant="outline" className="text-xs">
                              {topPost.category}
                            </Badge>
                            <span>{topPost.views?.toLocaleString()} views</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter Signup */}
              <Card className="bg-gradient-to-br from-blue-50 to-teal-50">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-3">Đăng ký nhận tin</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Nhận những bài viết mới nhất và insights độc quyền từ MSC Center
                  </p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Email của bạn"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button className="w-full btn-primary">Đăng ký</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Chủ đề</h3>
                  <div className="space-y-2">
                    {[
                      "Leadership",
                      "Digital Marketing", 
                      "Soft Skills",
                      "Project Management",
                      "Innovation",
                      "HR Management",
                    ].map((category) => (
                      <Link key={category} href={`/chia-se/category/${category.toLowerCase()}`}>
                        <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                          <span className="text-sm text-gray-700">{category}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}