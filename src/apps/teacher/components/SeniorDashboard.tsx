import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, UserPlus, Send, Clock, CheckCircle2, 
  AlertTriangle, Users, Save, X, RefreshCw, ChevronDown, Calendar 
} from 'lucide-react';

const SeniorDashboard: React.FC = () => {
  const { teacherInfo, dir } = useApp();
  
  const ADMIN_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwZHhZ-RPWUpBGIlw0qTFPUmOPmq9WpcvW4WLklcjb_A9U3MW0luIXYPnHznI29ThpbMA/exec"; 
  const schoolCode = localStorage.getItem('rased_admin_school_code') || '';

  const [mySquad, setMySquad] = useState<string[]>([]);
  const [allSchoolTeachers, setAllSchoolTeachers] = useState<string[]>([]);
  const [isSquadBuilderOpen, setIsSquadBuilderOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // 📝 حالات الجدول المستدعى
  const [absentTeacher, setAbsentTeacher] = useState('');
  const [absentTeacherSchedule, setAbsentTeacherSchedule] = useState<any[]>([]);
  const [substitutions, setSubstitutions] = useState<{[key: string]: string}>({}); // لتخزين البديل لكل حصة
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    const savedSquad = localStorage.getItem(`rased_squad_${teacherInfo.civilId}`);
    if (savedSquad) setMySquad(JSON.parse(savedSquad));
  }, [teacherInfo.civilId]);

  // 🌡️ دالة تحديد اليوم الحالي باللغة العربية لتطابق شيت الإدارة
  const getCurrentArabicDay = () => {
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return days[new Date().getDay()];
  };

  // 📡 جلب جدول المعلم الغائب من السحابة
  const fetchTeacherSchedule = async (name: string) => {
    if (!name) return;
    setAbsentTeacher(name);
    setIsLoading(true);
    setAbsentTeacherSchedule([]);
    setSubstitutions({});

    try {
      const response = await fetch(`${ADMIN_SCRIPT_URL}?schoolCode=${schoolCode}`);
      const result = await response.json();
      
      if (result.status === "success") {
        const today = getCurrentArabicDay();
        // تصفية الجدول: نفس الاسم + نفس اليوم
        const schedule = result.data.teachers.filter((t: any) => 
          t.name.trim() === name.trim() && t.day.trim() === today
        );
        
        // ترتيب الحصص تصاعدياً
        schedule.sort((a: any, b: any) => parseInt(a.period) - parseInt(b.period));
        setAbsentTeacherSchedule(schedule);
      }
    } catch (error) {
      alert("خطأ في جلب الجدول");
    } finally {
      setIsLoading(false);
    }
  };

  // 🚀 إرسال جميع التكليفات دفعة واحدة
  const handleBulkAssign = async () => {
    const tasksToSubmit = absentTeacherSchedule.map(item => ({
      action: "createSubstitution",
      id: `${Date.now()}_${item.period}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('ar-OM', { hour: '2-digit', minute: '2-digit' }),
      department: teacherInfo.departmentName || "عام",
      absentTeacher: absentTeacher,
      period: `الحصة ${item.period}`,
      targetClass: item.className,
      subTeacher: substitutions[item.period] || "لم يحدد",
    })).filter(task => task.subTeacher !== "لم يحدد");

    if (tasksToSubmit.length === 0) {
      alert("الرجاء اختيار معلم بديل واحد على الأقل");
      return;
    }

    setIsLoading(true);
    try {
      // إرسال كل تكليف على حدة (أو يمكن تعديل السيرفر لاستقبال مصفوفة)
      for (const task of tasksToSubmit) {
        await fetch(ADMIN_SCRIPT_URL, { method: 'POST', body: JSON.stringify(task) });
      }
      alert(`✅ تم إرسال ${tasksToSubmit.length} تكليفات بنجاح!`);
      setAbsentTeacher('');
      setAbsentTeacherSchedule([]);
    } catch (e) {
      alert("خطأ في الإرسال الجماعي");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`h-full flex flex-col p-4 md:p-6 overflow-y-auto custom-scrollbar relative ${dir === 'rtl' ? 'text-right' : 'text-left'}`} dir={dir}>
      
      {/* الرأس كما هو سابقاً مع زر تكوين الفريق */}
      <div className="flex items-center justify-between gap-4 mb-6 animate-in slide-in-from-top-4">
        <div className="flex items-center gap-4">
          <div className="bg-purple-500/10 p-3 rounded-2xl border border-purple-500/20">
            <ShieldCheck className="w-8 h-8 text-purple-500" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-textPrimary tracking-wide">رادار حصص الاحتياط</h1>
            <p className="text-xs font-bold text-textSecondary mt-1">إشراف: {teacherInfo.departmentName}</p>
          </div>
        </div>
        <button onClick={() => setIsSquadBuilderOpen(true)} className="bg-purple-500/10 text-purple-500 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
          <Users size={16} /> الفريق
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 📝 الجزء الأول: اختيار الغائب واستدعاء جدوله */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card p-5 rounded-3xl border border-borderColor">
            <label className="text-xs font-black text-textSecondary mb-2 block uppercase tracking-widest">1. اختر المعلم الغائب اليوم</label>
            <div className="relative">
              <select 
                value={absentTeacher} 
                onChange={(e) => fetchTeacherSchedule(e.target.value)}
                className="w-full bg-bgSoft border border-borderColor rounded-xl px-4 py-4 text-sm font-black text-textPrimary appearance-none focus:border-purple-500 outline-none"
              >
                <option value="">-- اضغط للاختيار من فريقك --</option>
                {mySquad.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown className="absolute left-4 top-4.5 text-textSecondary" size={18} />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center p-10"><RefreshCw className="animate-spin text-purple-500" /></div>
          ) : absentTeacherSchedule.length > 0 ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 space-y-4">
              <div className="flex items-center gap-2 px-2 text-purple-600 font-bold text-sm">
                <Calendar size={16} /> جدول {absentTeacher} ليوم {getCurrentArabicDay()}
              </div>
              
              {absentTeacherSchedule.map((item, idx) => (
                <div key={idx} className="glass-card p-4 rounded-2xl border border-borderColor bg-bgSoft/50 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="bg-purple-500 text-white text-[10px] font-black px-2 py-1 rounded-md">الحصة {item.period}</span>
                    <span className="font-black text-sm text-textPrimary">صف: {item.className}</span>
                  </div>
                  <select 
                    onChange={(e) => setSubstitutions({...substitutions, [item.period]: e.target.value})}
                    className="w-full bg-white border border-borderColor rounded-lg px-3 py-2 text-xs font-bold text-textPrimary outline-none focus:border-emerald-500"
                  >
                    <option value="">اختر المعلم البديل لهذه الحصة...</option>
                    {mySquad.filter(t => t !== absentTeacher).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              ))}

              <button 
                onClick={handleBulkAssign}
                className="w-full py-4 bg-emerald-500 text-white font-black rounded-2xl shadow-lg hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
              >
                <Send size={18} /> اعتماد وإرسال التكليفات
              </button>
            </div>
          ) : absentTeacher && (
            <div className="text-center p-10 text-textSecondary font-bold text-xs">لا يوجد حصص مسجلة لهذا المعلم اليوم</div>
          )}
        </div>

        {/* 📊 الجزء الثاني: رادار المتابعة (يبقى كما هو لعرض النتائج) */}
        <div className="lg:col-span-7">
           <h2 className="text-sm font-black text-textSecondary uppercase mb-4 px-1">حالة التنفيذ اللحظية</h2>
           <div className="glass-card p-5 rounded-3xl border border-borderColor min-h-[400px]">
              {/* هنا نعرض التكليفات التي تم جلبها من السحابة للمتابعة */}
              <p className="text-[10px] text-center text-textSecondary">سيتم عرض التكليفات النشطة هنا لمتابعة دخول المعلمين للفصول</p>
           </div>
        </div>
      </div>

      {/* مودال تكوين الفريق (Squad Builder) يبقى كما هو */}
    </div>
  );
};

export default SeniorDashboard;
