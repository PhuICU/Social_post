import React, {
  useEffect,
  useState,
  lazy,
  Suspense,
  useMemo,
  useRef,
  use,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createFriendRequest,
  getFriendRequests,
  getSentFriendRequests,
  removeFriendRequest,
  acceptFriendRequest,
  getFriends,
  blockUser,
} from "@/app/api/FriendApi";
interface ButtonFriendProps {
  userId: string;
  customUserId: string;
}

const ButtonFriend = ({ userId, customUserId }: ButtonFriendProps) => {
  const addFriendRequestMutation = useMutation({
    mutationFn: (data: { user_id: string; friend_id: string }) =>
      createFriendRequest(data.user_id, data.friend_id),
  });

  const queryClient = useQueryClient();
  console.log("User ID:", userId);
  console.log("Custom User Data:", customUserId);
  const handleAddFriend = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!userId || !customUserId) {
      alert("Không thể gửi yêu cầu kết bạn: thiếu thông tin người dùng.");
      return;
    }
    addFriendRequestMutation.mutate(
      {
        user_id: userId,
        friend_id: customUserId,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["friendRequests"],
          });
          alert("Yêu cầu kết bạn đã được gửi!");
        },
        onError: (error) => {
          console.error("Error sending friend request:", error);
          alert("Đã có lỗi xảy ra khi gửi yêu cầu kết bạn.");
        },
      }
    );
  };

  const removeFriendRequestMutation = useMutation({
    mutationFn: (data: { friend_id: string }) =>
      removeFriendRequest(data.friend_id),
  });
  const user_id = userId;
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
          queryKey: ["friends", user_id],
        });
        alert("Đã chấp nhận yêu cầu kết bạn.");
      },
      onError: (error) => {
        console.error("Error accepting friend request:", error);
        alert("Đã có lỗi xảy ra khi chấp nhận yêu cầu kết bạn.");
      },
    });
  };

  const blockMutation = useMutation({
    mutationFn: (friend_id: string) => blockUser(friend_id),
  });

  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests", user_id],
    queryFn: () => {
      if (!user_id) throw new Error("User ID is undefined");
      return getFriendRequests(user_id);
    },
    enabled: !!user_id,
  });

  const friendRequestsData = useMemo(
    () => friendRequests?.data,
    [friendRequests?.data]
  );

  const { data: sentFriendRequests } = useQuery({
    queryKey: ["friendRequests", customUserId],
    queryFn: () => {
      if (!customUserId) throw new Error("User ID is undefined");
      return getSentFriendRequests(customUserId);
    },
    enabled: !!customUserId,
  });

  const sentFriendRequestsData = useMemo(
    () => sentFriendRequests?.data,
    [sentFriendRequests?.data]
  );

  const { data: friendsData } = useQuery({
    queryKey: ["friends", user_id],
    queryFn: () => {
      if (!user_id) throw new Error("User ID is undefined");
      return getFriends(user_id);
    },
    enabled: !!user_id,
  });

  const friendsDataList = useMemo(() => friendsData?.data, [friendsData?.data]);
  return (
    <>
      {userId !== customUserId ? (
        friendsDataList?.includes(customUserId) ? (
          // Đã là bạn bè
          <button
            className="bg-gray-400 text-white text-sm px-4 py-2 rounded-md cursor-default"
            disabled
          >
            Bạn bè
          </button>
        ) : sentFriendRequestsData?.includes(customUserId) ? (
          // Đã gửi yêu cầu → hiển thị "Đã gửi yêu cầu"
          <button
            className="bg-gray-500 text-white text-sm px-4 py-2 rounded-md"
            onClick={(event) => handleRemoveFriendRequest(event, customUserId)}
          >
            Đã gửi yêu cầu
          </button>
        ) : friendRequestsData?.includes(customUserId) ? (
          // Nhận được yêu cầu → hiển thị "Trả lời"
          <div className="">
            <button
              title="Chấp nhận yêu cầu"
              className="bg-green-500 text-white text-sm px-4 py-2 rounded-md"
              onClick={(event) =>
                handleAcceptFriendRequest(event, customUserId)
              }
            >
              Trả lời
            </button>
            <button
              className="bg-gray-600 text-white text-sm px-4 py-2 rounded-md mx-2"
              onClick={(event) =>
                handleRemoveFriendRequest(event, customUserId)
              }
            >
              Từ chối yêu cầu
            </button>
          </div>
        ) : (
          // Không có yêu cầu nào → hiển thị "Kết bạn"
          <button
            className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md"
            onClick={handleAddFriend}
          >
            Kết bạn
          </button>
        )
      ) : null}
    </>
  );
};

export default ButtonFriend;
