import React from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home } from 'lucide-react';

// 💉 استيراد كافة أفراد العائلة
import TeacherApp from "./apps/teacher/App.tsx";
import AdminApp from "./apps/admin/App.tsx";
import ParentApp from "./apps/parent/App.tsx";
import StudentApp from "./apps/student/App.tsx";

// =========================================================
// 💉 زر الطوارئ العائم (للعودة للرئيسية)
// =========================================================
function GlobalHomeButton() {
  const location = useLocation();
  if (location.pathname === '/') return null;

  return (
    <button
      onClick={() => window.location.hash = '#/'}
      style={{ top: 'max(1.2rem, calc(env(safe-area-inset-top) - 0.2rem))' }}
      className="fixed left-6 z-[99999] flex items-center justify-center w-12 h-12 bg-white/20 dark:bg-black/40 backdrop-blur-xl border border-white/30 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-300"
      title="العودة للرئيسية"
    >
      <Home className="text-gray-800 dark:text-white" size={24} />
    </button>
  );
}

// =========================================================
// 1️⃣ الشاشة الرئيسية الفاخرة (نظام الشبكة التفاعلية)
// =========================================================
function SuperAppLanding() {
  const navigate = useNavigate();
  
  const portals = [
    { 
      id: 'teacher', 
      title: 'بوابة المعلم', 
      description: 'أدوات ذكية لرصد الحضور، تسجيل المخالفات، ومتابعة الأداء الأكاديمي للطلاب بكل يسر.', 
      iconPath: '/icons/teacher.png', 
      bgClass: 'from-[#FF9A22] to-[#FF7A00]', 
      path: '/teacher' 
    },
    { 
      id: 'admin', 
      title: 'بوابة الإدارة', 
      description: 'لوحة تحكم متطورة لمتابعة الإحصائيات واستخراج التقارير لدعم اتخاذ القرارات السريعة.', 
      iconPath: '/icons/admin.png', 
      bgClass: 'from-[#8C6DFD] to-[#6A48F5]', 
      path: '/admin' 
    },
    { 
      id: 'student', 
      title: 'بوابة الطالب', 
      description: 'الحقيبة الإلكترونية للرفيق اليومي؛ لمتابعة الإنجازات، الجدول الدراسي، والتوجيهات.', 
      iconPath: '/icons/student.png', 
      bgClass: 'from-[#33A8FF] to-[#007AFF]', 
      path: '/student' 
    },
    { 
      id: 'parent', 
      title: 'بوابة ولي الأمر', 
      description: 'حلقة الوصل بين البيت والمدرسة لمتابعة مستوى الأبناء، سجلات الحضور، والملاحظات.', 
      iconPath: '/icons/parent.png', 
      bgClass: 'from-[#2AC98E] to-[#00A865]', 
      path: '/parent' 
    },
  ];

  return (
    // 💉 تم تغيير overflow-hidden إلى overflow-y-auto ليسمح بالنزول للفوتر براحة تامة
    <div className="min-h-screen flex flex-col font-sans overflow-y-auto overflow-x-hidden bg-gradient-to-br from-[#041126] via-[#0a1930] to-[#061b3b] relative text-white" dir="rtl">
      
      {/* 🌌 تأثيرات الخلفية الفاخرة */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* 👑 الهيدر */}
      <header className="pt-16 md:pt-20 pb-6 px-6 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-l from-[#d4af37] to-[#fbf5b7] mb-3 tracking-wide drop-shadow-lg">
            منظومة راصد التعليمية
          </h1>
          <p className="text-xs md:text-base text-blue-100/80 font-medium max-w-2xl mx-auto leading-relaxed">
            منظومة رقمية متكاملة لربط أقطاب العملية التعليمية في بيئة ذكية واحدة. تعزيز للتواصل، تسريع للإنجاز، ورفع لكفاءة الأداء.
          </p>
        </motion.div>
      </header>

      {/* 🏛️ منطقة المحتوى الرئيسي (الشبكة التفاعلية) */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10 w-full max-w-5xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
          {portals.map((portal, idx) => (
            <motion.div
              key={portal.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              // 💉 الكلاسات السحرية: group هي التي تفعل كل السحر عند المرور بالماوس
              className="group relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500 flex flex-col items-center justify-center min-h-[260px] md:min-h-[300px]"
            >
              {/* لمعة زجاجية خلفية للمربع */}
              <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${portal.bgClass} opacity-20 rounded-full blur-[50px] transition-opacity duration-500 group-hover:opacity-40`}></div>

              {/* الحالة الافتراضية (أيقونة وعنوان) ترتفع للأعلى عند الـ Hover */}
              <div className="absolute flex flex-col items-center justify-center w-full h-full transition-transform duration-500 group-hover:-translate-y-16">
                <div className="w-24 h-24 md:w-28 md:h-28 mb-4">
                  <img src={portal.iconPath} alt={portal.title} className="w-full h-full object-contain drop-shadow-2xl" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">{portal.title}</h2>
              </div>

              {/* المعلومات والزر (مخفية وتظهر من الأسفل عند الـ Hover) */}
              <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col items-center justify-end bg-gradient-to-t from-[#041126] via-[#041126]/80 to-transparent translate-y-[120%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <p className="text-sm md:text-base text-blue-100/90 text-center mb-5 max-w-sm leading-relaxed">
                  {portal.description}
                </p>
                <button 
                  onClick={() => navigate(portal.path)}
                  className={`px-8 py-3 rounded-full text-white font-bold text-sm md:text-base flex items-center gap-2 bg-gradient-to-r ${portal.bgClass} shadow-lg hover:scale-105 active:scale-95 transition-all duration-300`}
                >
                  الدخول للنظام
                  <span className="rotate-180 text-lg leading-none mb-0.5">➔</span>
                </button>
              </div>

            </motion.div>
          ))}
        </div>
      </div>

      {/* 📜 الفوتر (تم إصلاح ظهوره بالكامل) */}
      <footer className="w-full py-6 mt-auto border-t border-white/10 bg-black/30 backdrop-blur-md relative z-10" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
        <div className="text-center flex flex-col items-center justify-center gap-1.5">
          <p className="text-[#d4af37] text-xs md:text-sm font-bold tracking-widest">تصميم وتطوير</p>
          {/* 💉 اسم المطور الآن سيظهر بوضوح تام */}
          <p className="text-slate-300 text-[10px] md:text-xs font-mono font-medium">ALZZABI MOHAMMAD © 2026</p>
          <p className="text-slate-500 text-[9px] md:text-[10px]">جميع الحقوق محفوظة</p>
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
      <GlobalHomeButton /> 
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
