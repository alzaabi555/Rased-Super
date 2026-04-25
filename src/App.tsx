import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, Power } from 'lucide-react'; // 💉 أضفنا أيقونة Power للخروج

// استيراد أوامر نظام التشغيل (لإغلاق التطبيق في الجوال)
import { App as CapApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

// 💉 استيراد كافة أفراد العائلة
import TeacherApp from "./apps/teacher/App.tsx";
import AdminApp from "./apps/admin/App.tsx";
import ParentApp from "./apps/parent/App.tsx";
import StudentApp from "./apps/student/App.tsx";

// =========================================================
// 💉 لوحة الأزرار العائمة (العودة للرئيسية + الخروج النهائي)
// =========================================================
function GlobalFloatingButtons() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  // دالة الخروج الذكية (تعرف إن كنت في ويندوز أو جوال)
  const handleExitApp = async () => {
    if (Capacitor.isNativePlatform()) {
      await CapApp.exitApp(); // خروج من الجوال
    } else {
      window.close(); // إغلاق نافذة الويندوز / المتصفح
    }
  };

  return (
    <div 
      className="fixed left-4 md:left-6 z-[99999] flex flex-col gap-3"
      style={{ top: 'max(1.2rem, calc(env(safe-area-inset-top) - 0.2rem))' }}
    >
      {/* زر العودة للرئيسية (يختفي إذا كنا في الرئيسية أصلاً) */}
      {!isHome && (
        <button
          onClick={() => window.location.hash = '#/'}
          className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white/20 dark:bg-black/40 backdrop-blur-xl border border-white/30 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-300"
          title="العودة للرئيسية"
        >
          <Home className="text-gray-800 dark:text-white w-5 h-5 md:w-6 md:h-6" />
        </button>
      )}

      {/* زر إغلاق النظام (يظهر دائماً باللون الأحمر الفاخر) */}
      <button
        onClick={handleExitApp}
        className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-rose-500/20 backdrop-blur-xl border border-rose-500/30 rounded-full shadow-lg hover:scale-110 hover:bg-rose-500/40 active:scale-95 transition-all duration-300 group"
        title="إغلاق المنظومة"
      >
        <Power className="text-rose-600 dark:text-rose-400 w-5 h-5 md:w-6 md:h-6 group-hover:text-rose-500" />
      </button>
    </div>
  );
}

// =========================================================
// 1️⃣ الشاشة الرئيسية الفاخرة (النسخة المتوافقة مع شاشات الكمبيوتر)
// =========================================================
function SuperAppLanding() {
  const navigate = useNavigate();
  
  const portals = [
    { 
      id: 'teacher', 
      title: 'بوابة المعلم', 
      description: 'أدوات ذكية لرصد الحضور، تسجيل المخالفات، ومتابعة الأداء الأكاديمي للطلاب بكل يسر وسهولة.', 
      iconPath: 'icons/teacher.png', 
      bgClass: 'from-[#FF9A22] to-[#FF7A00]', 
      path: '/teacher' 
    },
    { 
      id: 'admin', 
      title: 'بوابة الإدارة', 
      description: 'لوحة تحكم قيادية لمتابعة الإحصائيات واستخراج التقارير لدعم اتخاذ القرارات السريعة.', 
      iconPath: 'icons/admin.png', 
      bgClass: 'from-[#8C6DFD] to-[#6A48F5]', 
      path: '/admin' 
    },
    { 
      id: 'student', 
      title: 'بوابة الطالب', 
      description: 'الحقيبة الإلكترونية للرفيق اليومي؛ لمتابعة الإنجازات، الجدول الدراسي، والتلقي المستمر للتوجيهات.', 
      iconPath: 'icons/student.png', 
      bgClass: 'from-[#33A8FF] to-[#007AFF]', 
      path: '/student' 
    },
    { 
      id: 'parent', 
      title: 'بوابة ولي الأمر', 
      description: 'حلقة الوصل المباشرة بين البيت والمدرسة لمتابعة مستوى الأبناء، سجلات الحضور، والملاحظات.', 
      iconPath: 'icons/parent.png', 
      bgClass: 'from-[#2AC98E] to-[#00A865]', 
      path: '/parent' 
    },
  ];

  return (
    <div className="h-screen flex flex-col font-sans overflow-hidden bg-gradient-to-br from-[#041126] via-[#0a1930] to-[#061b3b] relative text-white" dir="rtl">
      
      {/* 🌌 تأثيرات الخلفية */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* 👑 الهيدر (تم تقليص الارتفاع ليناسب شاشات اللابتوب) */}
      <header className="relative w-full z-10 shadow-xl border-b border-white/5 bg-black/20 flex-shrink-0">
        <div className="relative w-full h-[180px] md:h-[220px] lg:h-[260px] overflow-hidden">
          <img 
            src="banner.png" 
            alt="منظومة راصد التعليمية" 
            className="w-full h-full object-cover object-center" 
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="hidden absolute inset-0 flex flex-col items-center justify-center bg-[#041126]/50 backdrop-blur-md">
             <h1 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-l from-[#d4af37] to-[#fbf5b7] mb-2 tracking-wide">
              منظومة راصد التعليمية
            </h1>
            <p className="text-[10px] md:text-sm text-blue-100/70 font-medium">الرجاء إضافة صورة banner.png في مجلد public</p>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#041126] to-transparent pointer-events-none"></div>
        </div>
      </header>

      {/* 🏛️ الشبكة التفاعلية (تم ضبط المقاسات لتجنب الـ Scroll) */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10 w-full max-w-5xl mx-auto overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-2 gap-3 md:gap-6 w-full h-full max-h-[600px] items-center">
          {portals.map((portal, idx) => (
            <motion.div
              key={portal.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-[1.5rem] md:rounded-[2rem] shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.06)] transition-all duration-500 flex flex-col items-center justify-center h-[160px] md:h-[200px] lg:h-[240px] w-full"
            >
              <div className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${portal.bgClass} opacity-10 rounded-full blur-[30px] group-hover:opacity-30 transition-opacity duration-500`}></div>

              {/* 1️⃣ الحالة الافتراضية */}
              <div className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out group-hover:opacity-0 group-hover:scale-75 group-hover:-translate-y-8">
                <div className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 mb-2 md:mb-4">
                  <img src={portal.iconPath} alt={portal.title} className="w-full h-full object-contain drop-shadow-xl" />
                </div>
                <h2 className="text-sm md:text-xl lg:text-2xl font-black text-white text-center px-2 drop-shadow-md">{portal.title}</h2>
              </div>

              {/* 2️⃣ حالة اللمس/المرور */}
              <div className="absolute inset-0 p-4 md:p-8 flex flex-col items-center justify-center bg-[#061b3b]/95 backdrop-blur-md opacity-0 scale-125 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-out">
                <p className="text-[10px] md:text-base lg:text-lg text-blue-50 text-center mb-4 md:mb-6 font-bold leading-relaxed flex-1 flex items-center justify-center">
                  {portal.description}
                </p>
                <button 
                  onClick={() => navigate(portal.path)}
                  className={`w-full max-w-[160px] md:max-w-[220px] py-2 md:py-3 rounded-full text-white font-black text-xs md:text-base flex justify-center items-center gap-2 bg-gradient-to-r ${portal.bgClass} shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all`}
                >
                  تسجيل الدخول
                  <span className="rotate-180 text-sm md:text-xl leading-none mb-0.5">➔</span>
                </button>
              </div>

            </motion.div>
          ))}
        </div>
      </div>

      {/* 📜 الفوتر */}
      <footer className="w-full py-3 mt-auto border-t border-white/5 bg-black/40 backdrop-blur-lg relative z-10 flex-shrink-0" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
        <div className="text-center flex flex-col items-center justify-center gap-1">
          <p className="text-[#d4af37] text-[9px] md:text-[10px] font-bold tracking-widest uppercase opacity-90">تصميم وتطوير</p>
          <p className="text-slate-200 text-[10px] md:text-xs font-mono font-semibold tracking-tighter">ALZZABI MOHAMMAD © 2026</p>
        </div>
      </footer>
      
    </div>
  );
}

// =========================================================
// 2️⃣ الموزع المركزي (Router)
// =========================================================
export default function App() {
  return (
    <HashRouter>
      <GlobalFloatingButtons /> 
      <Routes>
        <Route path="/" element={<SuperAppLanding />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/teacher/*" element={<TeacherApp />} />
        <Route path="/parent/*" element={<ParentApp />} />
        <Route path="/student/*" element={<StudentApp />} />
        <Route path="*" element={<SuperAppLanding />} />
      </Routes>
    </HashRouter>
  );
}
