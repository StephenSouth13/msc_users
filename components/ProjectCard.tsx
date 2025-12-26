// src/components/ProjectCard.tsx

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Users, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Project } from "@/lib/api-supabase" // Import Project interface từ Supabase API

// Định nghĩa props mà component này nhận vào
interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="h-full flex flex-col overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 group bg-white dark:bg-neutral-800">
      <CardHeader className="p-0">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={project.image || '/placeholder.jpg'}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          <Badge variant="secondary" className="absolute top-4 left-4 bg-white/90 text-gray-800 shadow">
            {project.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 flex flex-col flex-grow">
        <CardTitle className="text-xl font-bold text-gray-800 dark:text-white mb-3">
          {project.title}
        </CardTitle>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 flex-grow">
          {project.description}
        </p>
        
        <div className="mt-auto space-y-3">
            <div className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Người hướng dẫn:</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {Array.isArray(project.mentors) && project.mentors.length > 0 && project.mentors[0] !== '' ? (
                    project.mentors.map((mentorName: string, index: number) => (
                        <Badge key={index} variant="outline" className="font-normal bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200">
                            <Award className="h-3 w-3 mr-1.5" />
                            {mentorName}
                        </Badge>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">Chưa có thông tin</p>
                )}
            </div>
        </div>
        
        <Link href={`/du-an/${project.slug || project.id}`} className="mt-6">
          <Button className="w-full bg-blue-800 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold">
            Xem chi tiết dự án
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
