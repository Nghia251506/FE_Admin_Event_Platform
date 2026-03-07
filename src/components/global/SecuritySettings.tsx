/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ShieldCheck,
  Lock,
  Users,
  ChevronDown,
  Check,
  Save,
  Loader2,
} from "lucide-react";
import { RootState, AppDispatch } from "@/store/store";
import {
  fetchUsers,
  fetchUserDetail,
  assignPermissions,
  changeUserPassword,
} from "@/store/slices/userSlice";
import { toast } from "react-toastify"; // Giả sử ông dùng toast để báo thành công
import { fetchPermissions } from "@/store/slices/permissionSlice";

const SecuritySettings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // 1. Lấy dữ liệu từ Redux
  const {
    users,
    currentUser: selectedUser,
    loading,
  } = useSelector((state: RootState) => state.users);
  const authUser = useSelector((state: RootState) => state.auth.user); // User đang đăng nhập
  const { permissions: systemPermissions, loading: permLoading } = useSelector(
    (state: RootState) => state.permissions,
  );

  // 2. State local cho UI
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPermIds, setSelectedPermIds] = useState<Set<number>>(
    new Set(),
  );

  // Giả lập danh sách quyền hệ thống (Sau này ông nên fetch từ permissionService)

  const isAdmin =
    authUser?.roleName === "SUPER_ADMIN" || authUser?.roleName === "ADMIN";

  // 3. Effect: Load danh sách nhân viên khi vào trang
  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchUsers({ page: 0, size: 100 }));
      dispatch(fetchPermissions());
    }
  }, [dispatch, isAdmin]);

  // 4. Effect: Khi chọn 1 User, lấy chi tiết để biết họ đang có những quyền gì
  useEffect(() => {
    if (selectedUserId) {
      dispatch(fetchUserDetail(selectedUserId)).then((action: any) => {
        if (action.payload && action.payload.permissions) {
          // Lấy danh sách quyền từ detail (đang là mảng String tên quyền hoặc Object)
          const userPermsFromBE = action.payload.permissions;

          // Tìm các ID tương ứng trong danh sách systemPermissions để set vào state
          const matchedIds = systemPermissions
            .filter((sysPerm) =>
              userPermsFromBE.some((p: any) => {
                // Nếu BE trả về mảng String ["EVENT_VIEW", ...]
                if (typeof p === "string") return p === sysPerm.name;
                // Nếu BE trả về mảng Object [{id: 1, name: "..."}]
                return p.id === sysPerm.id || p.name === sysPerm.name;
              }),
            )
            .map((sysPerm) => sysPerm.id);

          setSelectedPermIds(new Set(matchedIds));
        } else {
          // Nếu user chưa có quyền nào, reset về trống
          setSelectedPermIds(new Set());
        }
      });
    }
  }, [selectedUserId, dispatch, systemPermissions]);

  // 5. Logic xử lý Tích/Bỏ tích quyền
  const togglePermission = (permId: number) => {
    const newSet = new Set(selectedPermIds);
    newSet.has(permId) ? newSet.delete(permId) : newSet.add(permId);
    setSelectedPermIds(newSet);
  };

  const handleSavePermissions = async () => {
    if (!selectedUserId) return;
    const result = await dispatch(
      assignPermissions({
        id: selectedUserId,
        permissionIds: Array.from(selectedPermIds),
      }),
    );
    if (assignPermissions.fulfilled.match(result)) {
      toast.success("Cập nhật quyền thành công!");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* SECTION 1: ĐỔI MẬT KHẨU (Giữ nguyên UI, chỉ cần thêm gọi changeUserPassword khi submit) */}
      <section className="space-y-6">
        <div className="flex items-center space-x-2 border-b border-dark-700 pb-4">
          <Lock className="text-orange-500" size={24} />

          <h2 className="text-xl font-bold text-white">Bảo mật & Mật khẩu</h2>
        </div>

        <div className="max-w-md space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Mật khẩu hiện tại</label>

            <input
              type="password"
              className="w-full bg-dark-900 border border-dark-600 p-2.5 rounded-lg text-white outline-none focus:border-orange-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Mật khẩu mới</label>

              <input
                type="password"
                className="w-full bg-dark-900 border border-dark-600 p-2.5 rounded-lg text-white outline-none focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Xác nhận mật khẩu</label>

              <input
                type="password"
                className="w-full bg-dark-900 border border-dark-600 p-2.5 rounded-lg text-white outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-bold transition active:scale-95 shadow-lg shadow-orange-900/20">
            Cập nhật mật khẩu
          </button>
        </div>
      </section>

      {/* SECTION 2: QUẢN LÝ QUYỀN HẠN */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center space-x-2 border-b border-dark-700 pb-4">
          <ShieldCheck className="text-green-500" size={24} />
          <h2 className="text-xl font-bold text-white">
            {isAdmin ? "Quản lý quyền nhân viên" : "Quyền hạn của bạn"}
          </h2>
        </div>

        {isAdmin ? (
          <div className="space-y-6">
            {/* Dropdown chọn User */}
            <div className="space-y-3">
              <label className="text-sm text-gray-400 flex items-center gap-2">
                <Users size={16} /> Chọn nhân viên ({users?.length || 0})
              </label>
              <div className="relative max-w-sm">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-dark-900 border border-dark-600 p-3 rounded-lg text-white flex items-center justify-between"
                >
                  <span>
                    {users?.find((u) => u.id === selectedUserId)?.fullName ||
                      "Chọn một thành viên..."}
                  </span>
                  <ChevronDown
                    size={18}
                    className={isDropdownOpen ? "rotate-180" : ""}
                  />
                </button>
                {isDropdownOpen && (
                  <div className="absolute z-20 w-full mt-2 bg-dark-800 border border-dark-600 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
                    <div className="max-h-60 overflow-y-auto">
                      {users?.map((user) => (
                        <div
                          key={user.id}
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setIsDropdownOpen(false);
                          }}
                          className="p-3 hover:bg-blue-600/20 cursor-pointer flex items-center justify-between group border-b border-dark-700 last:border-0"
                        >
                          <div>
                            <p className="text-white font-medium text-sm">
                              {user.fullName}
                            </p>
                            <p className="text-[10px] text-gray-500 uppercase">
                              {user.roleName}
                            </p>
                          </div>
                          {selectedUserId === user.id && (
                            <Check size={16} className="text-blue-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bảng phân quyền từ DB */}
            {selectedUserId && (
              <div className="bg-dark-900/40 p-6 rounded-2xl border border-blue-900/20 border-dashed animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-sm text-blue-400 font-semibold">
                    Thiết lập quyền cho:{" "}
                    <span className="text-white underline">
                      {selectedUser?.fullName}
                    </span>
                  </p>
                  {(permLoading || permLoading) && (
                    <Loader2 className="animate-spin text-blue-500" size={20} />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {systemPermissions?.length > 0 ? (
                    systemPermissions.map((perm) => {
                      const isChecked = selectedPermIds.has(perm.id);
                      return (
                        <button
                          key={perm.id}
                          onClick={() => togglePermission(perm.id)}
                          className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                            isChecked
                              ? "bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                              : "bg-dark-800 border-dark-700 text-gray-500 hover:border-gray-500"
                          }`}
                        >
                          <div className="text-left">
                            <p
                              className={`text-sm font-bold ${isChecked ? "text-white" : ""}`}
                            >
                              {perm.name}
                            </p>
                            <p className="text-[11px] opacity-70">
                              {perm.description || "Quyền hệ thống"}
                            </p>
                          </div>

                          {/* Vòng tròn check */}
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                              isChecked
                                ? "bg-blue-500 border-blue-500"
                                : "border-dark-600"
                            }`}
                          >
                            {isChecked && (
                              <Check
                                size={12}
                                className="text-white"
                                strokeWidth={4}
                              />
                            )}
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 italic text-sm">
                      Chưa có quyền nào được định nghĩa trên hệ thống.
                    </p>
                  )}
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleSavePermissions}
                    disabled={permLoading}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-8 py-2.5 rounded-lg font-bold shadow-lg"
                  >
                    {permLoading ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Save size={18} />
                    )}
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* NHÂN VIÊN XEM QUYỀN CỦA MÌNH */
          <div className="bg-dark-900/50 p-5 rounded-2xl border border-dark-700 shadow-inner">
            <p className="text-sm text-gray-400 mb-4 italic">
              Danh sách quyền hạn của bạn:
            </p>
            <div className="flex flex-wrap gap-2">
              {authUser?.permissions?.map((perm: any) => (
                <span
                  key={perm.id || perm}
                  className="px-3 py-1.5 bg-dark-700 text-green-400 text-[10px] font-bold rounded-md border border-green-900/30"
                >
                  ● {typeof perm === "string" ? perm : perm.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default SecuritySettings;
