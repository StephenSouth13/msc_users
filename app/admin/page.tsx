'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { FilePlus2, List, Users, Newspaper, BookOpenCheck } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Trang Quản Trị</h1>
          <p className="mt-1 text-md text-gray-600 dark:text-gray-400">Chào mừng bạn đến với trung tâm điều khiển của MSC Center.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card Quản lý Dự án */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><List className="h-6 w-6" /> Quản Lý Dự Án</CardTitle>
              <CardDescription>Xem, sửa, xóa và thêm mới các dự án đã và đang thực hiện.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
               <Button asChild>
                <Link href="/admin/projects" className="flex items-center gap-2">
                  <List className="h-4 w-4"/>
                  Xem Danh Sách Dự Án
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/admin/add-project" className="flex items-center gap-2">
                   <FilePlus2 className="h-4 w-4"/>
                  Thêm Dự Án Mới
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Card Quản lý MSCer */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="h-6 w-6" /> Quản Lý MSCer</CardTitle>
              <CardDescription>Quản lý thông tin và hồ sơ của các thành viên MSCer.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
               <Button asChild disabled> 
                  <Link href="#" className="flex items-center gap-2">
                    <List className="h-4 w-4"/>
                    Xem Danh Sách MSCer (Sắp ra mắt)
                  </Link>
              </Button>
              <Button asChild variant="secondary">
                 <Link href="/admin/add-mscer" className="flex items-center gap-2">
                  <FilePlus2 className="h-4 w-4"/>
                  Thêm MSCer Mới
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Card Quản lý Bài Viết */}
          <Card className="hover:shadow-lg transition-shadow bg-gray-100 dark:bg-gray-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Newspaper className="h-6 w-6" /> Quản Lý Bài Viết</CardTitle>
              <CardDescription>Soạn thảo, xuất bản và quản lý các bài viết trên blog.</CardDescription>
            </CardHeader>
            <CardContent>
               <Button asChild disabled>
                <Link href="#" className="flex items-center gap-2">Đang Xây Dựng</Link>
              </Button>
            </CardContent>
          </Card>

           {/* Card Quản lý Chương Trình */}
          <Card className="hover:shadow-lg transition-shadow bg-gray-100 dark:bg-gray-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BookOpenCheck className="h-6 w-6" /> Quản Lý Chương Trình</CardTitle>
              <CardDescription>Cập nhật thông tin các chương trình đào tạo và khóa học.</CardDescription>
            </CardHeader>
            <CardContent>
               <Button asChild disabled>
                <Link href="#">Đang Xây Dựng</Link>
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
