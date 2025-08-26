import { useRef, useEffect } from "react";

interface CustomPostModalProps {
  setIsOpenModal: (isOpen: boolean) => void;
}

const ModalCustomPost: React.FC<CustomPostModalProps> = ({
  setIsOpenModal,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
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
    document.body.classList.add("modal-open");

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.classList.remove("modal-open");
    };
  }, [setIsOpenModal]);
  return (
    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          ref={modalRef}
          className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-lvh sm:max-w-lg"
        >
          <ul className="flex flex-col gap-2 p-4 items-center">
            <li className="border-b border-gray-200 pb-2">Báo cáo</li>
            <li className="border-b border-gray-200 pb-2">Bỏ theo dõi</li>
            <li className="border-b border-gray-200 pb-2">
              Thêm vào mục yêu thích
            </li>
            <li className="border-b border-gray-200 pb-2">Đi đến bài viết</li>
            <li className="border-b border-gray-200 pb-2">Ẩn bài viết</li>
            <li className="text-gray-700" onClick={() => setIsOpenModal(false)}>
              Hủy
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ModalCustomPost;
