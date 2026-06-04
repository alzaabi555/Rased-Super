import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, MicOff, Loader2, Volume2, CheckCircle, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Student } from '../types';

interface VoiceAssistantProps {
  onNavigate?: (tab: string) => void;
}

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onNavigate }) => {
  const { t, dir, students, setStudents } = useApp(); 
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<{ message: string; type: 'info' | 'success' | 'error' | null }>({ message: '', type: null });
  
  const recognitionRef = useRef<any>(null);
  // 💉 هذا المتغير هو سر "وضع المعلم المتجول" (يضمن بقاء المايك يعمل دائماً)
  const shouldListenRef = useRef(false);

  // 💉 حماية متقدمة: ربط البيانات بـ Refs لكي لا ينقطع الصوت عند تحديث الدرجات
  const studentsRef = useRef(students);
  useEffect(() => { studentsRef.current = students; }, [students]);
  const navigateRef = useRef(onNavigate);
  useEffect(() => { navigateRef.current = onNavigate; }, [onNavigate]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const normalizeText = (text: string) => {
    return text
      .replace(/[\u064B-\u065F\u0640]/g, '')
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .toLowerCase();
  };

  // 🧠 معالجة الأوامر الذكية
  const processCommand = (command: string) => {
    if (!command.trim()) return;
    const text = normalizeText(command.trim());
    
    // استخدام studentsRef للوصول لأحدث قائمة طلاب دون إيقاف المايكروفون
    let foundStudent: Student | undefined;
    for (const s of studentsRef.current) {
      const firstName = normalizeText(s.name.split(' ')[0]);
      if (firstName.length >= 2 && text.includes(firstName)) {
        foundStudent = s;
        const secondName = s.name.split(' ').length > 1 ? normalizeText(s.name.split(' ')[1]) : '';
        if (secondName && text.includes(secondName)) {
          foundStudent = s;
          break;
        }
      }
    }

    const isNavIntent = text.match(/(افتح|روح|انتقل|عرض|هات|صفح|شاش|ودني|ورني)/);
    
    // 1️⃣ أوامر التنقل
    if (isNavIntent || !foundStudent) {
      if (text.match(/(تقرير|تقارير|احصائيات|نتايج|نتائج|شهادات|استدعاء)/)) {
        setFeedback({ message: 'جاري فتح مركز التقارير...', type: 'success' });
        speak('فتح التقارير');
        if (navigateRef.current) navigateRef.current('reports');
        return;
      }
      if (text.match(/(رئيسيه|الرئيسيه|لوحه|داشبورد|قياده|رئيسي)/)) {
        setFeedback({ message: 'العودة للرئيسية...', type: 'success' });
        speak('العودة للرئيسية');
        if (navigateRef.current) navigateRef.current('dashboard');
        return;
      }
      if (text.match(/(درجات|درجه|رصد|تقييم)/) && !text.match(/(اعط|خصم|نقص|زيد)/)) {
        setFeedback({ message: 'فتح سجل الدرجات...', type: 'success' });
        speak('سجل الدرجات');
        if (navigateRef.current) navigateRef.current('grades');
        return;
      }
      if (text.match(/(طلاب|طلبه|قائمه)/) && !foundStudent) {
        setFeedback({ message: 'فتح قائمة الطلاب...', type: 'success' });
        if (navigateRef.current) navigateRef.current('students');
        return;
      }
      if (text.match(/(مجموعات|فرق|مجموعه)/)) {
        setFeedback({ message: 'فتح المجموعات...', type: 'success' });
        if (navigateRef.current) navigateRef.current('groups');
        return;
      }
      if (text.match(/(فرسان|شرف|اوائل|متصدرين)/)) {
        setFeedback({ message: 'فتح لوحة الفرسان...', type: 'success' });
        if (navigateRef.current) navigateRef.current('leaderboard');
        return;
      }
      if (text.match(/(حضور|غياب|تحضير|سجل الغياب)/) && (!foundStudent || isNavIntent)) {
        setFeedback({ message: 'فتح سجل الغياب...', type: 'success' });
        if (navigateRef.current) navigateRef.current('attendance');
        return;
      }
    }

    // 2️⃣ أوامر الطلاب الفورية (لا توقف المايك أبداً)
    if (foundStudent) {
      if (text.match(/(غايب|غائب|غياب|غاب|مريض)/)) {
        setStudents(prev => prev.map(s => s.id === foundStudent!.id ? { ...s, attendance: [...(s.attendance || []), { date: new Date().toISOString(), status: 'absent' }] } : s));
        setFeedback({ message: `تم تسجيل غياب: ${foundStudent.name}`, type: 'success' });
        speak(`غائب`); // الرد بكلمة واحدة لعدم تشتيت الحصة
        return;
      }
      else if (text.match(/(حاضر|حضر|موجود)/)) {
        setStudents(prev => prev.map(s => s.id === foundStudent!.id ? { ...s, attendance: [...(s.attendance || []), { date: new Date().toISOString(), status: 'present' }] } : s));
        setFeedback({ message: `تم تسجيل حضور: ${foundStudent.name}`, type: 'success' });
        return;
      }
      else if (text.match(/(نجمه|نجمة|نقط|درج|ممتاز|بطل|مشارك|صح|شاطر|كفو|عظيم|مبدع)/)) {
        setStudents(prev => prev.map(s => s.id === foundStudent!.id ? { ...s, behaviors: [...(s.behaviors || []), { id: Math.random().toString(), date: new Date().toISOString(), description: 'مشاركة متميزة', type: 'positive', points: 1 }] } : s));
        setFeedback({ message: `نقطة لـ: ${foundStudent.name}`, type: 'success' });
        speak(`نقطة للبطل`);
        return;
      }
      else if (text.match(/(ازعاج|مزعج|ناقص|خصم|نايم|نام|تاخير|متاخر|خطا|غلط|سيء|ضعيف)/)) {
        setStudents(prev => prev.map(s => s.id === foundStudent!.id ? { ...s, behaviors: [...(s.behaviors || []), { id: Math.random().toString(), date: new Date().toISOString(), description: 'سلوك يحتاج تقويم', type: 'negative', points: -1 }] } : s));
        setFeedback({ message: `خصم من: ${foundStudent.name}`, type: 'success' });
        speak(`تم الخصم`);
        return;
      }
    }
  };

  useEffect(() => {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true; // 💉 السر الأول: الخط الساخن المفتوح دائماً
    recognition.interimResults = true; // 💉 سماع الكلمات وهي تنطق
    recognition.lang = 'ar-OM'; 

    recognition.onstart = () => {
      setIsListening(true);
      setFeedback({ message: 'وضع التجول مفعل: راصد يستمع بشكل مستمر...', type: 'info' });
    };

    recognition.onresult = (event: any) => {
      let interimText = '';
      let finalText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript;
        } else {
          interimText += event.results[i][0].transcript;
        }
      }

      setTranscript(interimText || finalText);

      // 💉 بمجرد أن يسكت المعلم وتكتمل الجملة، ينفذ الأمر فوراً ويستمر في الاستماع
      if (finalText) {
        processCommand(finalText);
        setTimeout(() => setTranscript(''), 2500); // تنظيف الشاشة للجملة القادمة
      }
    };

    recognition.onend = () => {
      // 💉 السر الأكبر: إذا فصل المتصفح المايك، والمعلم لم يضغط إيقاف، نشغله فوراً!
      if (shouldListenRef.current) {
        try {
          recognition.start();
        } catch (e) {}
      } else {
        setIsListening(false);
        setFeedback({ message: 'تم إيقاف المايكروفون نهائياً', type: null });
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
         shouldListenRef.current = false;
         setIsListening(false);
         setFeedback({ message: 'الرجاء السماح للتطبيق باستخدام المايكروفون', type: 'error' });
      }
      // نتجاهل خطأ no-speech لأننا في وضع الاستماع المستمر وسيعاد تشغيله
    };

    recognitionRef.current = recognition;

    // تنظيف المايك عند الخروج من التطبيق
    return () => {
       shouldListenRef.current = false;
       recognition.stop();
    }
  }, []); // 💉 المصفوفة فارغة تماماً لكي لا يُعاد تهيئة المايكروفون أبداً

  const toggleListening = useCallback(() => {
    shouldListenRef.current = !shouldListenRef.current;
    if (shouldListenRef.current) {
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.error("Start Error:", e);
      }
    } else {
      recognitionRef.current?.stop();
    }
  }, []);

  if (!SpeechRecognition) return null;

  return (
    <div className={`fixed bottom-6 ${dir === 'rtl' ? 'left-6' : 'right-6'} z-[99999] flex flex-col items-${dir === 'rtl' ? 'start' : 'end'} pointer-events-none`} dir={dir}>
      
      {(isListening || transcript || feedback.message) && (
        <div className="mb-4 bg-white/95 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-2xl p-4 max-w-sm pointer-events-auto animate-in slide-in-from-bottom-2 fade-in">
          <div className="flex items-center gap-2 mb-2">
            {isListening ? (
              <div className="flex items-center gap-1 bg-rose-100 text-rose-600 px-2 py-1 rounded-full text-[10px] font-bold animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" /> وضع التجول نشط (المايكروفون مفتوح)
              </div>
            ) : feedback.type === 'success' ? (
              <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold">
                <CheckCircle className="w-3 h-3" /> تم التنفيذ
              </div>
            ) : feedback.type === 'error' ? (
              <div className="flex items-center gap-1 text-rose-600 text-[10px] font-bold">
                <XCircle className="w-3 h-3" /> تنبيه
              </div>
            ) : (
              <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold">
                <Volume2 className="w-3 h-3" /> راصد
              </div>
            )}
          </div>
          
          <p className="text-sm font-bold text-gray-800 leading-relaxed min-h-[1.5rem]">
            {transcript || feedback.message}
          </p>
        </div>
      )}

      <button
        onClick={toggleListening}
        className={`pointer-events-auto flex items-center justify-center w-16 h-16 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 active:scale-90 ${
          isListening 
            ? 'bg-rose-500 text-white shadow-rose-500/50' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-600/30'
        }`}
      >
        {isListening ? (
          <div className="relative flex items-center justify-center">
            <Mic className="w-7 h-7 relative z-10" />
            <span className="absolute inset-0 rounded-full animate-ping bg-white/30"></span>
          </div>
        ) : (
          <MicOff className="w-7 h-7" />
        )}
      </button>
    </div>
  );
};

export default VoiceAssistant;
