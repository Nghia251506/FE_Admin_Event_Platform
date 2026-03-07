import { useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../../lib/firebaseConfig"; // Check lại path này
import { useAppDispatch, useAppSelector } from "../../hooks/useAppRedux";
import { registerFcmToken, receiveNotification } from "../../store/slices/fcmSlice";
import { toast } from 'react-toastify';

export const FCMInitializer = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { isRegistered } = useAppSelector((state) => state.fcm);

    // 1. Logic Đăng ký Token (Xin quyền và gửi lên BE)
    useEffect(() => {
        const setupFCM = async () => {
            // Chỉ chạy khi có user, chưa đăng ký token và messaging tồn tại
            if (user?.id && !isRegistered && messaging) {
                try {
                    const permission = await Notification.requestPermission();
                    if (permission === "granted") {
                        const token = await getToken(messaging, {
                            vapidKey: "BBTUhjveP6qB3Hi5Tucv53td40FymzdGJ8TSvpcOPI9Wnu2ecwvx_X5uZ3IHTTby_kA3Sq4yNHF_kqDgUisxks4"
                        });

                        if (token) {
                            console.log("FCM Token registered:", token);
                            // Gửi token lên BE để lưu vào DB
                            dispatch(registerFcmToken({ userId: user.id, token }));
                        }
                    } else {
                        console.warn("User từ chối quyền thông báo");
                    }
                } catch (error) {
                    console.error("Lỗi cấu hình FCM:", error);
                }
            }
        };
        setupFCM();
    }, [user?.id, isRegistered, dispatch]);

    // 2. Logic Lắng nghe tin nhắn (Foreground)
    useEffect(() => {
        if (!messaging) return;

        const unsubscribe = onMessage(messaging, (payload) => {
            console.log("Nhận tin nhắn Foreground:", payload);

            // Ưu tiên lấy data từ Backend gửi về
            const data = payload.data;
            
            if (data && data.type) {
                // Bắn vào Redux để ToastFCMContainer xử lý hiển thị & âm thanh
                dispatch(receiveNotification(data));
            } else {
                // Nếu là thông báo thuần (Notification payload) không có data type
                toast.info(
                    <div>
                        <p className="font-bold">{payload.notification?.title}</p>
                        <p className="text-sm">{payload.notification?.body}</p>
                    </div>
                );
                // Phát âm thanh mặc định
                new Audio("/sounds/notification.mp3").play().catch(() => {});
            }
        });

        return () => unsubscribe();
    }, [dispatch]);

    return null;
};