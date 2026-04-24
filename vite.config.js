import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 💉 الحقنة الوقائية: هذا السطر يمنع الشاشة البيضاء في تطبيقات الهاتف
  base: './', 
})