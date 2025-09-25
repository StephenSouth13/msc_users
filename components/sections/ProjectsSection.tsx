// src/components/home/ProjectsSection.tsx

"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProjectCard from "@/components/ProjectCard" 
import { api, type Project } from "@/lib/api-supabase" // Import API và type từ Supabase

const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  // Lấy dữ liệu projects từ Supabase
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('🔍 ProjectsSection: Fetching projects from Supabase...')
        setLoading(true)
        const projectsData = await api.getProjects()
        console.log('✅ ProjectsSection: Projects fetched successfully:', projectsData.length, 'projects')
        setProjects(projectsData)
      } catch (error) {
        console.error('❌ ProjectsSection: Error fetching projects:', error)
        setProjects([]) // Fallback to empty array
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Lấy 6 dự án đầu tiên để hiển thị
  const featuredProjects = projects.slice(0, 6)

  return (
    <section className="py-20 bg-gray-50 dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white font-serif">
            Dự án đã triển khai
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Khám phá các dự án đào tạo và phát triển kỹ năng chuyên nghiệp mà MSC Center đã và đang triển khai.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Loading skeleton */}
            {Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
              >
                <div className="animate-pulse">
                  <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 text-lg">
              Đang cập nhật các dự án mới...
            </div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/du-an">
            <Button 
              size="lg" 
              className="bg-blue-800 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold px-8 py-6 text-base"
              disabled={loading}
            >
              {loading ? 'Đang tải...' : 'Xem tất cả dự án'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default ProjectsSection;