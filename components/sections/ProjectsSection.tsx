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

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const projectsData = await api.getProjects()
        
        // LOGIC QUAN TRỌNG: Chỉ lấy các dự án có featured === true
        const featuredOnly = projectsData.filter((p: any) => p.featured === true)
        
        setProjects(featuredOnly)
      } catch (error) {
        console.error('❌ ProjectsSection Error:', error)
        setProjects([]) 
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  // Lấy tối đa 6 dự án tiêu biểu nhất
  const displayProjects = projects.slice(0, 6)

  return (
    <section className="py-20 bg-gray-50 dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        {/* Tiêu đề Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title mb-6">
            DỰ ÁN TIÊU BIỂU
          </h2>
          <p className="section-description">
            Khám phá các dự án đào tạo thực tế tiêu biểu nhất do MSC Center triển khai.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Skeleton Loading giữ nguyên như cũ */}
          </div>
        ) : displayProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {displayProjects.map((project, index) => (
              <motion.div key={project.id} /* ... animation variants ... */>
                {/* ProjectCard sẽ tự hiển thị Mentor nếu bạn đã sửa ProjectCard */}
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-700">
            <p className="text-gray-500">Chưa có dự án tiêu biểu nào được chọn.</p>
          </div>
        )}

        {/* Nút Xem tất cả */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Link href="/du-an">
            <Button size="lg" className="btn-primary px-8 py-3 h-auto text-base font-semibold rounded-lg">
              Xem tất cả dự án <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}


export default ProjectsSection;
