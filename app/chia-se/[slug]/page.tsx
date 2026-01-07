'use client'

import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Facebook, Twitter, Linkedin, TrendingUp, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { api, BlogPost } from "@/lib/api-supabase"
import { useEffect, useState } from "react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import 'highlight.js/styles/github.css'

interface Props { params: { slug: string } }

export default function BlogPostPage({ params }: Props) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const currentPost = await api.getBlogPostBySlug(params.slug)
        if (!currentPost) { notFound(); return; }
        setPost(currentPost)

        const allPosts = await api.getBlogPosts()
        const related = allPosts
          .filter((p) => p.id !== currentPost.id && p.category === currentPost.category)
          .slice(0, 3)
        setRelatedPosts(related)
      } catch (error) {
        console.error('Error fetching blog data:', error)
      } finally { setLoading(false) }
    }
    fetchData()
  }, [params.slug])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
    </div>
  )
  if (!post) notFound()

  return (
    <div className="min-h-screen pt-24 bg-gray-50/50 dark:bg-gray-950">
      <div className="container py-8 max-w-7xl mx-auto px-4">
        <Link href="/chia-se" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 mb-10 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> QUAY LẠI CHIA SẺ
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <article className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
              {/* Cover Image */}
              <div className="relative aspect-[21/9] w-full">
                <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
                <div className="absolute bottom-10 left-10 right-10">
                  <Badge className="bg-blue-600 text-white mb-4 px-4 py-1 rounded-full uppercase tracking-widest text-[10px]">{post.category}</Badge>
                  <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">{post.title}</h1>
                </div>
              </div>

              <div className="p-8 md:p-14">
                {/* ĐA TÁC GIẢ SECTION */}
                <div className="flex flex-wrap gap-6 mb-12 p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <p className="w-full text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 flex items-center gap-2">
                    <UserCheck size={14} className="text-blue-500"/> Đội ngũ chuyên gia thực hiện:
                  </p>
                  <div className="flex flex-wrap gap-8">
                    {post.authors?.map((author: any) => (
                      <Link key={author.slug} href={`/mentors/${author.slug}`} className="group flex items-center gap-4">
                        <Avatar className="h-14 w-14 border-2 border-white shadow-xl group-hover:scale-110 transition-transform">
                          <AvatarImage src={author.avatar_url} className="object-cover" />
                          <AvatarFallback className="font-bold">{author.full_name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors leading-none mb-1">{author.full_name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{author.title || 'Mentor'}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="w-full h-px bg-slate-200 mt-4 mb-2" />
                  <div className="flex items-center gap-6 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <div className="flex items-center gap-1.5"><Calendar size={14}/> {new Date(post.publish_date || '').toLocaleDateString("vi-VN")}</div>
                    <div className="flex items-center gap-1.5"><Clock size={14}/> {post.read_time}</div>
                  </div>
                </div>

                {/* Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-img:rounded-[2rem] prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 prose-blockquote:py-1">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight, rehypeRaw]}>
                    {post.content || ''}
                  </ReactMarkdown>
                </div>
              </div>
            </article>

            {/* BÀI VIẾT GỢI Ý */}
            <div className="mt-24">
              <h3 className="text-2xl font-black mb-10 flex items-center gap-3">
                <TrendingUp size={28} className="text-blue-600" /> BÀI VIẾT GỢI Ý
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((rPost) => (
                  <Link key={rPost.id} href={`/chia-se/${rPost.slug}`} className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all h-full flex flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image src={rPost.image || '/placeholder.jpg'} fill className="object-cover group-hover:scale-105 transition-transform duration-700" alt="r" />
                    </div>
                    <div className="p-6">
                      <Badge variant="secondary" className="mb-3 text-[9px] font-black uppercase">{rPost.category}</Badge>
                      <h4 className="font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">{rPost.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-28 space-y-8">
              <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <h4 className="font-black text-2xl mb-4 leading-tight">Cộng đồng tri thức MSC</h4>
                <p className="text-sm opacity-80 mb-8">Nhận insights chuyên sâu và thông báo bài viết mới nhất từ các Mentor.</p>
                <input type="email" placeholder="Email của bạn..." className="w-full h-14 rounded-2xl px-6 text-slate-900 mb-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-400 transition-all" />
                <Button className="w-full bg-slate-900 text-white font-black h-14 rounded-2xl hover:bg-black shadow-xl">ĐĂNG KÝ NGAY</Button>
              </div>
              <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                 <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6">Chia sẻ nội dung</h4>
                 <div className="flex gap-4">
                    <Button variant="outline" size="icon" className="rounded-full h-12 w-12 hover:bg-blue-600 hover:text-white transition-all"><Facebook size={20}/></Button>
                    <Button variant="outline" size="icon" className="rounded-full h-12 w-12 hover:bg-sky-400 hover:text-white transition-all"><Twitter size={20}/></Button>
                    <Button variant="outline" size="icon" className="rounded-full h-12 w-12 hover:bg-blue-800 hover:text-white transition-all"><Linkedin size={20}/></Button>
                 </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}