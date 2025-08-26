"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { getFriendRequests, getFriends } from "@/app/api/FriendApi";

import { useQuery } from "@tanstack/react-query";
import useUserStore from "@/app/store/useUserStore";

import CardRequestFriend from "@/component/card/card.request.friend";
import CardFriend from "@/component/card/card.friend";

export default function Page() {
  const user = useUserStore((state) => state.user);
  const userId = user?._id;
  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: () => (userId ? getFriendRequests(userId) : undefined),
    enabled: !!userId,
  });

  const friendRequestsList = useMemo(
    () => friendRequests?.data || [],
    [friendRequests]
  );

  const { data: friends, isLoading: isFriendsLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: () => (userId ? getFriends(userId) : undefined),
    enabled: !!userId,
  });

  const friendsList = useMemo(() => friends?.data || [], [friends]);

  return (
    <div className="ml-33 mt-3">
      <div className="bg-white rounded-md shadow-md p-4 mr-2.5">
        <div className="mb-4">
          <h5 className="font-bold text-lg">Lời mời kết bạn</h5>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
          {friendRequestsList.map((request: any) => (
            <div key={request._id}>
              <CardRequestFriend userId={request} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 bg-white rounded-md shadow-md p-4 mr-2.5">
        <h5 className="font-bold text-lg mt-2">Danh sách bạn bè</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
          {friendsList.map((friend: any, index: number) => (
            <div key={index} className="mb-4 col-span-1">
              <CardFriend userId={friend} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
