import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Trang quản trị</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/projects/new">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Thêm dự án</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Thêm một dự án mới vào danh sách.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/mscers/new">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Thêm hồ sơ MSCer</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Thêm một hồ sơ MSCer mới.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
