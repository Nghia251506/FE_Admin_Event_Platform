import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Thêm cái này để xử lý alias chuẩn hơn

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Dùng path.resolve để đảm bảo đường dẫn tuyệt đối, 
      // Vercel build sẽ không bị lạc đường
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Tăng giới hạn cảnh báo kích thước file nếu dashboard của ông giáo nhiều thư viện nặng
    chunkSizeWarningLimit: 1600,
  },
})