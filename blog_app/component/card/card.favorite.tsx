import React from "react";

export interface Post {
  _id: string;
  content: string;
  poster_id: string;
  images: string[];
  video: string[];
  like: number;
  view: number;
}

const CardFavorite = ({ data }: { data: Post }) => {
  return (
    <div className="border border-gray-300  rounded-md shadow-sm">
      <div className="relative bg-white   bottom-0 rounded shadow-md hover:shadow-primary-400">
        <div className="relative">
          <div className="relative w-full aspect-video bottom-0 rounded-t-md overflow-hidden">
            {data.images?.length > 0 && (
              <div className="mb-2">
                <img
                  src={data.images[0]}
                  alt="Post"
                  className="w-full h-auto rounded-md"
                />
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-b from-gray-800 to-gray-500 text-white opacity-80 hover:opacity-100 transition-opacity duration-300">
              <p className="text-lg font-semibold text-white">{data.content}</p>
            </div>
          </div>
        </div>
      </div>

      {data.video?.length > 0 && (
        <div className="mb-2">
          <video controls className="w-full h-auto rounded-md">
            <source src={data.video[0]} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      <div className="flex justify-between text-sm text-gray-500 p-3">
        <span>Likes: {data.like}</span>
        <span>Views: {data.view}</span>
      </div>
    </div>
  );
};
export default CardFavorite;
