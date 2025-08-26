"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import useUserStore from "@/app/store/useUserStore";
import { getFriends } from "@/app/api/FriendApi";
import { getUserBySlug } from "@/app/api/AuthApi";
import CardFriend from "@/component/card/card.friend";

const FriendsPage = () => {
  const slug = useParams<{ slug: string }>().slug;

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["user", slug],
    queryFn: () => getUserBySlug(slug),
  });

  const user = userData?.data || [];
  const { data: friendsData, isLoading: friendsLoading } = useQuery({
    queryKey: ["friends", user._id],
    queryFn: () => getFriends(user._id),
    // enabled: !!user.id,
  });

  const friendsList = friendsData?.data || [];
  console.log(friendsList, user._id, slug);
  if (userLoading) return <div>Loading...</div>;

  return (
    <div className="mt-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
        <h5 className="font-bold text-lg">Bạn bè</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {friendsList?.map((friend: any) => (
            <div key={friend} className="flex items-center ">
              <CardFriend userId={friend} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
