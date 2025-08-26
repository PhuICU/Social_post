import React, {
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useState,
} from "react";

import useUserStore from "@/app/store/useUserStore";
import { lockAccount, unlockAccount } from "@/app/api/AuthApi";

import Alert from "@/component/Alert";

interface CreatePostModalProps {
  setIsOpenModal: (isOpen: boolean) => void;
}

const ModalCustomAccount: React.FC<CreatePostModalProps> = ({
  setIsOpenModal,
}) => {
  const user = useUserStore((state) => state.user);
  const modalRef = useRef<HTMLDivElement>(null);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);

  const alertTimeoutHandler = useMemo(() => {
    return (message: string, type: "success" | "error" | "warning") => {
      setAlert({ message, type });
      setTimeout(() => {
        setAlert(null);
      }, 3000);
    };
  }, []);

  const handleLockAccount = async () => {
    try {
      if (user) {
        await lockAccount(user._id);
        alertTimeoutHandler("Account locked successfully.", "success");
        useUserStore.getState().setUser({ ...user, verify: "BLOCKED" });
      }
    } catch (error) {
      console.error("Error locking account:", error);
      alertTimeoutHandler("Failed to lock account.", "error");
    }
  };

  const handleUnlockAccount = async () => {
    try {
      if (user) {
        await unlockAccount(user._id);
        alertTimeoutHandler("Account unlocked successfully.", "success");
        useUserStore.getState().setUser({ ...user, verify: "ACTIVE" });
      }
    } catch (error) {
      console.error("Error unlocking account:", error);
      alertTimeoutHandler("Failed to unlock account.", "error");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpenModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          ref={modalRef}
          className="relative transform overflow-hidden mt-9 rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
        >
          <div className="px-4 pt-5 py-3 items-center justify-center flex border border-t-0 border-x-0">
            <h3 className="font-semibold">Tùy chọn tài khoản</h3>
          </div>
          <div className=" justify-center flex flex-col gap-4 px-4 py-3 items-center ">
            <div className=" border border-t-0 border-x-0 w-full  items-center justify-center flex pb-4">
              {user?.verify !== "BLOCKED" ? (
                <button className="text-red-500" onClick={handleLockAccount}>
                  Khóa tài khoản
                </button>
              ) : (
                <button
                  className="text-green-500"
                  onClick={handleUnlockAccount}
                >
                  Mở khóa tài khoản
                </button>
              )}
            </div>
            <div className="border border-t-0 border-x-0 w-full  items-center justify-center flex pb-4">
              <button className="text-red-500">Xóa tài khoản</button>
            </div>
            <div className=" w-full  items-center justify-center flex pb-1.5">
              <button
                className="text-gray-500"
                onClick={() => setIsOpenModal(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
};

export default ModalCustomAccount;
