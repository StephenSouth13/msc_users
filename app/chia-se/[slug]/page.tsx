'use client'

import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Facebook, Twitter, Linkedin, Share2, Bookmark, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
        const currentPost = await api.getBlogPostBySlug(params.slug)
        if (!currentPost) {
          notFound()
          return
        }
        setPost(currentPost)

        const allPosts = await api.getBlogPosts()
        const related = allPosts
          .filter((p) => p.id !== currentPost.id && p.category === currentPost.category)
          .slice(0, 3)
        setRelatedPosts(related)

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
      <div className="min-h-screen pt-20 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">Đang tải tri thức...</p>
        </div>
      </div>
    )
  }

  if (!post) notFound()

  return (
    <div className="min-h-screen pt-24 bg-slate-50/50 dark:bg-slate-950">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb & Back Action */}
        <div className="flex items-center justify-between mb-10">
          <Link href="/chia-se">
            <Button variant="ghost" className="group text-slate-500 hover:text-blue-600 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Quay lại danh sách
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10"><Bookmark size={18} /></Button>
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10"><Share2 size={18} /></Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-8">
            <article className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
              {/* Header Image với Overlay chuyên nghiệp */}
              <div className="relative aspect-[21/9] w-full">
                <Image src={post.image || "/placeholder.jpg"} alt={post.title} fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <Badge className="bg-blue-600/90 backdrop-blur-md text-white border-none px-4 py-1 mb-4 rounded-full uppercase text-[10px] font-black tracking-widest">
                    {post.category}
                  </Badge>
                  <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
                    {post.title}
                  </h1>
                </div>
              </div>

              {/* Multi-Author Meta Bar */}
              <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  {/* Avatar Stack cho đa tác giả */}
                  <div className="flex -space-x-3">
                    {post.authors?.map((auth, i) => (
                      <Avatar key={i} className="h-12 w-12 border-4 border-white dark:border-slate-900 shadow-sm">
                        <AvatarImage src={auth.avatar_url} className="object-cover" />
                        <AvatarFallback className="font-bold">{auth.full_name[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1">
                      {post.authors && post.authors.length > 0 
                        ? post.authors.map(a => a.full_name).join(' & ') 
                        : 'MSC Center Team'}
                    </p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter flex items-center gap-1">
                       <UserCheck size={12} className="text-blue-500" /> Chuyên gia tại MSC Center
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-slate-400 font-bold text-[11px] uppercase tracking-widest">
                  <div className="flex items-center gap-1.5"><Calendar size={14} className="text-blue-500" /> {post.publish_date ? new Date(post.publish_date).toLocaleDateString("vi-VN") : ''}</div>
                  <div className="flex items-center gap-1.5"><Clock size={14} className="text-blue-500" /> {post.read_time || '5 phút'}</div>
                </div>
              </div>

              {/* Article Content - Typography được tối ưu */}
              <div className="p-8 md:p-12">
                <div className="prose prose-slate prose-lg dark:prose-invert max-w-none 
                  prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900
                  prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-lg
                  prose-strong:text-slate-900 prose-strong:font-black
                  prose-img:rounded-[2rem] prose-img:shadow-2xl prose-img:my-12
                  prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-blockquote:text-blue-900">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  >
                    {post.content || ''}
                  </ReactMarkdown>
                </div>

                {/* Social Share Bottom */}
                <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-center gap-4">
                    <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Lan tỏa tri thức:</span>
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-50 hover:text-blue-600"><Facebook size={18}/></Button>
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-sky-50 hover:text-sky-500"><Twitter size={18}/></Button>
                    <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-50 hover:text-blue-700"><Linkedin size={18}/></Button>
                </div>
              </div>
            </article>

            {/* Related Posts Section */}
            {relatedPosts.length > 0 && (
              <div className="mt-20">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-10 tracking-tight">Bài viết cùng chủ đề</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {relatedPosts.map((r) => (
                    <Link key={r.id} href={`/chia-se/${r.slug}`} className="group">
                      <div className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-800">
                        <div className="relative aspect-video overflow-hidden">
                          <Image src={r.image || "/placeholder.jpg"} alt={r.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="p-6">
                          <h3 className="font-black text-slate-900 dark:text-white line-clamp-2 leading-tight mb-2 group-hover:text-blue-600 transition-colors">{r.title}</h3>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{r.category}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4 space-y-10">
            {/* Top Trending Posts */}
            <Card className="rounded-[2.5rem] border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 border-l-4 border-blue-600 pl-4 leading-none">Xu hướng đọc</h3>
                <div className="space-y-8">
                  {topPosts.map((tp, index) => (
                    <Link key={tp.id} href={`/chia-se/${tp.slug}`} className="flex gap-4 group">
                      <span className="text-4xl font-black text-slate-100 dark:text-slate-800 group-hover:text-blue-100 transition-colors leading-none italic">{index + 1}</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 dark:text-white leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{tp.title}</h4>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{tp.views?.toLocaleString()} lượt xem</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Magazine Style */}
            <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                <h3 className="text-2xl font-black mb-4 leading-tight">Nhận Insights <br/> Độc Quyền</h3>
                <p className="text-blue-100 text-sm font-medium mb-8 leading-relaxed italic opacity-80">Những bài viết chuyên sâu về Leadership & Innovation gửi thẳng vào Mail của bạn.</p>
                <div className="space-y-4">
                    <input type="email" placeholder="Email của bạn..." className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 placeholder:text-white/40" />
                    <Button className="w-full bg-white text-blue-600 hover:bg-slate-100 font-black rounded-2xl h-14 uppercase text-xs tracking-widest shadow-xl shadow-blue-900/20 transition-all">Đăng ký ngay</Button>
                </div>
            </div>

            {/* Categories Tags */}
            <div className="px-4">
                <h3 className="text-sm font-black uppercase text-slate-400 tracking-[0.2em] mb-6 pl-4 border-l-2 border-slate-200">Chủ đề phổ biến</h3>
                <div className="flex flex-wrap gap-2">
                    {["Leadership", "Soft Skills", "Innovation", "HR Management"].map(c => (
                        <Link key={c} href={`/chia-se/category/${c.toLowerCase()}`}>
                            <Badge variant="outline" className="rounded-xl px-4 py-2 border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all font-bold text-slate-500">{c}</Badge>
                        </Link>
                    ))}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}