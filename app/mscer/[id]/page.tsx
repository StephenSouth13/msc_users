'use client'

import { useState, useEffect } from 'react'
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Award, TrendingUp, Users, Star, Calendar, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api, MSCer } from "@/lib/api-supabase"

interface Props {
  params: { id: string }
}

export default function MSCerDetailPage({ params }: Props) {
  const [mscer, setMscer] = useState<MSCer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMscer = async () => {
      try {
        setLoading(true)
        const data = await api.getMSCerById(params.id)
        if (!data) {
          notFound()
        } else {
          setMscer(data)
        }
      } catch (error) {
        console.error("Error fetching MSCer details:", error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchMscer()
  }, [params.id])

  if (loading) {
    return <div className="min-h-screen pt-20 flex items-center justify-center">Đang tải thông tin...</div>
  }

  if (!mscer) {
    notFound()
  }
  
  // Helper functions to safely access nested JSONB data
  const getContent = (field: string) => mscer.content?.[field] || ''
  const getDetails = (field: string) => mscer.details?.[field] || []
  const getBackground = (field: string) => mscer.background?.[field] || ''
  const getExpertise = (field: string) => mscer.expertise?.[field] || ''

  const skills = Array.isArray(getDetails('skills')) ? getDetails('skills') : []
  const achievements = Array.isArray(getDetails('achievements')) ? getDetails('achievements') : []

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="container py-8">
        <div className="mb-8">
          <Link href="/mscer">
            <Button variant="ghost" className="hover:bg-gray-100 dark:hover:bg-gray-800">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại cộng đồng MSCer
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="relative mx-auto mb-4 w-32 h-32">
                    <Image
                      src={mscer.avatar || "/placeholder.svg"}
                      alt={mscer.name}
                      width={128}
                      height={128}
                      className="rounded-full w-full h-full object-cover border-4 border-blue-500 shadow-md"
                    />
                  </div>

                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{mscer.name}</h1>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">{mscer.position}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{mscer.company}</p>

                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">{getContent('achievement')}</Badge>
                </div>
                
                <div className="space-y-3">
                  <Link href="/lien-he">
                    <Button className="w-full">
                        Kết nối với {mscer.name.split(" ").pop()}
                    </Button>
                  </Link>
                  <Link href="/dao-tao">
                    <Button variant="outline" className="w-full">
                      Tham gia MSC Center
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-8">
            {getContent('testimonial') && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                        <Award className="h-5 w-5 text-blue-600" />
                        <span>Câu chuyện thành công</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <blockquote className="text-lg text-gray-700 dark:text-gray-300 italic leading-relaxed border-l-4 border-blue-200 dark:border-blue-700 pl-6">
                        "{getContent('testimonial')}"
                        </blockquote>
                    </CardContent>
                </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  <span>Thông tin & Kinh nghiệm</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Học vấn</h4>
                    <p className="text-gray-700 dark:text-gray-300">{getBackground('education')}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Kinh nghiệm</h4>
                    <p className="text-gray-700 dark:text-gray-300">{getBackground('experience')}</p>
                </div>
              </CardContent>
            </Card>
            
            {skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Kỹ năng chính</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {achievements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    <span>Thành tựu nổi bật</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {achievements.map((achievement: string, index: number) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/50 dark:to-teal-900/50">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Bạn muốn thành công như {mscer.name.split(" ").pop()}?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Tham gia MSC Center và bắt đầu hành trình của bạn.
                </p>
                <Link href="/dao-tao">
                    <Button size="lg">
                      Khám phá khóa học
                    </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
