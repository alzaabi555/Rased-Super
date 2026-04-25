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
// 1️⃣ الشاشة الرئيسية الفاخرة (البانر الممتد + تأثير الانقلاب السحري)
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
    <div className="min-h-screen flex flex-col font-sans overflow-y-auto overflow-x-hidden bg-gradient-to-br from-[#041126] via-[#0a1930] to-[#061b3b] relative text-white" dir="rtl">
      
      {/* 🌌 تأثيرات الخلفية */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* 👑 الهيدر (البانر الممتد) */}
      <header className="relative w-full z-10 shadow-2xl border-b border-white/10 bg-black/20">
        <div className="relative w-full h-[220px] md:h-[320px] overflow-hidden">
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
             <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-l from-[#d4af37] to-[#fbf5b7] mb-2 tracking-wide">
              منظومة راصد التعليمية
            </h1>
            <p className="text-xs md:text-base text-blue-100/70 font-medium">الرجاء إضافة صورة banner.png في مجلد public</p>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#041126] to-transparent pointer-events-none"></div>
        </div>
      </header>

      {/* 🏛️ الشبكة التفاعلية (تم تطبيق مبدأ الانقلاب الكامل) */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10 w-full max-w-5xl mx-auto mb-6 mt-2 md:mt-6">
        <div className="grid grid-cols-2 gap-4 md:gap-8 w-full">
          {portals.map((portal, idx) => (
            <motion.div
              key={portal.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl hover:shadow-[0_0_40px_rgba(255,255,255,0.08)] transition-all duration-500 flex flex-col items-center justify-center min-h-[220px] md:min-h-[320px]"
            >
              {/* لمعة زجاجية خلفية */}
              <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${portal.bgClass} opacity-10 rounded-full blur-[40px] group-hover:opacity-40 transition-opacity duration-500`}></div>

              {/* 1️⃣ الحالة الافتراضية: (أيقونة كبيرة + العنوان) تختفي تماماً وتتلاشى للخلف */}
              <div className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out group-hover:opacity-0 group-hover:scale-75 group-hover:-translate-y-10">
                <div className="w-24 h-24 md:w-36 md:h-36 mb-4 md:mb-6">
                  <img src={portal.iconPath} alt={portal.title} className="w-full h-full object-contain drop-shadow-2xl" />
                </div>
                <h2 className="text-xl md:text-3xl font-black text-white text-center px-2 drop-shadow-lg">{portal.title}</h2>
              </div>

              {/* 2️⃣ حالة اللمس/المرور: (تختفي الأيقونة والعنوان كلياً، ويظهر الوصف والزر ليأخذا كل المساحة) */}
              <div className="absolute inset-0 p-5 md:p-10 flex flex-col items-center justify-center bg-[#061b3b]/95 backdrop-blur-md opacity-0 scale-125 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-out">
                {/* 💉 أزلنا العنوان من هنا، وجعلنا النص التعريفي يتوسط المساحة بالكامل بخط أكبر */}
                <p className="text-sm md:text-xl text-blue-50 text-center mb-6 md:mb-10 font-bold leading-loose flex-1 flex items-center justify-center">
                  {portal.description}
                </p>
                <button 
                  onClick={() => navigate(portal.path)}
                  className={`w-full max-w-[200px] md:max-w-[250px] py-3.5 md:py-4 rounded-full text-white font-black text-sm md:text-lg flex justify-center items-center gap-3 bg-gradient-to-r ${portal.bgClass} shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all`}
                >
                  تسجيل الدخول
                  <span className="rotate-180 text-xl md:text-2xl leading-none mb-0.5">➔</span>
                </button>
              </div>

            </motion.div>
          ))}
        </div>
      </div>

      {/* 📜 الفوتر */}
      <footer className="w-full py-5 mt-auto border-t border-white/5 bg-black/40 backdrop-blur-lg relative z-10" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        <div className="text-center flex flex-col items-center justify-center gap-1.5">
          <p className="text-[#d4af37] text-[10px] md:text-xs font-bold tracking-widest uppercase opacity-90">تصميم وتطوير</p>
          <p className="text-slate-200 text-xs md:text-sm font-mono font-semibold tracking-tighter">ALZZABI MOHAMMAD © 2026</p>
          <p className="text-slate-500 text-[9px] md:text-[10px] opacity-70">كافة الحقوق محفوظة للمنظومة</p>
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
