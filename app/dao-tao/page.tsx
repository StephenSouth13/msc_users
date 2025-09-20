'use client';

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Users, Award, BookOpen, Target, CheckCircle, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence, useAnimation, useInView, Variants } from 'framer-motion';
import { api, Program } from "@/lib/api-supabase";

export default function TrainingPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔍 [DAO-TAO] Starting fetchData...')
        setLoading(true)
        
        const programsRes = await api.getPrograms()
        console.log('🔍 [DAO-TAO] Programs response:', programsRes)
        console.log('🔍 [DAO-TAO] Programs length:', programsRes?.length || 0)
        
        setPrograms(programsRes || [])
        console.log('🔍 [DAO-TAO] Programs state set')
      } catch (error) {
        console.error('❌ [DAO-TAO] Error fetching data:', error)
      } finally {
        setLoading(false)
        console.log('🔍 [DAO-TAO] Loading set to false')
      }
    }

    fetchData()
  }, [])

  const benefits = [
    { icon: Award, title: "Chứng chỉ uy tín", description: "Nhận chứng chỉ được công nhận quốc tế và trong nước", },
    { icon: Users, title: "Học từ chuyên gia", description: "Đội ngũ giảng viên giàu kinh nghiệm thực tiễn", },
    { icon: Target, title: "Thực hành thực tế", description: "70% thời gian dành cho thực hành và case study", },
    { icon: BookOpen, title: "Tài liệu độc quyền", description: "Bộ tài liệu học tập được biên soạn riêng", },
  ];

  const galleryPhotos = [ "/dao-tao/1.webp", "/dao-tao/2.webp", "/dao-tao/3.webp", "/dao-tao/4.webp", "/dao-tao/5.webp", "/dao-tao/6.webp", "/dao-tao/7.webp", "/dao-tao/8.webp", "/dao-tao/9.webp", "/dao-tao/10.webp", "/dao-tao/11.webp", "/dao-tao/12.webp", "/dao-tao/13.webp", "/dao-tao/14.webp", "/dao-tao/15.webp", "/dao-tao/16.webp", "/dao-tao/17.webp", "/dao-tao/18.webp", ];

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => { setCurrentImageIndex(index); setLightboxOpen(true); document.body.style.overflow = 'hidden'; };
  const closeLightbox = () => { setLightboxOpen(false); document.body.style.overflow = 'auto'; };
  const goToPrev = () => { setCurrentImageIndex((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length); };
  const goToNext = () => { setCurrentImageIndex((prev) => (prev + 1) % galleryPhotos.length); };
  
  const coreValues = [
    { title: "Mentoring & Coaching kỹ năng Marketing và Sales", description: "Định hình tư duy thị trường, nâng cao kỹ năng truyền thông – bán hàng thông qua các chương trình mentoring & coaching thực chiến.", color: "text-[#0077B6]", }, // Giữ màu gốc
    { title: "Đào tạo kỹ năng Nghiên cứu, Thẩm định & Đánh giá dự án", description: "Trang bị phương pháp tiếp cận và phân tích dự án theo mô hình Holding: Sản phẩm – Con người – Tài chính, giúp học viên tư duy hệ thống và ra quyết định chiến lược.", color: "text-[#2A9D8F]", }, // Giữ màu gốc
    { title: "Đào tạo Quản lý dự án (Trước-Trong-Sau)", description: "Phát triển năng lực lãnh đạo dự án qua toàn bộ vòng đời: từ hoạch định – triển khai – tổng kết, kết hợp thực hành và công cụ quản trị hiện đại.", color: "text-[#F4A261]", }, // Giữ màu gốc
  ];

  // ========== PHẦN ANIMATION CHO VÒNG LẶP ==========
  const mscSectionRef = useRef(null);
  const isMscInView = useInView(mscSectionRef, { once: true, amount: 0.2 });

  const controlsM = useAnimation();
  const controlsS = useAnimation();
  const controlsC = useAnimation();

  const letterAnimation: Variants = {
    initial: { scale: 1 },
    animate: { 
      scale: 1.25,
      transition: { 
        duration: 0.4,
        ease: "easeInOut",
        repeat: 1,
        repeatType: "reverse"
      } 
    },
  };

  useEffect(() => {
    let isActive = true;

    const sequence = async () => {
      while (isActive) {
        await controlsM.start("animate");
        await new Promise(resolve => setTimeout(resolve, 200));
        await controlsS.start("animate");
        await new Promise(resolve => setTimeout(resolve, 200));
        await controlsC.start("animate");
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    };

    if (isMscInView) {
      // đảm bảo chạy sau khi DOM gắn xong
      requestAnimationFrame(() => {
        sequence();
      });
    }

    return () => {
      isActive = false; // cleanup để tránh memory leak
    };
  }, [isMscInView, controlsM, controlsS, controlsC]);


  const cardVariant: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    // Nền tổng thể của trang
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-900 text-white">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6 font-serif"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              Chương trình Đào tạo
            </motion.h1>
            <motion.p 
              className="text-xl text-blue-100 mb-8 leading-relaxed" // Giữ màu xanh nhạt này trên nền xanh đậm là ổn
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Khám phá các chương trình đào tạo chuyên nghiệp được thiết kế để phát triển kỹ năng và nâng cao năng lực cạnh tranh trong thời đại số.
            </motion.p>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-300">50+</div> {/* Giữ màu teal nổi bật */}
                <div className="text-sm text-blue-200">Chương trình</div> {/* Giữ màu xanh nhạt */}
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-300">5000+</div>
                <div className="text-sm text-blue-200">Học viên</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-300">95%</div>
                <div className="text-sm text-blue-200">Hài lòng</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-300">85%</div>
                <div className="text-sm text-blue-200">Thăng tiến</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== MSC CORE VALUES SECTION - PHIÊN BẢN CÓ VÒNG LẶP ========== */}
      <section ref={mscSectionRef} className="py-24 bg-gray-50 dark:bg-gray-900 overflow-hidden"> {/* Nền section */}
        <div className="container text-center max-w-5xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white"> {/* Màu chữ tiêu đề */}
              <motion.span
                className="text-orange-500 inline-block drop-shadow-[0_0_12px_theme(colors.orange.500)]" // Giữ màu cam nổi bật
                variants={letterAnimation}
                initial="initial"
                animate={controlsM}
              >
                M
              </motion.span>
              entoring For Success
            </h2>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              <motion.span
                className="text-orange-500 inline-block drop-shadow-[0_0_12px_theme(colors.orange.500)]"
                variants={letterAnimation}
                initial="initial"
                animate={controlsS}
              >
                S
              </motion.span>
              kills For Success
            </h2>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              <motion.span
                className="text-orange-500 inline-block drop-shadow-[0_0_12px_theme(colors.orange.500)]"
                variants={letterAnimation}
                initial="initial"
                animate={controlsC}
              >
                C
              </motion.span>
              oaching For Success
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-left">
            {coreValues.map((value, index) => (
              <motion.div 
                key={index}
                // Nền card và bóng đổ trong dark mode
                className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                custom={index}
                variants={cardVariant}
                initial="hidden"
                animate={isMscInView ? "visible" : "hidden"}
              >
                <h4 className={`text-xl font-bold ${value.color} mb-3 font-serif`}>{value.title}</h4> {/* Giữ màu gốc, nó đã đủ nổi bật */}
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{value.description}</p> {/* Màu chữ mô tả */}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white dark:bg-gray-800"> {/* Nền section */}
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white font-serif">Tại sao chọn MSC Center?</h2> {/* Màu chữ tiêu đề */}
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"> {/* Màu chữ mô tả */}
              Những lợi ích vượt trội khi học tập tại MSC Center
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6 hover:shadow-lg transition-all duration-300 rounded-xl">
                {/* Nền icon và màu icon trong dark mode */}
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{benefit.title}</h3> {/* Màu chữ tiêu đề nhỏ */}
                <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p> {/* Màu chữ mô tả */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section with Sidebar */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900"> {/* Nền section */}
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white font-serif">Chương trình đào tạo</h2> {/* Màu chữ tiêu đề */}
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"> {/* Màu chữ mô tả */}
              Các khóa học được thiết kế chuyên nghiệp, phù hợp với nhu cầu thực tế của doanh nghiệp
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Programs Grid */}
            <div className="w-full">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-300">Đang tải khóa học...</p> {/* Màu chữ loading */}
                </div>
              ) : programs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-gray-500 mb-4"> {/* Màu icon */}
                    <BookOpen className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Không có khóa học</h3> {/* Màu chữ tiêu đề */}
                  <p className="text-gray-600 dark:text-gray-300">Hiện tại chưa có khóa học nào được công bố.</p> {/* Màu chữ mô tả */}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {programs.map((program) => (
                    <Card
                      key={program.slug}
                      // Nền card trong dark mode
                      className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800"
                    >
                      {/* Ảnh + nhãn */}
                      <div className="relative">
                        <Image
                          src={program.image || '/placeholder-program.jpg'}
                          alt={program.title}
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover"
                        />

                        {/* Level - giữ màu gốc vì đã nổi bật */}
                        {program.level && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                              {program.level}
                            </span>
                          </div>
                        )}

                        {/* Price - giữ màu gốc vì đã nổi bật */}
                        <div className="absolute top-4 right-4">
                          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {program.price} VND
                          </span>
                        </div>

                        {/* Category - giữ màu gốc vì đã nổi bật */}
                        {program.category && (
                          <div className="absolute bottom-4 left-4">
                            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                              {program.category}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Nội dung card */}
                      <CardHeader>
                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white"> {/* Màu chữ tiêu đề */}
                          {program.title}
                        </CardTitle>

                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300"> {/* Màu chữ thông tin */}
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" /> {/* Icon màu mặc định hoặc thêm dark:text-gray-400 nếu muốn */}
                            <span>{program.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{program.students} học viên</span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        {/* Mô tả ngắn */}
                        <p className="text-gray-600 dark:text-gray-300 mb-6">{program.description}</p> {/* Màu chữ mô tả */}

                        {/* Highlights */}
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Nội dung chính:</h4> {/* Màu chữ tiêu đề */}
                          <ul className="space-y-2">
                            {program.highlights?.slice(0, 3).map((highlight: string, index: number) => (
                              <li
                                key={index}
                                className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300" // Màu chữ highlight
                              >
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" /> {/* Giữ màu xanh lá cây cho checkmark */}
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Nút hành động */}
                        <div className="flex space-x-3">
                          <Link href={`/dao-tao/${program.slug}`} className="flex-1">
                            <Button className="w-full btn-primary">Chi tiết khóa học</Button> {/* Nút chính giữ nguyên */}
                          </Link>
                          <Link href="/lien-he">
                            <Button variant="outline" className="bg-transparent dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"> {/* Nút outline */}
                              Đăng ký ngay
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-white dark:bg-gray-800"> {/* Nền section */}
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white font-serif">THƯ VIỆN ẢNH</h2> {/* Màu chữ tiêu đề */}
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Hình ảnh đào tạo tại các dự án !</p> {/* Màu chữ mô tả */}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryPhotos.map((photo, index) => (
              <motion.div key={index} className="relative aspect-video overflow-hidden rounded-lg shadow-md cursor-pointer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => openLightbox(index)}>
                <Image src={photo} alt={`Gallery image ${index + 1}`} fill className="object-cover" sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600 text-white"> {/* Giữ nguyên gradient nổi bật, text-white đã đủ tốt */}
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">Sẵn sàng bắt đầu hành trình học tập?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">Đăng ký tư vấn miễn phí để tìm hiểu chương trình phù hợp với bạn</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/lien-he">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 dark:bg-gray-200 dark:text-blue-700 dark:hover:bg-gray-300"> {/* Nút primary trong CTA */}
                Đăng ký tư vấn miễn phí
              </Button>
            </Link>
            <Link href="/chia-se">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 bg-transparent dark:border-gray-500 dark:hover:bg-gray-700/30"> {/* Nút outline trong CTA */}
                Tải brochure
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Lightbox Component - Giữ nguyên vì nền đen/mờ đã là dark mode tự nhiên */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeLightbox}>
            <motion.div className="relative max-w-4xl max-h-full" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} onClick={(e) => e.stopPropagation()}>
              <Image src={galleryPhotos[currentImageIndex]} alt={`Full size image ${currentImageIndex + 1}`} width={1000} height={800} className="rounded-lg shadow-2xl max-w-full max-h-[80vh] object-contain" />
              <button className="absolute top-4 right-4 p-2 bg-white/20 text-white rounded-full hover:bg-white/40 transition-colors" onClick={closeLightbox}><X className="h-6 w-6" /></button>
              <button className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 text-white rounded-full hover:bg-white/40 transition-colors" onClick={goToPrev}><ChevronLeft className="h-6 w-6" /></button>
              <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 text-white rounded-full hover:bg-white/40 transition-colors" onClick={goToNext}><ChevronRight className="h-6 w-6" /></button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}