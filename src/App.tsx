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
      style={{ top: 'max(1rem, calc(env(safe-area-inset-top) - 0.2rem))' }}
      className="fixed left-4 z-[99999] flex items-center justify-center w-10 h-10 bg-white/20 dark:bg-black/40 backdrop-blur-xl border border-white/30 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-300"
      title="العودة للرئيسية"
    >
      <Home className="text-gray-800 dark:text-white" size={20} />
    </button>
  );
}

// =========================================================
// 1️⃣ الشاشة الرئيسية الفاخرة (النسخة الإعلانية الرشيقة)
// =========================================================
function SuperAppLanding() {
  const navigate = useNavigate();
  
  const portals = [
    { 
      id: 'teacher', 
      title: 'بوابة المعلم', 
      description: 'أدوات ذكية لرصد الحضور، تسجيل المخالفات، ومتابعة الأداء الأكاديمي.', 
      iconPath: 'icons/teacher.png', 
      bgClass: 'from-[#FF9A22] to-[#FF7A00]', 
      path: '/teacher' 
    },
    { 
      id: 'admin', 
      title: 'بوابة الإدارة', 
      description: 'لوحة تحكم لمتابعة الإحصائيات والتقارير لدعم القرارات السريعة.', 
      iconPath: 'icons/admin.png', 
      bgClass: 'from-[#8C6DFD] to-[#6A48F5]', 
      path: '/admin' 
    },
    { 
      id: 'student', 
      title: 'بوابة الطالب', 
      description: 'الحقيبة الإلكترونية لمتابعة الإنجازات والجدول الدراسي والتوجيهات.', 
      iconPath: 'icons/student.png', 
      bgClass: 'from-[#33A8FF] to-[#007AFF]', 
      path: '/student' 
    },
    { 
      id: 'parent', 
      title: 'بوابة ولي الأمر', 
      description: 'حلقة الوصل لمتابعة مستوى الأبناء وسجلات الحضور والملاحظات.', 
      iconPath: 'icons/parent.png', 
      bgClass: 'from-[#2AC98E] to-[#00A865]', 
      path: '/parent' 
    },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-y-auto overflow-x-hidden bg-gradient-to-br from-[#041126] via-[#0a1930] to-[#061b3b] relative text-white" dir="rtl">
      
      {/* 🌌 تأثيرات الخلفية */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]"></div>
      </div>

      {/* 👑 الهيدر (البانر الإعلاني الفاخر) */}
      <header className="pt-12 md:pt-16 pb-2 px-4 md:px-6 text-center relative z-10 w-full max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -15 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="relative w-full rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 group bg-black/20 backdrop-blur-sm"
        >
          {/* 💉 مسار صورة البانر (يجب رفع صورة باسم banner.png) */}
          <img 
            src="banner.png" 
            alt="منظومة راصد التعليمية" 
            className="w-full h-auto max-h-[180px] md:max-h-[250px] object-cover group-hover:scale-105 transition-transform duration-700" 
            /* في حال عدم وجود الصورة بعد، سيظهر هذا النص البديل الأنيق */
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          {/* نص بديل يظهر فقط إذا لم تقم برفع صورة البانر */}
          <div className="hidden py-12 md:py-16">
             <h1 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-l from-[#d4af37] to-[#fbf5b7] mb-2 tracking-wide">
              منظومة راصد التعليمية
            </h1>
            <p className="text-[10px] md:text-sm text-blue-100/70 font-medium">الرجاء إضافة صورة banner.png في مجلد public</p>
          </div>
          
          {/* طبقة تظليل سفلية خفيفة لدمج الصورة مع الخلفية */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#041126]/60 via-transparent to-transparent pointer-events-none"></div>
        </motion.div>
      </header>

      {/* 🏛️ الشبكة التفاعلية الرشيقة */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-6 relative z-10 w-full max-w-4xl mx-auto mb-6">
        <div className="grid grid-cols-2 gap-3 md:gap-6 w-full max-w-3xl">
          {portals.map((portal, idx) => (
            <motion.div
              key={portal.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative overflow-hidden bg-white/5 backdrop-blur-lg border border-white/10 rounded-[1.5rem] md:rounded-[2rem] shadow-lg hover:shadow-white/5 transition-all duration-500 flex flex-col items-center justify-center min-h-[180px] md:min-h-[260px]"
            >
              <div className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${portal.bgClass} opacity-10 rounded-full blur-[30px] group-hover:opacity-30 transition-opacity`}></div>

              {/* 💉 الحالة الافتراضية (تم تكبير الأيقونات بشكل ملحوظ) */}
              <div className="absolute flex flex-col items-center justify-center w-full h-full transition-transform duration-500 group-hover:-translate-y-12 md:group-hover:-translate-y-16">
                <div className="w-20 h-20 md:w-32 md:h-32 mb-2 md:mb-4">
                  <img src={portal.iconPath} alt={portal.title} className="w-full h-full object-contain drop-shadow-2xl" />
                </div>
                <h2 className="text-base md:text-2xl font-black text-white text-center px-2 drop-shadow-md">{portal.title}</h2>
              </div>

              {/* المعلومات والزر (تحسين الظهور) */}
              <div className="absolute bottom-0 left-0 w-full p-3 md:p-6 flex flex-col items-center justify-end bg-gradient-to-t from-[#041126] via-[#041126]/95 to-transparent translate-y-[110%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <p className="text-[10px] md:text-sm text-blue-100/90 text-center mb-3 md:mb-4 font-medium line-clamp-2 md:line-clamp-none leading-relaxed">
                  {portal.description}
                </p>
                <button 
                  onClick={() => navigate(portal.path)}
                  className={`px-5 py-2 md:px-8 md:py-3 rounded-full text-white font-bold text-xs md:text-base flex items-center gap-2 bg-gradient-to-r ${portal.bgClass} shadow-lg hover:scale-105 active:scale-95 transition-all`}
                >
                  دخول للنظام
                  <span className="rotate-180 text-sm md:text-lg">➔</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 📜 الفوتر المصلح */}
      <footer className="w-full py-4 mt-auto border-t border-white/5 bg-black/40 backdrop-blur-lg relative z-10" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        <div className="text-center flex flex-col items-center justify-center gap-1">
          <p className="text-[#d4af37] text-[10px] font-bold tracking-widest uppercase opacity-80">تصميم وتطوير</p>
          <p className="text-slate-200 text-[11px] md:text-sm font-mono font-semibold tracking-tighter">ALZZABI MOHAMMAD © 2026</p>
          <p className="text-slate-500 text-[8px] md:text-[9px] opacity-60">كافة الحقوق محفوظة للمنظومة</p>
        </div>
      </footer>
      
    </div>
  );
}

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
