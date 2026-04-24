import React from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';

// 💉 استيراد كافة أفراد العائلة
import TeacherApp from "./apps/teacher/App.tsx";
import AdminApp from "./apps/admin/App.tsx";
import ParentApp from "./apps/parent/App.tsx";
import StudentApp from "./apps/student/App.tsx";

// =========================================================
// 💉 زر الطوارئ العائم (للعودة للرئيسية من أي تطبيق)
// =========================================================
function GlobalHomeButton() {
  const location = useLocation();
  
  // إخفاء الزر إذا كنا في البوابة الرئيسية
  if (location.pathname === '/') return null;

  return (
    <button
    onClick={() => window.location.hash = '#/'}
      className="fixed top-6 left-6 z-[99999] flex items-center justify-center w-12 h-12 bg-white/20 dark:bg-black/40 backdrop-blur-xl border border-white/30 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-300"
      title="العودة للرئيسية"
    >
      <Home className="text-gray-800 dark:text-white" size={24} />
    </button>
  );
}

// =========================================================
// 1️⃣ الشاشة الرئيسية (تمت مطابقتها بالصورة المرفقة 100%)
// =========================================================
function SuperAppLanding() {
  const navigate = useNavigate();

  // ترتيب البطاقات وتلوينها تماماً كما في التصميم المرفق
  const portals = [
    { id: 'teacher', title: 'بوابة المعلم', subtitle: 'رصد الغياب والمخالفات', icon: Users, bgClass: 'from-[#FF9A22] to-[#FF7A00]', path: '/teacher' },
    { id: 'admin', title: 'بوابة الإدارة', subtitle: 'متابعة وإحصائيات', icon: School, bgClass: 'from-[#8C6DFD] to-[#6A48F5]', path: '/admin' },
    { id: 'student', title: 'بوابة الطالب', subtitle: 'الحقيبة الإلكترونية المتكاملة', icon: GraduationCap, bgClass: 'from-[#33A8FF] to-[#007AFF]', path: '/student' },
    { id: 'parent', title: 'بوابة ولي الأمر', subtitle: 'متابعة مستوى الأبناء', icon: UserCircle2, bgClass: 'from-[#2AC98E] to-[#00A865]', path: '/parent' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-hidden" style={{ backgroundColor: '#061b3b' }} dir="rtl">
      
      {/* 🌌 الجزء العلوي (الداكن) */}
      <div className="pt-16 pb-12 px-6 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-wide drop-shadow-lg">منظومة راصد</h1>
          <p className="text-sm md:text-base text-blue-100/80 font-medium">المنصة التعليمية لربط أقطاب العملية التربوية بذكاء</p>
        </motion.div>
      </div>

      {/* ⬜ الجزء السفلي (الأبيض مع الحواف الدائرية المطابق للصورة) */}
      <div className="flex-1 bg-white rounded-t-[2.5rem] md:rounded-t-[4rem] px-5 pt-8 pb-6 flex flex-col items-center shadow-[0_-10px_40px_rgba(0,0,0,0.2)] relative z-20">
        
        <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-md mx-auto mt-2">
          {portals.map((portal, idx) => (
            <motion.button
              key={portal.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => navigate(portal.path)}
              className={`relative overflow-hidden flex flex-col items-center text-center p-5 rounded-[2rem] bg-gradient-to-b ${portal.bgClass} shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}
            >
              {/* لمعة علوية خفيفة لإعطاء بُعد 3D للبطاقة */}
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent opacity-60 rounded-t-[2rem] pointer-events-none"></div>

              {/* حاوية الأيقونة الزجاجية (تشبه المرفق مع المثلث السفلي) */}
              <div className="relative w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center mb-5 shadow-inner">
                <portal.icon size={42} className="text-white drop-shadow-md md:w-12 md:h-12" strokeWidth={1.5} />
                {/* المثلث الزجاجي السفلي */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/20 backdrop-blur-md rotate-45 border-b border-r border-white/30"></div>
              </div>

              {/* النصوص */}
              <h2 className="text-white text-lg md:text-xl font-bold mb-1 drop-shadow-sm">{portal.title}</h2>
              <p className="text-white/90 text-[10px] md:text-xs font-medium leading-tight">{portal.subtitle}</p>
              
            </motion.button>
          ))}
        </div>

        {/* الفوتر */}
        <div className="mt-auto pt-10 text-center text-slate-400 text-[10px] font-bold font-mono">
          برمجة وتطوير: ALZZABI MOHAMMAD © 2026
        </div>
      </div>
    </div>
  );
}

// =========================================================
// 2️⃣ الموزع المركزي (Router) - لم يتم المساس به إطلاقاً
// =========================================================
export default function App() {
  return (
    <BrowserRouter>
      {/* 💉 حقن زر العودة هنا ليعمل فوق كل التطبيقات */}
      <GlobalHomeButton /> 
      
      <Routes>
        <Route path="/" element={<SuperAppLanding />} />
        
        {/* ربط المسارات بالتطبيقات المعزولة */}
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/teacher/*" element={<TeacherApp />} />
        <Route path="/parent/*" element={<ParentApp />} />
        <Route path="/student/*" element={<StudentApp />} />
        
        {/* العودة للرئيسية في حال فقدان المسار */}
        <Route path="*" element={<SuperAppLanding />} />
      </Routes>
    </BrowserRouter>
  );
}
