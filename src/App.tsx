import React, { useState } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home } from 'lucide-react'; // 💉 أبقينا زر الطوارئ فقط من المكتبة

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
      style={{ top: 'max(1.2rem, calc(env(safe-area-inset-top) - 0.2rem))' }}
      className="fixed left-6 z-[99999] flex items-center justify-center w-12 h-12 bg-white/20 dark:bg-black/40 backdrop-blur-xl border border-white/30 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-300"
      title="العودة للرئيسية"
    >
      <Home className="text-gray-800 dark:text-white" size={24} />
    </button>
  );
}

// =========================================================
// 1️⃣ الشاشة الرئيسية الفاخرة (المنصة التفاعلية)
// =========================================================
function SuperAppLanding() {
  const navigate = useNavigate();
  
  // 💉 بيانات البوابات مع ربط المسارات بالصور التي سترفعها
  const portals = [
    { 
      id: 'teacher', 
      title: 'بوابة المعلم', 
      description: 'المساعد الرقمي الأول للمعلم. يوفر أدوات ذكية لرصد الحضور والغياب لحظياً، تسجيل السلوكيات والمخالفات، ومتابعة الأداء الأكاديمي للطلاب بكل يسر وسهولة، بعيداً عن السجلات الورقية التقليدية.', 
      iconPath: '/icons/teacher.png', 
      bgClass: 'from-[#FF9A22] to-[#FF7A00]', 
      path: '/teacher' 
    },
    { 
      id: 'admin', 
      title: 'بوابة الإدارة', 
      description: 'لوحة تحكم قيادية متطورة تضع المدرسة بأكملها بين يدي الإدارة. تتيح متابعة الإحصائيات الدقيقة، مراقبة انضباط الطلاب، واستخراج التقارير الشاملة لدعم اتخاذ القرارات السريعة والحاسمة.', 
      iconPath: '/icons/admin.png', 
      bgClass: 'from-[#8C6DFD] to-[#6A48F5]', 
      path: '/admin' 
    },
    { 
      id: 'student', 
      title: 'بوابة الطالب', 
      description: 'الحقيبة الإلكترونية الذكية والرفيق اليومي للطالب. مساحة تفاعلية تتيح للطالب متابعة إنجازاته، جدوله الدراسي، وتلقي التوجيهات المستمرة لتحفيزه على التفوق والتميز الأكاديمي.', 
      iconPath: '/icons/student.png', 
      bgClass: 'from-[#33A8FF] to-[#007AFF]', 
      path: '/student' 
    },
    { 
      id: 'parent', 
      title: 'بوابة ولي الأمر', 
      description: 'حلقة الوصل المباشرة والشفافة بين البيت والمدرسة. نافذة تتيح للآباء متابعة مستوى أبنائهم، سجلات الحضور، والملاحظات السلوكية لحظة بلحظة، لضمان الرعاية الأسرية المتكاملة.', 
      iconPath: '/icons/parent.png', 
      bgClass: 'from-[#2AC98E] to-[#00A865]', 
      path: '/parent' 
    },
  ];

  // حالة التحكم في التطبيق المفتوح حالياً (الافتراضي هو المعلم)
  const [activePortal, setActivePortal] = useState(portals[0]);

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-hidden bg-gradient-to-br from-[#041126] via-[#0a1930] to-[#061b3b] relative" dir="rtl">
      
      {/* 🌌 تأثيرات الخلفية الفاخرة */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* 👑 الهيدر: نبذة المنظومة */}
      <header className="pt-16 md:pt-20 pb-6 px-6 text-center relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-md">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-l from-[#d4af37] to-[#fbf5b7] mb-3 tracking-wide drop-shadow-lg">
            منظومة راصد التعليمية
          </h1>
          <p className="text-xs md:text-base text-blue-100/80 font-medium max-w-3xl mx-auto leading-relaxed">
            منظومة رقمية متكاملة تهدف إلى رقمنة البيئة المدرسية وربط أقطاب العملية التعليمية في بيئة ذكية واحدة. نسعى لتعزيز التواصل، تسريع الإنجاز، ورفع كفاءة الأداء الأكاديمي.
          </p>
        </motion.div>
      </header>

      {/* 🏛️ منطقة المحتوى الرئيسي */}
      <div className="flex-1 flex flex-col md:flex-row relative z-20 w-full max-w-7xl mx-auto p-4 md:p-8 gap-6">
        
        {/* 📑 القائمة (أفقية في الجوال، وجانبية في الكمبيوتر) */}
        <div className="w-full md:w-1/3 flex flex-row md:flex-col gap-3 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
          {portals.map((portal) => {
            const isActive = activePortal.id === portal.id;
            return (
              <button
                key={portal.id}
                onClick={() => setActivePortal(portal)}
                className={`relative flex-shrink-0 md:flex-shrink flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl transition-all duration-300 border ${
                  isActive 
                  ? 'bg-white/10 border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.05)]' 
                  : 'bg-transparent border-transparent hover:bg-white/5'
                }`}
              >
                {/* 💉 استدعاء الصور التي رفعتها أنت */}
                <div className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl shadow-lg p-1 bg-white/5 border border-white/10`}>
                  <img src={portal.iconPath} alt={portal.title} className="w-full h-full object-contain drop-shadow-md" />
                </div>
                
                <span className={`text-sm md:text-lg font-bold whitespace-nowrap ${isActive ? 'text-white' : 'text-slate-400'}`}>
                  {portal.title}
                </span>
                
                {/* مؤشر ذهبي جانبي يظهر للشاشة النشطة */}
                {isActive && (
                  <motion.div layoutId="activeIndicator" className="absolute hidden md:block right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-gradient-to-b from-[#d4af37] to-[#fbf5b7] rounded-l-full" />
                )}
                {/* مؤشر ذهبي سفلي للجوال */}
                {isActive && (
                  <motion.div layoutId="activeIndicatorMobile" className="absolute md:hidden bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-[#d4af37] to-[#fbf5b7] rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* 🖥️ منطقة العرض بالمنتصف (شاشة التفاصيل) */}
        <div className="w-full md:w-2/3 flex items-center justify-center mt-2 md:mt-0">
          <motion.div 
            key={activePortal.id}
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(5px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-12 shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
          >
            {/* لمعة زجاجية خلفية للمربع */}
            <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${activePortal.bgClass} opacity-20 rounded-full blur-[50px]`}></div>

            {/* أيقونة التطبيق الكبيرة */}
            <div className="w-24 h-24 md:w-32 md:h-32 mb-6 relative z-10">
               <img src={activePortal.iconPath} alt={activePortal.title} className="w-full h-full object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-500" />
            </div>
            
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6 relative z-10">{activePortal.title}</h2>
            
            <p className="text-sm md:text-lg text-blue-100/90 leading-loose mb-8 md:mb-10 max-w-2xl relative z-10">
              {activePortal.description}
            </p>

            {/* زر الدخول التفاعلي */}
            <button 
              onClick={() => navigate(activePortal.path)}
              className={`relative z-10 px-8 py-3 md:px-10 md:py-4 rounded-full text-white font-bold text-base md:text-lg flex items-center gap-3 bg-gradient-to-r ${activePortal.bgClass} shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-300 group`}
            >
              تسجيل الدخول للنظام
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
                <span className="rotate-180 text-sm">➔</span>
              </div>
            </button>
          </motion.div>
        </div>

      </div>

      {/* 📜 الفوتر */}
      <footer className="mt-auto py-5 border-t border-white/10 bg-black/20 backdrop-blur-md relative z-10">
        <div className="text-center">
          <p className="text-[#d4af37] text-[11px] md:text-xs font-bold tracking-widest mb-1">تصميم وتطوير</p>
          <p className="text-slate-400 text-[9px] md:text-[10px] font-mono">ALZZABI MOHAMMAD © 2026 - جميع الحقوق محفوظة</p>
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
