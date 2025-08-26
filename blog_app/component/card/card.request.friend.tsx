import Image from "next/image";
import Link from "next/link";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { getUserById } from "@/app/api/AuthApi";

import { acceptFriendRequest, removeFriendRequest } from "@/app/api/FriendApi";

const CardRequestFriend = ({ userId }: { userId: string }) => {
  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });

  const user = userData?.data;
  const queryClient = useQueryClient();
  const acceptFriendRequestMutation = useMutation({
    mutationFn: (friend_id: string) => acceptFriendRequest(friend_id),
  });

  const handleAcceptFriendRequest = (
    event: React.MouseEvent<HTMLButtonElement>,
    friend_id: string
  ) => {
    event.preventDefault();
    acceptFriendRequestMutation.mutate(friend_id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["friendRequests"],
        });
        alert("Đã chấp nhận yêu cầu kết bạn.");
      },
      onError: (error) => {
        console.error("Error accepting friend request:", error);
        alert("Đã có lỗi xảy ra khi chấp nhận yêu cầu kết bạn.");
      },
    });
  };

  const removeFriendRequestMutation = useMutation({
    mutationFn: (data: { friend_id: string }) =>
      removeFriendRequest(data.friend_id),
  });
  const user_id = user?._id;
  const handleRemoveFriendRequest = (
    event: React.MouseEvent<HTMLButtonElement>,
    friend_id: string
  ) => {
    event.preventDefault();
    removeFriendRequestMutation.mutate(
      {
        friend_id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["friendRequests"],
          });
          alert("Đã hủy yêu cầu kết bạn.");
        },
        onError: (error) => {
          console.error("Error removing friend request:", error);
          alert("Đã có lỗi xảy ra khi hủy yêu cầu kết bạn.");
        },
      }
    );
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <Link href={`/user/${user?.slug}`}>
        <div className="relative">
          <Image
            className="w-full clippy"
            src={user?.avatar?.url || "/avatar.png"}
            alt="Sunset in the mountains"
            width={500}
            height={500}
          />
        </div>
        <div className="pt-3 pb-5 px-5 flex flex-col items-center gap-3.5">
          <p className="font-bold text-2xl">
            {user?.full_name || "Unknown User"}
          </p>

          <div className="  w-full">
            <div className=" mb-3">
              {" "}
              <button
                title="Chấp nhận yêu cầu"
                className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md w-full"
                onClick={(event) => handleAcceptFriendRequest(event, user._id)}
              >
                Trả lời
              </button>
            </div>
            <div className="">
              {" "}
              <button
                className="bg-gray-400 text-white text-sm px-4 py-2 rounded-md w-full"
                onClick={(event) => handleRemoveFriendRequest(event, user._id)}
              >
                Từ chối
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CardRequestFriend;
