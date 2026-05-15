import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, UserPlus, Send, Clock, CheckCircle2, AlertTriangle, Users, Save, X, RefreshCw, ChevronDown } from 'lucide-react';

const SeniorDashboard: React.FC = () => {
  const { teacherInfo, dir } = useApp();
  
  // 🔗 رابط سحابة الإدارة (ضع الرابط الجديد هنا)
  const ADMIN_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwZHhZ-RPWUpBGIlw0qTFPUmOPmq9WpcvW4WLklcjb_A9U3MW0luIXYPnHznI29ThpbMA/exec"; 
  const schoolCode = localStorage.getItem('rased_admin_school_code') || '';

  // 👥 حالات "فريق القسم" (Squad Builder)
  const [mySquad, setMySquad] = useState<string[]>([]);
  const [allSchoolTeachers, setAllSchoolTeachers] = useState<string[]>([]);
  const [isSquadBuilderOpen, setIsSquadBuilderOpen] = useState(false);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);
  const [tempSelectedSquad, setTempSelectedSquad] = useState<string[]>([]);

  // 📝 حالات نموذج التكليف (Form States)
  const [absentTeacher, setAbsentTeacher] = useState('');
  const [period, setPeriod] = useState('1');
  const [targetClass, setTargetClass] = useState('');
  const [subTeacher, setSubTeacher] = useState('');
  const [assignments, setAssignments] = useState<any[]>([]);

  // ⚙️ استرجاع الفريق المحفوظ مسبقاً عند فتح الشاشة
  useEffect(() => {
    const savedSquad = localStorage.getItem(`rased_squad_${teacherInfo.civilId}`);
    if (savedSquad) {
      setMySquad(JSON.parse(savedSquad));
    }
  }, [teacherInfo.civilId]);

  // 📡 جلب أسماء جميع معلمي المدرسة من سحابة الإدارة
  const fetchAllTeachers = async () => {
    if (!schoolCode) {
      alert("كود المدرسة مفقود! يرجى تسجيل الدخول مجدداً.");
      return;
    }
    setIsLoadingTeachers(true);
    try {
      // نستخدم المسار الافتراضي (doGet) الذي يرجع كل معلمي المدرسة
      const response = await fetch(`${ADMIN_SCRIPT_URL}?schoolCode=${schoolCode}`);
      const result = await response.json();
      
      if (result.status === "success" && result.data.teachers) {
        // فلترة الأسماء لمنع التكرار (لأن المعلم يتكرر مع كل حصة في الشيت)
        const uniqueNames = Array.from(new Set(result.data.teachers.map((t: any) => t.name.trim())));
        setAllSchoolTeachers(uniqueNames as string[]);
        setTempSelectedSquad(mySquad); // تحديد المعلمين المختارين سابقاً
      } else {
        alert("فشل في جلب المعلمين.");
      }
    } catch (error) {
      alert("خطأ في الاتصال بالسحابة. تحقق من الرابط أو الإنترنت.");
    } finally {
      setIsLoadingTeachers(false);
    }
  };

  const openSquadBuilder = () => {
    setIsSquadBuilderOpen(true);
    if (allSchoolTeachers.length === 0) fetchAllTeachers();
  };

  const handleToggleSquadMember = (name: string) => {
    setTempSelectedSquad(prev => 
      prev.includes(name) ? prev.filter(t => t !== name) : [...prev, name]
    );
  };

  const saveSquad = () => {
    setMySquad(tempSelectedSquad);
    localStorage.setItem(`rased_squad_${teacherInfo.civilId}`, JSON.stringify(tempSelectedSquad));
    setIsSquadBuilderOpen(false);
  };

  // 🚀 إرسال التكليف للسحابة
  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!absentTeacher || !targetClass || !subTeacher) {
      alert('الرجاء إكمال جميع بيانات التكليف');
      return;
    }

    const newAssignment = {
      action: "createSubstitution",
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('ar-OM', { hour: '2-digit', minute: '2-digit' }),
      department: teacherInfo.departmentName || "عام",
      absentTeacher: absentTeacher,
      period: `الحصة ${period}`,
      targetClass: targetClass,
      subTeacher: subTeacher,
    };

    try {
      const response = await fetch(ADMIN_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(newAssignment),
      });
      const result = await response.json();

      if (result.status === "success") {
        setAssignments([{ ...newAssignment, status: 'Assigned' }, ...assignments]);
        setAbsentTeacher(''); setTargetClass(''); setSubTeacher(''); setPeriod('1');
        alert('✅ تم إرسال التكليف للسحابة بنجاح!');
      } else {
        alert('❌ فشل الإرسال: ' + result.message);
      }
    } catch (error) {
      alert('❌ خطأ في الاتصال بالسحابة');
    }
  };

  return (
    <div className={`h-full flex flex-col p-4 md:p-6 overflow-y-auto custom-scrollbar relative ${dir === 'rtl' ? 'text-right' : 'text-left'}`} dir={dir}>
      
      {/* 🩺 رأس الصفحة */}
      <div className="flex items-center justify-between gap-4 mb-6 animate-in slide-in-from-top-4">
        <div className="flex items-center gap-4">
          <div className="bg-purple-500/10 p-3 rounded-2xl border border-purple-500/20">
            <ShieldCheck className="w-8 h-8 text-purple-500" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-textPrimary tracking-wide">مركز قيادة القسم</h1>
            <p className="text-xs font-bold text-textSecondary mt-1">
              أ. {teacherInfo.name} | إشراف: {teacherInfo.departmentName || 'عام'} | فريقك: <span className="text-purple-500">{mySquad.length} معلمين</span>
            </p>
          </div>
        </div>
        <button onClick={openSquadBuilder} className="bg-bgSoft border border-purple-500/30 text-purple-500 hover:bg-purple-500 hover:text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm">
          <Users size={16} /> <span className="hidden md:inline">تكوين الفريق</span>
        </button>
      </div>

      {mySquad.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 bg-purple-500/5 border-2 border-dashed border-purple-500/30 rounded-3xl mt-10">
          <UserPlus className="w-16 h-16 text-purple-300 mb-4" />
          <h2 className="text-xl font-black text-textPrimary mb-2">لم تقم بتكوين فريقك بعد!</h2>
          <p className="text-sm font-bold text-textSecondary mb-6 text-center max-w-md">
            لكي تتمكن من إدارة حصص الاحتياط بسهولة، قم باختيار المعلمين التابعين لقسمك ليظهروا لك تلقائياً في القوائم.
          </p>
          <button onClick={openSquadBuilder} className="bg-purple-500 text-white px-8 py-3 rounded-xl font-black flex items-center gap-2 shadow-lg hover:bg-purple-600 transition-all active:scale-95">
            <Users size={20} /> ابدأ بتكوين الفريق الآن
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* 📝 نموذج إصدار التكليفات */}
          <div className="lg:col-span-5 space-y-4 animate-in slide-in-from-right-4">
            <h2 className="text-sm font-black text-textSecondary uppercase tracking-wider px-1">إصدار تكليف احتياط جديد</h2>
            <form onSubmit={handleAssign} className="glass-card p-5 rounded-3xl border border-borderColor space-y-4">
              
              <div className="space-y-1 relative">
                <label className="text-xs font-bold text-textSecondary px-1">المعلم الغائب (من فريقك)</label>
                <div className="relative">
                  <select 
                    value={absentTeacher} onChange={(e) => setAbsentTeacher(e.target.value)}
                    className="w-full bg-bgSoft border border-borderColor rounded-xl px-4 py-3 text-sm font-bold text-textPrimary focus:border-purple-500 outline-none transition-all appearance-none"
                  >
                    <option value="">اختر المعلم الغائب...</option>
                    {mySquad.map(teacher => <option key={teacher} value={teacher}>{teacher}</option>)}
                  </select>
                  <ChevronDown className="absolute left-3 top-3.5 text-textSecondary pointer-events-none" size={18} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 relative">
                  <label className="text-xs font-bold text-textSecondary px-1">الحصة (مؤقت)</label>
                  <div className="relative">
                    <select 
                      value={period} onChange={(e) => setPeriod(e.target.value)}
                      className="w-full bg-bgSoft border border-borderColor rounded-xl px-4 py-3 text-sm font-bold text-textPrimary focus:border-purple-500 outline-none transition-all appearance-none"
                    >
                      {[1,2,3,4,5,6,7,8].map(p => <option key={p} value={p}>الحصة {p}</option>)}
                    </select>
                    <ChevronDown className="absolute left-3 top-3.5 text-textSecondary pointer-events-none" size={18} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-textSecondary px-1">الفصل المستهدف</label>
                  <input 
                    value={targetClass} onChange={(e) => setTargetClass(e.target.value)}
                    className="w-full bg-bgSoft border border-borderColor rounded-xl px-4 py-3 text-sm font-bold text-textPrimary focus:border-purple-500 outline-none transition-all"
                    placeholder="مثال: 5/1"
                  />
                </div>
              </div>

              <div className="space-y-1 relative">
                <label className="text-xs font-bold text-purple-500 px-1 flex items-center gap-1">
                  <UserPlus size={14} /> المعلم البديل (من فريقك)
                </label>
                <div className="relative">
                  <select 
                    value={subTeacher} onChange={(e) => setSubTeacher(e.target.value)}
                    className="w-full bg-purple-500/5 border border-purple-500/20 rounded-xl px-4 py-3 text-sm font-bold text-textPrimary focus:border-purple-500 outline-none transition-all appearance-none"
                  >
                    <option value="">اختر المعلم البديل...</option>
                    {mySquad.filter(t => t !== absentTeacher).map(teacher => <option key={teacher} value={teacher}>{teacher}</option>)}
                  </select>
                  <ChevronDown className="absolute left-3 top-3.5 text-purple-500 pointer-events-none" size={18} />
                </div>
              </div>

              <button type="submit" className="w-full mt-2 bg-purple-500 hover:bg-purple-600 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
                <Send size={18} /> إصدار التكليف
              </button>
            </form>
          </div>

          {/* 📊 لوحة المتابعة الحية */}
          <div className="lg:col-span-7 space-y-4 animate-in slide-in-from-left-4">
             {/* ... (اللوحة الحية ستبقى كما هي في الكود السابق) ... */}
             <h2 className="text-sm font-black text-textSecondary uppercase tracking-wider px-1">حالة التكليفات اليوم</h2>
             <div className="glass-card p-5 rounded-3xl border border-borderColor min-h-[400px]">
                {assignments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-textSecondary opacity-50 space-y-3 mt-20">
                    <Users className="w-16 h-16" />
                    <p className="font-bold">لا توجد تكليفات احتياط اليوم</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {assignments.map((task) => (
                      <div key={task.id} className="bg-bgSoft border border-borderColor rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-purple-500/50">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-xl mt-1 ${task.status === 'Executed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                            {task.status === 'Executed' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                          </div>
                          <div>
                            <h3 className="font-black text-textPrimary">{task.sub} <span className="text-textSecondary text-xs font-normal">({task.period} - صف {task.class})</span></h3>
                            <p className="text-xs font-bold text-textSecondary mt-1">بدلاً من: <span className="text-rose-500">{task.absent}</span></p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-4 min-w-[120px]">
                          <span className="text-[10px] font-bold text-textSecondary">{task.time}</span>
                          <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg ${task.status === 'Executed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                            {task.status === 'Executed' ? 'تم التنفيذ' : 'بانتظار التنفيذ'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
             </div>
          </div>
        </div>
      )}

      {/* 🛡️ نافذة تكوين الفريق (Squad Builder Modal) */}
      {isSquadBuilderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-bgCard w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-borderColor flex justify-between items-center bg-bgSoft">
              <div>
                <h2 className="text-xl font-black text-textPrimary">تكوين فريق القسم</h2>
                <p className="text-xs font-bold text-textSecondary mt-1">اختر المعلمين التابعين لإشرافك (المحدد: {tempSelectedSquad.length})</p>
              </div>
              <button onClick={() => setIsSquadBuilderOpen(false)} className="p-2 bg-rose-500/10 text-rose-500 rounded-full hover:bg-rose-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
              {isLoadingTeachers ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                  <RefreshCw className="w-8 h-8 text-purple-500 animate-spin" />
                  <p className="font-bold text-textSecondary">جاري استدعاء المعلمين من السحابة...</p>
                </div>
              ) : allSchoolTeachers.length === 0 ? (
                <div className="text-center py-10">
                  <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                  <p className="font-bold text-textPrimary">لم يتم العثور على معلمين!</p>
                  <p className="text-xs text-textSecondary mt-2">تأكد من إدخال رابط سحابة الإدارة بشكل صحيح وكود المدرسة.</p>
                  <button onClick={fetchAllTeachers} className="mt-4 text-purple-500 font-bold text-sm flex items-center gap-1 mx-auto"><RefreshCw size={14}/> إعادة المحاولة</button>
                </div>
              ) : (
                <div className="space-y-2">
                  {allSchoolTeachers.map(teacher => (
                    <label key={teacher} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${tempSelectedSquad.includes(teacher) ? 'bg-purple-500/10 border-purple-500' : 'bg-bgSoft border-borderColor hover:border-purple-500/30'}`}>
                      <span className={`font-bold text-sm ${tempSelectedSquad.includes(teacher) ? 'text-purple-600' : 'text-textPrimary'}`}>{teacher}</span>
                      <input 
                        type="checkbox" 
                        checked={tempSelectedSquad.includes(teacher)}
                        onChange={() => handleToggleSquadMember(teacher)}
                        className="w-5 h-5 accent-purple-500"
                      />
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-borderColor bg-bgSoft">
              <button onClick={saveSquad} disabled={isLoadingTeachers} className="w-full bg-purple-500 text-white font-black py-4 rounded-xl shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                <Save size={18} /> حفظ الفريق ({tempSelectedSquad.length})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SeniorDashboard;
