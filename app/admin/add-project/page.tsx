"use client";

import { useState } from "react";
import { createClient } from "@/lib/api-supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function AddProjectPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const supabase = createClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("projects")
      .insert([{ title, description, image }]);
    if (error) {
      toast({ title: "Lỗi", description: "Thêm dự án thất bại." });
    } else {
      toast({ title: "Thành công", description: "Thêm dự án thành công." });
      setTitle("");
      setDescription("");
      setImage("");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Thêm dự án mới</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Tiêu đề"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Input
              placeholder="Mô tả"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <Input
              placeholder="URL hình ảnh"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
            <Button type="submit">Thêm dự án</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
