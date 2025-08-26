import { useMemo, useState, useRef, useEffect, lazy } from "react";
import useUserStore from "@/app/store/useUserStore";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getPostById } from "@/app/api/PostApi";

const CardPost = lazy(() => import("@/component/card/card.post"));
interface PostModalProps {
  postId: string | null;
  setIsOpenModal: (isOpen: boolean) => void;
}
const ModalPost: React.FC<PostModalProps> = ({ postId, setIsOpenModal }) => {
  const user = useUserStore((state) => state.user);

  const [post, setPost] = useState<any>(null);
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostById(postId!),
    enabled: !!postId,
  });

  const postData = useMemo(() => data?.data, [data?.data]);
  console.log("postData", postData);

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
      <div className="flex items-center justify-center min-h-screen">
        <div
          ref={modalRef}
          className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl"
        >
          {isLoading && <p>Loading...</p>}
          {error && <p>Error fetching post details</p>}
          {postData && <CardPost data={postData} />}
        </div>
      </div>
    </div>
  );
};

export default ModalPost;
