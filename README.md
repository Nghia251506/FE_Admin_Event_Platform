# Lion Dance - Event Management System

Hệ thống quản lý sự kiện múa lân và tổ chức sự kiện chuyên nghiệp.

## Công nghệ sử dụng

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **TailwindCSS** - Styling
- **React Router DOM** - Routing
- **Lucide React** - Icons

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy development server:
```bash
npm run dev
```

3. Build production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Cấu trúc thư mục

```
src/
├── components/     # Layout components (Sidebar, Header, Layout)
├── pages/         # Page components (Dashboard, Events, etc.)
├── types/         # TypeScript type definitions
├── App.tsx        # Router configuration
├── main.tsx       # Entry point
└── index.css      # Global styles
```

## Tính năng

- ✅ Dashboard với thống kê tổng quan
- ✅ Quản lý sự kiện
- ✅ Quản lý đội lân
- ✅ Sidebar có thể thu phóng (WordPress-style)
- ✅ Responsive design
- ✅ Dark theme chuyên nghiệp
- ✅ Animations & transitions

## Tích hợp API

Project này được thiết kế để dễ dàng tích hợp với backend API. Bạn có thể:

1. Tạo service layer trong `src/services/`
2. Thêm API endpoints configuration
3. Sử dụng fetch hoặc axios để gọi API
4. Cập nhật components để sử dụng data từ API

## License

MIT
