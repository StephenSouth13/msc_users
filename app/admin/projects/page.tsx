'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api, Project } from '@/lib/api-supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from "@/components/ui/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({ title: "Lỗi", description: "Không thể tải danh sách dự án.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await api.deleteProject(id);
      toast({ title: "Thành công", description: "Đã xóa dự án thành công." });
      // Refetch data from server to ensure UI is in sync
      await fetchProjects(); 
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({ 
        title: "Lỗi Xóa", 
        description: error.message || "Không thể xóa dự án. Vui lòng thử lại.", 
        variant: "destructive" 
      });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Quản Lý Dự Án</h1>
          <Button asChild>
            <Link href="/admin/add-project">Thêm Dự Án Mới</Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Danh sách dự án</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên Dự Án</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Phân loại</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                 {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">Đang tải danh sách dự án...</TableCell>
                  </TableRow>
                ) : projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>{project.status}</TableCell>
                    <TableCell>{project.category}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" asChild disabled={deletingId === project.id}>
                         <Link href={`/admin/projects/edit/${project.id}`}>Sửa</Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" disabled={deletingId === project.id}>
                            {deletingId === project.id ? 'Đang xóa...' : 'Xóa'}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Hành động này không thể hoàn tác. Dự án sẽ bị xóa vĩnh viễn khỏi cơ sở dữ liệu.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(project.id)}>
                              Tiếp tục
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
