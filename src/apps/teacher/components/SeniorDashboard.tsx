import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, UserPlus, Send, Clock, CheckCircle2, AlertTriangle, Users } from 'lucide-react';

const SeniorDashboard: React.FC = () => {
  const { teacherInfo, dir } = useApp();

  // 📝 حالات النموذج (Form States)
  const [absentTeacher, setAbsentTeacher] = useState('');
  const [period, setPeriod] = useState('1');
  const [targetClass, setTargetClass] = useState('');
  const [subTeacher, setSubTeacher] = useState('');

  // 📊 سجل التكليفات الوهمي (سيتم ربطه بالسحابة لاحقاً)
  const [assignments, setAssignments] = useState([
    { id: 1, absent: 'أ. أحمد (رياضيات)', sub: 'أ. خالد', class: '5/1', period: 'الحصة 3', status: 'Assigned', time: '08:00 ص' },
    { id: 2, absent: 'أ. محمود (رياضيات)', sub: 'أ. ياسر', class: '6/2', period: 'الحصة 1', status: 'Executed', time: '07:15 ص' },
  ]);

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!absentTeacher || !targetClass || !subTeacher) {
      alert('الرجاء إكمال جميع بيانات التكليف');
      return;
    }

    const newAssignment = {
      id: Date.now(),
      absent: absentTeacher,
      sub: subTeacher,
      class: targetClass,
      period: `الحصة ${period}`,
      status: 'Assigned',
      time: new Date().toLocaleTimeString('ar-OM', { hour: '2-digit', minute: '2-digit' })
    };

    setAssignments([newAssignment, ...assignments]);
    
    // تفريغ الحقول بعد الإرسال
    setAbsentTeacher('');
    setTargetClass('');
    setSubTeacher('');
    setPeriod('1');
    
    alert('تم إصدار التكليف بنجاح! (الربط السحابي قادم في الخطوة التالية)');
  };

  return (
    <div className={`h-full flex flex-col p-4 md:p-6 overflow-y-auto custom-scrollbar ${dir === 'rtl' ? 'text-right' : 'text-left'}`} dir={dir}>
      
      {/* 🩺 رأس الصفحة */}
      <div className="flex items-center gap-4 mb-6 animate-in slide-in-from-top-4">
        <div className="bg-purple-500/10 p-3 rounded-2xl border border-purple-500/20">
          <ShieldCheck className="w-8 h-8 text-purple-500" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-textPrimary tracking-wide">إدارة القسم (الاحتياط)</h1>
          <p className="text-xs font-bold text-textSecondary mt-1">
            مرحباً بك يا أستاذ {teacherInfo.name} - تشرف الآن على [{teacherInfo.departmentName || 'قسم غير محدد'}]
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 📝 نموذج إصدار التكليفات */}
        <div className="lg:col-span-5 space-y-4 animate-in slide-in-from-right-4">
          <h2 className="text-sm font-black text-textSecondary uppercase tracking-wider px-1">إصدار تكليف احتياط جديد</h2>
          <form onSubmit={handleAssign} className="glass-card p-5 rounded-3xl border border-borderColor space-y-4">
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-textSecondary px-1">اسم المعلم الغائب</label>
              <input 
                value={absentTeacher} onChange={(e) => setAbsentTeacher(e.target.value)}
                className="w-full bg-bgSoft border border-borderColor rounded-xl px-4 py-3 text-sm font-bold text-textPrimary focus:border-purple-500 outline-none transition-all"
                placeholder="مثال: أ. أحمد سالم"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-textSecondary px-1">رقم الحصة</label>
                <select 
                  value={period} onChange={(e) => setPeriod(e.target.value)}
                  className="w-full bg-bgSoft border border-borderColor rounded-xl px-4 py-3 text-sm font-bold text-textPrimary focus:border-purple-500 outline-none transition-all"
                >
                  {[1,2,3,4,5,6,7,8].map(p => <option key={p} value={p}>الحصة {p}</option>)}
                </select>
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

            <div className="space-y-1">
              <label className="text-xs font-bold text-purple-500 px-1 flex items-center gap-1">
                <UserPlus size={14} /> المعلم البديل (من القسم)
              </label>
              <input 
                value={subTeacher} onChange={(e) => setSubTeacher(e.target.value)}
                className="w-full bg-purple-500/5 border border-purple-500/20 rounded-xl px-4 py-3 text-sm font-bold text-textPrimary focus:border-purple-500 outline-none transition-all"
                placeholder="مثال: أ. خالد محمد"
              />
            </div>

            <button type="submit" className="w-full mt-2 bg-purple-500 hover:bg-purple-600 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
              <Send size={18} /> إصدار التكليف
            </button>
          </form>
        </div>

        {/* 📊 لوحة المتابعة الحية */}
        <div className="lg:col-span-7 space-y-4 animate-in slide-in-from-left-4">
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
                        {task.status === 'Executed' ? 'تم التنفيذ والفصل بأمان' : 'بانتظار التنفيذ'}
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-xs font-bold leading-relaxed">
                ملاحظة: هذه الواجهة تجريبية حالياً (Offline). في الخطوة القادمة سنقوم بربطها بالسحابة المركزية لكي تظهر التكليفات فوراً في هواتف المعلمين البدلاء وتتغير الحالة عند دخولهم الفصل!
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default SeniorDashboard;
