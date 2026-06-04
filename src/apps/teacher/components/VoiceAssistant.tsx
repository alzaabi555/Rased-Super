import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, MicOff, Loader2, Volume2, CheckCircle, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const VoiceAssistant: React.FC = () => {
  const { t, dir } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<{ message: string; type: 'info' | 'success' | 'error' | null }>({ message: '', type: null });
  
  const recognitionRef = useRef<any>(null);
  const latestTextRef = useRef<string>(''); 

  // 🗣️ محرك النطق
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // 🧠 محرك تحليل الأوامر
  const processCommand = (command: string) => {
    if (!command.trim()) return;
    const text = command.trim();
    
    if (text.includes('تقارير') || text.includes('إحصائيات') || text.includes('احصائيات')) {
      setFeedback({ message: 'جاري فتح مركز التقارير...', type: 'success' });
      speak('حاضر، جاري فتح مركز التقارير والإحصائيات');
      return;
    }

    if (text.includes('غائب') || text.includes('غياب')) {
      setFeedback({ message: 'تم رصد الغياب بنجاح', type: 'success' });
      speak('تم تسجيل الطالب غائباً في النظام');
      return;
    }

    if (text.includes('نجمة') || text.includes('ممتاز') || text.includes('مشاركة')) {
      setFeedback({ message: 'تم إضافة نقطة تعزيز', type: 'success' });
      speak('تم إضافة نقطة إيجابية للطالب');
      return;
    }

    setFeedback({ message: `لم أتعرف على الأمر: "${text}"`, type: 'error' });
    speak('عذراً، لم أفهم الأمر جيداً، هل يمكنك الإعادة؟');
  };

  useEffect(() => {
    if (!SpeechRecognition) {
      setFeedback({ message: 'المتصفح أو الجوال لا يدعم الأوامر الصوتية', type: 'error' });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'ar-OM'; 

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      latestTextRef.current = ''; 
      setFeedback({ message: 'راصد يستمع إليك...', type: 'info' });
    };

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
      latestTextRef.current = currentTranscript; 
    };

    recognition.onend = () => {
      setIsListening(false);
      const finalText = latestTextRef.current;
      
      if (finalText) {
        processCommand(finalText);
      } else {
        setFeedback({ message: 'تم إيقاف المايكروفون', type: null });
      }
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      // معالجة خطأ الرفض الأمني في الجوالات
      if (event.error === 'not-allowed') {
         setFeedback({ message: 'الرجاء السماح للتطبيق باستخدام المايكروفون من إعدادات الهاتف', type: 'error' });
      } else {
         setFeedback({ message: `حدث خطأ: ${event.error}`, type: 'error' });
      }
    };

    recognitionRef.current = recognition;
  }, []);

  // 💉 الجراحة الأمنية: إجبار الجوال على إظهار رسالة (هل تسمح للتطبيق باستخدام المايكروفون؟)
  const toggleListening = useCallback(async () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        // نطلب إذن المايكروفون بشكل صريح أولاً (هذا يفتح نافذة الموافقة في الجوالات)
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
           const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
           // بمجرد الموافقة، نغلق هذا المسار لأننا نريد تشغيل مسار الذكاء الاصطناعي بدلاً منه
           stream.getTracks().forEach(track => track.stop());
        }
        
        // الآن بعد أخذ الإذن، نشغل محرك الاستماع الذكي
        recognitionRef.current?.start();
      } catch (e) {
        console.error("Microphone permission denied", e);
        setFeedback({ message: 'عذراً، يجب إعطاء الإذن لاستخدام المايكروفون أولاً!', type: 'error' });
      }
    }
  }, [isListening]);

  if (!SpeechRecognition) return null;

  return (
    <div className={`fixed bottom-6 ${dir === 'rtl' ? 'left-6' : 'right-6'} z-[99999] flex flex-col items-${dir === 'rtl' ? 'start' : 'end'} pointer-events-none`} dir={dir}>
      
      {(isListening || transcript || feedback.message) && (
        <div className="mb-4 bg-white/95 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-2xl p-4 max-w-sm pointer-events-auto animate-in slide-in-from-bottom-2 fade-in">
          <div className="flex items-center gap-2 mb-2">
            {isListening ? (
              <div className="flex items-center gap-1 bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-[10px] font-bold animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" /> راصد يستمع...
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
