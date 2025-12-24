'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import slugify from 'slugify'
import { api, createClient } from '@/lib/api-supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from 'uuid';

export default function AddProjectPage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [detailproject, setDetailproject] = useState('');
  const [image, setImage] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [mentors, setMentors] = useState(''); // Changed to mentors
  const [status, setStatus] = useState('planning');
  const [category, setCategory] = useState('');
  
  const [uploading, setUploading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    const newSlug = slugify(newTitle, { lower: true, strict: true, remove: /[*+~.()'\"!:@]/g });
    setSlug(newSlug);
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

      setImage(publicUrlData.publicUrl);
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

    const projectData = {
      title,
      slug,
      description,
      detailproject,
      image,
      technologies: technologies.split(',').map(item => item.trim()),
      mentors: mentors.split(',').map(item => item.trim()), // Changed to mentors
      status,
      category,
    };

    try {
      await api.createProject(projectData);
      toast({ title: "Thành công", description: "Đã thêm dự án mới." });
      router.push('/admin/projects');
      router.refresh();
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({ title: "Lỗi", description: error.message || "Không thể tạo dự án.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Thêm Dự Án Mới</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title">Tên Dự Án</label>
                <Input id="title" name="title" value={title} onChange={handleTitleChange} required />
              </div>

               <div className="space-y-2">
                <label htmlFor="slug">Slug (URL thân thiện - tự động tạo)</label>
                <Input id="slug" name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <label htmlFor="description">Mô tả ngắn</label>
                <Textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <label htmlFor="detailproject">Mô tả chi tiết (hỗ trợ Markdown)</label>
                <Textarea id="detailproject" name="detailproject" value={detailproject} onChange={(e) => setDetailproject(e.target.value)} rows={10} />
              </div>

               <div className="space-y-2">
                <label htmlFor="image">Hình ảnh dự án</label>
                <Input id="image-upload" type="file" onChange={handleImageUpload} disabled={uploading} accept="image/*" />
                {uploading && <p>Đang tải lên...</p>}
                {image && !uploading && (
                  <div className="mt-4">
                    <img src={image} alt="Xem trước" className="max-w-xs rounded-md" />
                  </div>
                )}
              </div>

               <div className="space-y-2">
                <label htmlFor="mentors">Đội ngũ thực hiện (phân cách bởi dấu phẩy)</label>
                <Input id="mentors" name="mentors" value={mentors} onChange={(e) => setMentors(e.target.value)} />
              </div>

               <div className="space-y-2">
                <label htmlFor="technologies">Công nghệ (phân cách bởi dấu phẩy)</label>
                <Input id="technologies" name="technologies" value={technologies} onChange={(e) => setTechnologies(e.target.value)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="status">Trạng thái</label>
                  <Select name="status" value={status} onValueChange={setStatus}>
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
                  <Input id="category" name="category" value={category} onChange={(e) => setCategory(e.target.value)} />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Hủy</Button>
                <Button type="submit" disabled={uploading}>Tạo Dự Án</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
