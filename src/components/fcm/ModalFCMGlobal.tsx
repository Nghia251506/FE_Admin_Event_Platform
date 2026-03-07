import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppRedux"; // Chỉnh lại path cho đúng dự án
import { closeFcmModal } from "@/store/slices/fcmSlice";
import { useNavigate } from "react-router-dom"; // Dùng useNavigate thay cho useRouter
import { toast } from "react-toastify";

const ToastFCMContainer = () => {
  const { isModalOpen, currentNotification } = useAppSelector(
    (state) => state.fcm,
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isModalOpen && currentNotification) {
      const { type, message, eventId, sound } = currentNotification;

      // 1. Xử lý âm thanh từ thư mục /public/sounds/
      if (sound) {
        const audio = new Audio(`/sounds/${sound}`);
        audio
          .play()
          .catch(() => console.warn("Trình duyệt chặn phát nhạc tự động"));
      }

      // 2. Cấu hình Toast theo từng loại nghiệp vụ của đoàn lân
      const toastOptions = {
        onClick: () => {
          if (eventId) {
            // Tùy vào role mà navigate về page tương ứng
            // Ví dụ: navigate(`/dashboard/events/${eventId}`);
            navigate(`/events/${eventId}`);
          }
        },
      };

      switch (type) {
        case "MEMBER_ACCEPTED":
          toast.success(`✅ ${message}`, toastOptions);
          break;

        case "MEMBER_REJECTED":
          toast.error(`⚠️ ${message}`, { ...toastOptions, autoClose: 8000 });
          break;

        case "NEW_EVENT_ASSIGNED":
          // Bọc emoji vào span
          toast.info(`🐲 Show mới: ${message}`, {
            ...toastOptions,
            icon: <span>📅</span>,
          });
          break;

        case "CONCENTRATE_REMINDER":
          toast.warning(`⏰ Tập trung: ${message}`, {
            icon: <span>📍</span>,
            autoClose: false,
          });
          break;

        case "TEAM_ANNOUNCEMENT":
          toast.info(`📢 Thông báo đoàn: ${message}`);
          break;

        case "EVENT_AUTO_COMPLETED":
          toast.success(`🎊 ${message}`, { icon: <span>🏆</span> });
          break;

        default:
          toast(message || "Bạn có thông báo mới!");
          break;
      }

      // 3. Bắn xong thì reset state ngay để tránh lặp lại
      dispatch(closeFcmModal());
    }
  }, [isModalOpen, currentNotification, dispatch, navigate]);

  return null; // Không cần render UI vì chỉ dùng Toast
};
export default ToastFCMContainer;