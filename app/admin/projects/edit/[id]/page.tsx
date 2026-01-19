'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { api, Project, createClient } from '@/lib/api-supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from 'uuid';

export default function EditProjectPage() {
  const [project, setProject] = useState<Partial<Project> | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const supabase = createClient();
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      api.getProjectById(id)
        .then(data => {
          if (data) {
            const processedData = { ...data };
            // Ensure technologies and mentors are always arrays
            processedData.technologies = Array.isArray(data.technologies) ? data.technologies : [];
            processedData.mentors = Array.isArray(data.mentors) ? data.mentors : [];
            setProject(processedData);
          } else {
            toast({ title: "Lỗi", description: "Không tìm thấy dự án.", variant: "destructive" });
          }
        })
        .catch(error => {
            console.error('Error fetching project:', error);
            toast({ title: "Lỗi", description: "Không thể tải dữ liệu dự án.", variant: "destructive" });
        })
        .finally(() => setLoading(false));
    }
  }, [id, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProject(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSelectChange = (name: string, value: string) => {
    setProject(prev => prev ? { ...prev, [name]: value } : null);
  };
  
  const handleArrayChange = (name: 'technologies' | 'mentors', value: string) => {
    setProject(prev => prev ? { ...prev, [name]: value.split(',').map(item => item.trim()) } : null);
  };

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('project-images')
        .getPublicUrl(uploadData.path);

      setProject(prev => prev ? { ...prev, image: publicUrlData.publicUrl } : null);

      toast({ title: "Thành công", description: "Tải ảnh lên thành công." });

    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({ title: "Lỗi tải ảnh lên", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !id) return;

    try {
      await api.updateProject(id, project);
      toast({ title: "Thành công", description: "Đã cập nhật dự án." });
      router.push('/admin/projects');
      router.refresh();
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast({ title: "Lỗi", description: error.message || "Không thể cập nhật dự án.", variant: "destructive" });
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (!project) return <div>Không tìm thấy dự án.</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Chỉnh Sửa Dự Án</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title">Tên Dự Án</label>
                <Input id="title" name="title" value={project.title || ''} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="description">Mô tả ngắn</label>
                <Textarea id="description" name="description" value={project.description || ''} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="detailproject">Mô tả chi tiết (hỗ trợ Markdown)</label>
                <Textarea id="detailproject" name="detailproject" value={project.detailproject || ''} onChange={handleChange} rows={10} />
              </div>

              <div className="space-y-2">
                <label htmlFor="image-upload">Hình ảnh dự án</label>
                <Input id="image-upload" type="file" onChange={handleImageUpload} disabled={uploading} accept="image/*" />
                {uploading && <p>Đang tải lên...</p>}
                {project.image && !uploading && (
                  <div className="mt-4">
                    <p>Ảnh hiện tại:</p>
                    <img src={project.image} alt="Xem trước" className="max-w-xs rounded-md" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="mentors">Đội ngũ thực hiện (phân cách bởi dấu phẩy)</label>
                <Input id="mentors" name="mentors" value={Array.isArray(project.mentors) ? project.mentors.join(', ') : ''} onChange={(e) => handleArrayChange('mentors', e.target.value)} />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="technologies">Công nghệ (phân cách bởi dấu phẩy)</label>
                <Input id="technologies" name="technologies" value={Array.isArray(project.technologies) ? project.technologies.join(', ') : ''} onChange={(e) => handleArrayChange('technologies', e.target.value)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="status">Trạng thái</label>
                  <Select name="status" value={project.status || ''} onValueChange={(value) => handleSelectChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ongoing">Đang thực hiện</SelectItem>
                      <SelectItem value="completed">Đã hoàn thành</SelectItem>
                      <SelectItem value="planning">Lên kế hoạch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="category">Phân loại</label>
                  <Input id="category" name="category" value={project.category || ''} onChange={handleChange} />
                </div>
              </div>
               <div className="space-y-2">
                <label htmlFor="slug">Slug (URL thân thiện)</label>
                <Input id="slug" name="slug" value={project.slug || ''} onChange={handleChange} />
              </div>
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Hủy</Button>
                <Button type="submit" disabled={uploading}>{uploading ? 'Đang xử lý...' : 'Lưu thay đổi'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
